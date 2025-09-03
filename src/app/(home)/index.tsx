import { Begin, Calendar, Clock, Pause, PauseIcon, Play, Resumed, Shift, Square } from '@/assets/svg';
import { Button, Center, Container, HStack, InfoBlock, Modal, Select, SummaryBlock, Text, TurnActions, TurnContent, TurnHeader, VStack } from '@/src/components';
import { Colors } from '@/src/constants/Colors';
import { ShiftState } from '@/src/utils/enum/shift';
import { useState } from 'react';
import { View } from 'react-native';

function Home() {
  const [state, setState] = useState<ShiftState>('idle');
  const [zone, setZone] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const bigData = Array.from({ length: 100 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: `item_${i + 1}`,
  }));

  const handleStart = () => {
    if (!zone) return;
    setState('started');
  };

  return (
    <Container>
      <VStack className="gap-1">
        <Text size={24} weight="600">
          Hola Usuario!
        </Text>
        <Text size={14} weight={300}>
          Que gusto tenerte aqui de nuevo!
        </Text>
      </VStack>

      <Center className="flex flex-1 my-12">
        {state === 'idle' && (
          <>
            <VStack className="flex-1 items-center gap-8">
              <Begin />
              <Text size={20} weight={600} color={Colors.PRIMARY} align="center">
                Tu turno está por comenzar
              </Text>
              <Text size={14} weight={300} align="center">
                Selecciona tu zona de trabajo y presiona iniciar cuando estés listo.
              </Text>
              <Select placeholder="Seleccionar zona" allData={bigData} onChange={(val) => setZone(val)} />
            </VStack>
            <Button onPress={handleStart} icon={<Play width={16} color={Colors.WHITE} />} left_icon disabled={!Boolean(zone)}>
              Iniciar
            </Button>
          </>
        )}

        {state === 'started' && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone={zone} />
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
                onPress: () => setState('paused'),
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

        {state === 'paused' && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone={zone} />
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
                onPress: () => setState('resumed'),
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

        {state === 'resumed' && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone={zone} />
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
                onPress: () => setState('paused'),
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

        {state === 'completed' && (
          <View className="flex flex-1 w-full gap-2">
            <TurnHeader zone={zone} title="Resumen del dia" state={state} />
            <View className="flex-1">
              <View className="flex items-center justify-center mb-12">
                <Begin />
              </View>

              <HStack className="w-full justify-around">
                <SummaryBlock value="03h 30m 50s" label="Horas activas" />
                <SummaryBlock value="2km" label="Recorrido total" />
              </HStack>

              <HStack className="w-full justify-around mt-8">
                <View className="flex-col gap-6">
                  <InfoBlock icon={Calendar} label="Fecha de inicio" value="01/08/2025" />
                  <InfoBlock icon={Calendar} label="Fecha de finalización" value="01/08/2025" />
                </View>
                <View className="flex-col gap-6">
                  <InfoBlock icon={Clock} label="Hora de inicio" value="13:59" />
                  <InfoBlock icon={Clock} label="Hora de finalización" value="18:59" />
                </View>
              </HStack>
            </View>

            <Button
              onPress={() => {
                setState('idle');
                setZone(null);
              }}
            >
              Ir al inicio
            </Button>
          </View>
        )}
      </Center>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="¿Estás seguro de finalizar su turno?"
        description="Una vez finalizado el turno se registrará en el sistema."
        showFooter
        onConfirm={() => {
          setIsOpen(false);
          setState('completed');
        }}
        cancelText="No"
        confirmText="Si"
      />
    </Container>
  );
}

export default Home;
