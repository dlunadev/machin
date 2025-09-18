import { Machin } from '@/assets/svg';
import { AuthSupabaseAdapter } from '@/sdk/infraestructure';
import { ArrowLeftIcon, Button, Container, HStack, Icon, Input, KeyboardContainer } from '@/src/components';
import { Text } from '@/src/components/text/text.component';
import { Center } from '@/src/components/ui/center';
import { Colors } from '@/src/constants/Colors';
import { useCustomToast } from '@/src/hooks/utils/useToast';
import { useRecoverySession } from '@/src/hooks/utils/useToken';
import { AuthRoutes } from '@/src/utils/enum/routes';
import { new_password_schema } from '@/src/utils/schemas/auth/new-password';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const { update_password } = new AuthSupabaseAdapter();

function NewPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  useRecoverySession();

  const handleResetPassword = async (values: { password: string; new_password: string }) => {
    try {
      setLoading(true);
      const data = await update_password(values.password);

      if (!data.user) {
        return;
      }

      showToast({
        title: 'Contraseña actualizada',
        children: 'Ya puedes iniciar sesión con tu nueva contraseña.',
      });

      router.replace(AuthRoutes.CONFIRMATION);
    } catch (err: any) {
      showToast({
        title: 'Error',
        children: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <View className="gap-7 items-center mb-14">
            <Machin />
            <Text size={20} color={Colors.TEXT} weight={600}>
              Establecer{' '}
              <Text size={20} color={Colors.PRIMARY} weight={600}>
                nueva contraseña
              </Text>
            </Text>
          </View>
          <Formik initialValues={{ password: '', new_password: '' }} validationSchema={new_password_schema} onSubmit={(values) => handleResetPassword(values)}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="w-full gap-7">
                <View className="gap-4">
                  <Input
                    label="Nueva Contraseña"
                    placeholder="Escribe tu contraseña aquí..."
                    secureTextEntry
                    rightIcon
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    touched={touched.password}
                    error={touched.password && errors.password ? errors.password : undefined}
                  />
                  <Input
                    label="Confirmar contraseña"
                    placeholder="Escribe tu contraseña aquí..."
                    secureTextEntry
                    rightIcon
                    onChangeText={handleChange('new_password')}
                    onBlur={handleBlur('new_password')}
                    value={values.new_password}
                    touched={touched.new_password}
                    error={touched.new_password && errors.new_password ? errors.new_password : undefined}
                  />
                </View>

                <Button onPress={() => handleSubmit()} loading={loading}>
                  Ingresar
                </Button>
              </View>
            )}
          </Formik>
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

export default NewPassword;
