import { Check } from '@/assets/svg';
import { AuthSupabaseAdapter } from '@/sdk/infraestructure';
import { Button, Container, KeyboardContainer, VStack } from '@/src/components';
import { Text } from '@/src/components/text/text.component';
import { Center } from '@/src/components/ui/center';
import { Colors } from '@/src/constants/Colors';
import { useTimer } from '@/src/hooks/utils/useTimer'; // <-- tu hook
import { useCustomToast } from '@/src/hooks/utils/useToast';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';

const { recovery_password } = new AuthSupabaseAdapter();

function SendEmail() {
  const params = useRoute().params as { email?: string };
  const { showToast } = useCustomToast();

  const { formattedTime, start, reset } = useTimer(120);
  const [timerActive, setTimerActive] = useState(false);

  const fakeRequest = () => {
    setTimeout(() => {
      showToast({
        title: 'Correo enviado',
        children: `Revisa tu bandeja de entrada.`,
      });
      
      reset();
      setTimerActive(true);
    }, 500);
    recovery_password(params.email || '');
  };

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <VStack className="items-center gap-4 mb-7">
            <Check />
            <Text color={Colors.BLACK} size={20} weight={600}>
              Revisa tu correo electrónico!
            </Text>
            <Text color={Colors.TERTIARY} align="center" size={14}>
              Hemos enviado un correo electrónico con instrucciones para reestablecer su contraseña
            </Text>
          </VStack>

          <Button
            onPress={() => {
              fakeRequest();
              start();
            }}
            outlined
            disabled={timerActive}
          >
            {timerActive ? `Reenviar código (${formattedTime})` : 'Reenviar código electrónico'}
          </Button>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default SendEmail;
