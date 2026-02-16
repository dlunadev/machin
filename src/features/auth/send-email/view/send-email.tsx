import { Check } from '@/assets/svg';
import { Button, Container, KeyboardContainer, VStack } from '@/src/shared/components';
import { Text } from '@/src/shared/components/text/text.component';
import { Center } from '@/src/shared/components/ui/center';
import { Colors } from '@/src/shared/constants/Colors';
import React from 'react';
import { useSendEmailViewModel } from '../view-model/use-send-email-vm';

function SendEmail() {
  const { timerActive, formattedTime, resendEmail } = useSendEmailViewModel();

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
            onPress={resendEmail}
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
