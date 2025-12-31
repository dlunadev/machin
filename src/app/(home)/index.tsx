import { Check } from '@/assets/svg';
import { Client } from '@/sdk/domain/client/client.entity';
import { Zone } from '@/sdk/domain/zone/zone.entity';
import { ShiftStatus } from '@/sdk/utils/enum/shift-status';
import { WebhookShift } from '@/sdk/utils/type/webhook-shift';
import { ActionSheet, Button, Container, Input, Modal, Text, VStack } from '@/src/components';
import { ShiftFinished } from '@/src/components/layouts/shift-finished/shift-finished.component';
import { ShiftIdle } from '@/src/components/layouts/shift-idle/shift-idle.component';
import { ShiftPaused } from '@/src/components/layouts/shift-paused/shift-paused.component';
import { ShiftResumed } from '@/src/components/layouts/shift-resumed/shift-resumed.component';
import { ShiftStarted } from '@/src/components/layouts/shift-started/shift-started.component';
import styles from '@/src/components/select/select.style';
import { Checkbox, CheckboxIcon, CheckboxIndicator } from '@/src/components/ui/checkbox';
import { useClients, useMe, useShift, useShiftActive } from '@/src/hooks/services';
import { useInsets } from '@/src/hooks/utils/useInsets';
import { useLocation } from '@/src/hooks/utils/useLocation';
import { create_location } from '@/src/services/location/location.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, FlatList, Pressable, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const API_URL = Constants?.expoConfig?.extra?.API_URL;

export default function Home() {
  const insets = useInsets();
  const [shiftId, setShiftId] = useState<string | null>('');
  const [state, setState] = useState<ShiftStatus>(ShiftStatus.IDLE);
  const [zone, setZone] = useState<Zone | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [finalizeShift, setFinalizeShift] = useState<WebhookShift | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientsOrder, setClientsOrder] = useState<{ client_id: string; order: number }[]>([]);
  const [searchClient, setSearchClient] = useState('');
  const { location, modalShown, openSettings } = useLocation((coords) => {
    if (shiftId && shift?.status !== ShiftStatus.FINISHED) {
      create_location({
        shift_id: shiftId as string,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
    }
  });

  const { user } = useMe();
  const { shift, mutate } = useShift(shiftId as string);
  const { active_shift } = useShiftActive(user?.id as string);
  const { clients, isLoading: isLoadingClients, loadMore: loadMoreClients } = useClients(10, searchClient, shift?.zone_id);

  const toggleClient = (item: Client) => {
    setClientsOrder((prev) => {
      if (prev.find((c) => c.client_id === item.id)) {
        return prev.filter((c) => c.client_id !== item.id).map((c, index) => ({ ...c, order: index + 1 }));
      }

      return [...prev, { client_id: item.id, order: prev?.length + 1 }];
    });
  };

  const finish_shift = async () => {
    setLoading(true);

    try {
      // ⏱️ Simula tiempo de red / procesamiento
      // 🧪 Respuesta mockeada como si viniera del backend
      setTimeout(() => {
        const mockResponse: { data: WebhookShift } = {
          data: {
            shift_id: 12,
            active_hours: 7.5,
            total_distance: 42.3,
            start_date: '2025-12-30',
            end_date: '2025-12-30',
            start_time: '09:00',
            end_time: '16:30',
          },
        };

        setFinalizeShift(mockResponse.data);
        setClientsOrder([]);
        setShowSheet(false);
        setState(ShiftStatus.FINISHED);
        setSearchClient("");
        mutate();
        AsyncStorage.removeItem('shift_id');
      }, 3000);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (shift?.active_hours) {
      setLoading(false);
      setState(ShiftStatus.FINISHED);
    }
  }, [shift?.active_hours]);

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
        {state === ShiftStatus.IDLE && <ShiftIdle setShiftId={setShiftId} setState={setState} setZone={setZone} zone={zone} />}

        {state === ShiftStatus.STARTED && <ShiftStarted setIsOpen={setIsOpen} setState={setState} user={user} />}

        {state === ShiftStatus.PAUSED && <ShiftPaused setIsOpen={setIsOpen} setState={setState} user={user} />}

        {state === ShiftStatus.RESUMED && <ShiftResumed setIsOpen={setIsOpen} setState={setState} user={user} />}

        {state === ShiftStatus.FINISHED && finalizeShift && (
          <ShiftFinished setIsOpen={setIsOpen} setState={setState} setZone={setZone} finalize_shift={finalizeShift} state={state} user={user} />
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
                    <CheckboxIcon as={Check} />
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
        <Button onPress={finish_shift} style={{ marginBottom: insets.bottom + 16 }} disabled={loading} loading={loading}>
          Finalizar Turno
        </Button>
      </ActionSheet>
    </Container>
  );
}
