import { Machin } from '@/assets/svg';
import { Button, Container, Input, KeyboardContainer } from '@/src/shared/components';
import { Text } from '@/src/shared/components/text/text.component';
import { Center } from '@/src/shared/components/ui/center';
import { Colors } from '@/src/shared/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import { useNewPasswordViewModel } from '../view-model/use-new-password-vm';

function NewPassword() {
  const { isLoading, form } = useNewPasswordViewModel();

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <View className="gap-7 items-center mb-14">
            <Machin />
            <Text size={20} color={Colors.TEXT} weight={600}>
              Nueva{' '}
              <Text size={20} color={Colors.PRIMARY} weight={600}>
                Contraseña
              </Text>
            </Text>
          </View>
          <View className="w-full gap-7">
            <View className="gap-4">
              <Input
                label="Nueva contraseña"
                placeholder="********"
                secureTextEntry
                onChangeText={form.handleChange('password')}
                onBlur={form.handleBlur('password')}
                value={form.values.password}
                touched={form.touched.password}
                error={form.touched.password && form.errors.password ? form.errors.password : undefined}
                rightIcon
              />

              <Input
                label="Confirmar contraseña"
                placeholder="********"
                secureTextEntry
                onChangeText={form.handleChange('confirmPassword')}
                onBlur={form.handleBlur('confirmPassword')}
                value={form.values.confirmPassword}
                touched={form.touched.confirmPassword}
                error={form.touched.confirmPassword && form.errors.confirmPassword ? form.errors.confirmPassword : undefined}
                rightIcon
              />
            </View>

            <Button onPress={() => form.handleSubmit()} loading={isLoading}>
              Actualizar contraseña
            </Button>
          </View>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default NewPassword;
