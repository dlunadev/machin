import { Machin } from '@/assets/svg';
import { Button, Container, Input, KeyboardContainer } from '@/src/shared/components';
import { Text } from '@/src/shared/components/text/text.component';
import { Center } from '@/src/shared/components/ui/center';
import { Colors } from '@/src/shared/constants/Colors';
import { AuthRoutes } from '@/src/shared/utils/enum/routes';
import { RelativePathString, router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useSignInViewModel } from '../view-model/use-sign-in-vm';

function SignIn() {
  const { isLoading, form } = useSignInViewModel();

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <View className="gap-7 items-center mb-14">
            <Machin />
            <Text size={20} color={Colors.TEXT} weight={600}>
              Iniciar{' '}
              <Text size={20} color={Colors.PRIMARY} weight={600}>
                Sesión
              </Text>
            </Text>
          </View>
          <View className="w-full gap-7">
            <View className="gap-4">
              <Input
                label="Correo electrónico"
                placeholder="Escribe tu correo electrónico"
                onChangeText={form.handleChange('email')}
                onBlur={form.handleBlur('email')}
                value={form.values.email}
                touched={form.touched.email}
                error={form.touched.email && form.errors.email ? form.errors.email : undefined}
                autoCapitalize="none"
              />

              <Input
                label="Contraseña"
                placeholder="********"
                secureTextEntry
                onChangeText={form.handleChange('password')}
                onBlur={form.handleBlur('password')}
                value={form.values.password}
                touched={form.touched.password}
                error={form.touched.password && form.errors.password ? form.errors.password : undefined}
                rightIcon
              />
            </View>

            <Button onPress={() => form.handleSubmit()} loading={isLoading}>
              Ingresar
            </Button>
          </View>
          <View className="gap-2 items-center justify-center mt-4">
            <Text size={14}>¿Olvidaste tu contraseña?</Text>
            <Text size={14} color={Colors.PRIMARY} underline onPress={() => router.push(AuthRoutes.RECOVERY_PASSWORD as unknown as RelativePathString)}>
              Haz click aqui
            </Text>
          </View>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default SignIn;
