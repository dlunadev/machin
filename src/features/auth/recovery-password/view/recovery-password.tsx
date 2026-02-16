import { Machin } from '@/assets/svg';
import { ArrowLeftIcon, Button, Container, HStack, Icon, Input, KeyboardContainer } from '@/src/shared/components';
import { Text } from '@/src/shared/components/text/text.component';
import { Center } from '@/src/shared/components/ui/center';
import { Colors } from '@/src/shared/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useRecoveryPasswordVM } from '../view-model/use-recovery-password.vm';

function RecoveryPassword() {
  const { isLoading, form } = useRecoveryPasswordVM();

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <View className="gap-7 items-center mb-14">
            <Machin />
            <Text size={20} color={Colors.TEXT} weight={600}>
              Restablecer{' '}
              <Text size={20} color={Colors.PRIMARY} weight={600}>
                contraseña
              </Text>
            </Text>
            <Text size={14} color={Colors.TERTIARY} align="center">
              Introduzca su correo electrónico y le enviaremos un enlace para restablecer su contraseña.
            </Text>
          </View>

          <View className="w-full gap-7">
            <Input
              label="Correo electrónico"
              placeholder="juan_topo@gmail.com"
              onChangeText={form.handleChange('email')}
              onBlur={form.handleBlur('email')}
              value={form.values.email}
              touched={form.touched.email}
              error={form.touched.email && form.errors.email ? form.errors.email : undefined}
            />

            <Button onPress={() => form.handleSubmit()} loading={isLoading}>
              Enviar
            </Button>
          </View>
          <Pressable onPress={() => router.back()} className="gap-2 items-center justify-center mt-5">
            <HStack className="gap-2 items-center justify-center">
              <Icon as={ArrowLeftIcon} size="lg" style={{ color: Colors.BLACK }} />
              <Text size={14}>Volver a Iniciar sesión</Text>
            </HStack>
          </Pressable>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default RecoveryPassword;
