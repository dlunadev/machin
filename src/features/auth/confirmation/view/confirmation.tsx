import { Machin } from '@/assets/svg';
import { Button, Container } from '@/src/shared/components';
import { Text } from '@/src/shared/components/text/text.component';
import { Center } from '@/src/shared/components/ui/center';
import { Colors } from '@/src/shared/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import { useConfirmationViewModel } from '../view-model/use-confirmation-vm';

function Confirmation() {
  const { submit } = useConfirmationViewModel();

  return (
    <Container>
      <Center className="flex flex-1">
        <View className="gap-7 items-center mb-14">
          <Machin />
          <Text size={24} color={Colors.PRIMARY} weight={600} className="text-center">
            ¡Contraseña actualizada!
          </Text>
          <Text size={16} color={Colors.TEXT} className="text-center px-8">
            Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </Text>
        </View>

        <View className="w-full gap-4 mt-8">
          <Button onPress={submit}>Ir a Iniciar Sesión</Button>
        </View>
      </Center>
    </Container>
  );
}

export default Confirmation;
