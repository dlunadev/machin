import { Begin, Calendar, Clock, Pause, PauseIcon, Play, Resumed, Shift, Square } from '@/assets/svg';
import { Client } from '@/sdk/domain/client/client.entity';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftClientAdapter } from '@/sdk/infraestructure/clients-shift/clients-shift.supabase';
import { LocationAdapter } from '@/sdk/infraestructure/location/location.supabase';
import { ShiftStatusAdapter } from '@/sdk/infraestructure/shift-status/shift-status.supabase';
import { ShiftSupabaseAdapter } from '@/sdk/infraestructure/shift/supabase/shift.supabase';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import {
  ActionSheet,
  Button,
  Center,
  CheckIcon,
  Container,
  HStack,
  InfoBlock,
  Input,
  Modal,
  Select,
  SummaryBlock,
  Text,
  TurnActions,
  TurnContent,
  TurnHeader,
  VStack,
} from '@/src/components';
import styles from '@/src/components/select/select.style';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '@/src/components/ui/checkbox';
import { Colors } from '@/src/constants/Colors';
import { formatDate, formatTime } from '@/src/helpers/date-formatter';
import { useClients, useMe, useShift, useShiftActive, useZones } from '@/src/hooks/services';
import { useInsets } from '@/src/hooks/utils/useInsets';
import { useLocation } from '@/src/hooks/utils/useLocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, FlatList, Pressable, View } from 'react-native';

const { create, update } = new ShiftSupabaseAdapter();
const { create: create_status } = new ShiftStatusAdapter();
const { create: create_location } = new LocationAdapter();
const { create_clients_shift } = new ShiftClientAdapter();

export default function Home() {
  const insets = useInsets();
  const [shiftId, setShiftId] = useState<string | null>('');
  const [state, setState] = useState<ShiftStatus>(ShiftStatus.IDLE);
  const [zone, setZone] = useState<Zone | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [showSheet, setShowSheet] = useState(false);
  const [clientsOrder, setClientsOrder] = useState<{ client_id: string; order: number }[]>([]);
  const { shift, mutate } = useShift(shiftId as string);
  const { zones, isLoading, loadMore } = useZones(10, search);
  const { clients, isLoading: isLoadingClients, loadMore: loadMoreClients } = useClients(10, searchClient, shift?.zone_id);
  const { user } = useMe();
  const [finalizeShift, setFinalizeShift] = useState<WebhookShift | null>(null);
  const [shiftLoader, setShiftLoader] = useState(false);
  const { location, modalShown, openSettings } = useLocation((coords) => {
    if (shiftId && shift?.status !== ShiftStatus.FINISHED) {
      create_location({
        shift_id: shiftId as string,
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
        accuracy: String(coords.accuracy),
      });
    }
  });

  const { active_shift } = useShiftActive(user?.id as string);

  const handleStart = async () => {
    setShiftLoader(true);
    if (!zone) return;
    const shift = await create({
      seller_id: user?.id as string,
      zone_id: zone?.id as string,
    });

    await create_status({
      shift_id: shift.id as string,
      action: ShiftStatus.STARTED,
    });

    setShiftId(shift.id as string);
    setState(ShiftStatus.STARTED);
    setShiftLoader(false);
  };

  const toggleClient = (item: Client) => {
    setClientsOrder((prev) => {
      if (prev.find((c) => c.client_id === item.id)) {
        return prev.filter((c) => c.client_id !== item.id).map((c, index) => ({ ...c, order: index + 1 }));
      }

      return [...prev, { client_id: item.id, order: prev.length + 1 }];
    });
  };

  useEffect(() => {
    if (active_shift?.id) {
      setState(active_shift.status as ShiftStatus);
      setShiftId(active_shift.id);
    }
  }, [active_shift, shiftId]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('vuelve a la app', location);
      }
      setAppState(nextAppState);
    });

    return () => subscription.remove();
  }, [appState, location]);

  const finish_shift = async () => {
    try {
      const res = await fetch(`https://machin-web-supabase.vercel.app/api/shift/${shiftId}`, { method: 'POST' });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const contentLength = res.headers.get('content-length');

      if (res.status === 204 || contentLength === '0') {
        console.warn('La API no devolvió contenido');
        return;
      }

      const data = await res.json();

      setFinalizeShift(data.data);
      setState(ShiftStatus.FINISHED);
      create_clients_shift(shift?.id!, clientsOrder);
      setShowSheet(false);
      setClientsOrder([]);
      AsyncStorage.removeItem('shift_id');
    } catch (err) {
      console.error('Error al finalizar shift:', err);
    } finally {
      mutate();
    }
  };

  if (!shift && !user) {
    return (
      <Center className="flex-1 bg-white">
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </Center>
    );
  }

  return (
    <Container>
      <VStack className="gap-1">
        <Text size={24} weight="600">
          Hola {`${user?.name ?? ''} ${user?.lastname ?? ''}`}!
        </Text>
        <Text size={14} weight={300}>
          Que gusto tenerte aqui de nuevo!
        </Text>
      </VStack>

      <View className="flex flex-1 my-12">
        {state === ShiftStatus.IDLE && (
          <>
            <VStack className="flex-1 items-center gap-8">
              <Begin />
              <Text size={20} weight={600} color={Colors.PRIMARY} align="center">
                Tu turno está por comenzar
              </Text>
              <Text size={14} weight={300} align="center">
                Selecciona tu zona de trabajo y presiona iniciar cuando estés listo.
              </Text>
              <Select
                placeholder="Seleccionar zona"
                data={zones}
                onChange={(val) => setZone(val)}
                loading={isLoading}
                loadMore={loadMore}
                pageSize={10}
                search={search}
                setSearch={setSearch}
              />
            </VStack>
            <Button onPress={handleStart} icon={<Play width={16} color={Colors.WHITE} />} left_icon disabled={!Boolean(zone) || shiftLoader} loading={shiftLoader}>
              Iniciar
            </Button>
          </>
        )}

        {state === ShiftStatus.STARTED && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone_id={shift?.zone_id as string} shift={shift} />
            <TurnContent
              Icon={<Shift />}
              badgeLabel="Turno Iniciado"
              badgeColor="success"
              badgeDotColor={Colors.GREEN}
              description="Tu turno ha comenzado, puedes pausar o finalizar cuando lo necesites."
            />
            <TurnActions
              primaryAction={{
                label: 'Pausar',
                onPress: () => {
                  setState(ShiftStatus.PAUSED);
                  update(shiftId as string, { status: ShiftStatus.PAUSED });
                },
                outlined: true,
                icon: <PauseIcon />,
              }}
              secondaryAction={{
                label: 'Finalizar',
                onPress: () => {
                  setIsOpen(true);
                },
                icon: <Square />,
              }}
            />
          </View>
        )}

        {state === ShiftStatus.PAUSED && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone_id={shift?.zone_id as string} shift={shift} />
            <TurnContent
              Icon={<Pause />}
              badgeLabel="Turno Pausado"
              badgeColor="warning"
              badgeDotColor={Colors.YELLOW}
              description="Tu turno está en pausa, puedes reanudar en cualquier momento o finalizar si has terminado."
            />
            <TurnActions
              primaryAction={{
                label: 'Reanudar',
                onPress: () => {
                  setState(ShiftStatus.RESUMED);
                  update(shiftId as string, { status: ShiftStatus.RESUMED });
                },
                outlined: true,
                icon: <Play color={Colors.BLACK} />,
              }}
              secondaryAction={{
                label: 'Finalizar',
                onPress: () => {
                  setIsOpen(true);
                },
                icon: <Square />,
              }}
            />
          </View>
        )}

        {state === ShiftStatus.RESUMED && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone_id={shift?.zone_id as string} shift={shift} />
            <TurnContent
              Icon={<Resumed />}
              badgeLabel="Turno Reanudado"
              badgeColor="info"
              badgeDotColor={Colors.BLUE}
              description="Tu turno se ha reanudado, puedes pausar o finalizar cuando quieras."
            />
            <TurnActions
              primaryAction={{
                label: 'Pausar',
                onPress: () => {
                  setState(ShiftStatus.PAUSED);
                  update(shiftId as string, { status: ShiftStatus.PAUSED });
                },
                outlined: true,
                icon: <PauseIcon />,
              }}
              secondaryAction={{
                label: 'Finalizar',
                onPress: () => {
                  setIsOpen(true);
                },
                icon: <Square />,
              }}
            />
          </View>
        )}

        {state === ShiftStatus.FINISHED && finalizeShift && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone_id={shift?.zone_id as string} title="Resumen del dia" state={state} shift={shift} />
            <View className="flex-1">
              <View className="flex items-center justify-center mb-12">
                <Begin />
              </View>

              <HStack className="w-full justify-around">
                <SummaryBlock value={finalizeShift?.active_hours?.toString()} label="Horas activas" />
                <SummaryBlock value={`${finalizeShift?.total_distance || 0}km`} label="Recorrido total" />
              </HStack>

              <HStack className="w-full justify-around mt-8">
                <View className="flex-col gap-6">
                  <InfoBlock icon={Calendar} label="Fecha de inicio" value={formatDate(finalizeShift.start_time, finalizeShift?.start_date)} />
                  <InfoBlock icon={Calendar} label="Fecha de finalización" value={formatDate(finalizeShift.end_time, finalizeShift?.end_date)} />
                </View>
                <View className="flex-col gap-6">
                  <InfoBlock icon={Clock} label="Hora de inicio" value={formatTime(finalizeShift?.start_time, finalizeShift.start_date)} />
                  <InfoBlock icon={Clock} label="Hora de finalización" value={formatTime(finalizeShift?.end_time, finalizeShift.end_date)} />
                </View>
              </HStack>
            </View>

            <Button
              onPress={() => {
                setState(ShiftStatus.IDLE);
                setZone(null);
              }}
            >
              Ir al inicio
            </Button>
          </View>
        )}
      </View>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="¿Estás seguro de finalizar su turno?"
        description="Una vez finalizado el turno se registrará en el sistema."
        showFooter
        onConfirm={() => {
          setIsOpen(false);
          setShowSheet(true);
        }}
        cancelText="No"
        confirmText="Si"
      />
      <Modal
        isOpen={modalShown}
        onClose={() => {}}
        onConfirm={openSettings}
        confirmText="Ir a configuraciones"
        showFooter
        title="Acceso denegado"
        description="Debes de aceptar la geolocalizcion para usar la app"
      />
      <ActionSheet isOpen={showSheet} onClose={() => setShowSheet(false)}>
        <Input placeholder="Buscar..." value={searchClient} onChangeText={setSearchClient} style={styles.searchInput} />

        <FlatList
          data={clients}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          renderItem={({ item }) => {
            return (
              <Pressable className="p-2 flex-row items-center justify-between">
                <Checkbox value={item.id.toString()} isChecked={!!clientsOrder.find((c) => c.client_id === item.id)} onChange={() => toggleClient(item)}>
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <Text>{item.name}</Text>
                </Checkbox>
              </Pressable>
            );
          }}
          onEndReached={loadMoreClients}
          onEndReachedThreshold={0.5}
          className="w-full gap-4"
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            isLoadingClients ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text size={14} color={Colors.BLACK} weight={500}>
                No se encontraron resultados
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
        <Button onPress={finish_shift} style={{ marginBottom: insets.bottom + 16 }}>
          Finalizar Turno
        </Button>
      </ActionSheet>
    </Container>
  );
}
