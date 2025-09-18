import { Machin } from '@/assets/svg';
import { AuthSupabaseAdapter } from '@/sdk/infraestructure';
import { ArrowLeftIcon, Button, Container, HStack, Icon, Input, KeyboardContainer } from '@/src/components';
import { Text } from '@/src/components/text/text.component';
import { Center } from '@/src/components/ui/center';
import { Colors } from '@/src/constants/Colors';
import { AuthRoutes } from '@/src/utils/enum/routes';
import { recovery_password_schema } from '@/src/utils/schemas/auth/recovery-password.schema';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

const { recovery_password } = new AuthSupabaseAdapter();

function RecoveryPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    await recovery_password(values.email);

    router.push({
      pathname: AuthRoutes.SEND_EMAIL,
      params: { email: values.email },
    });
    setLoading(false);
  };

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
          <Formik initialValues={{ email: '' }} validationSchema={recovery_password_schema} onSubmit={(values) => handleSubmit(values)}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="w-full gap-7">
                <Input
                  label="Correo electrónico"
                  placeholder="juan_topo@gmail.com"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  touched={touched.email}
                  error={touched.email && errors.email ? errors.email : undefined}
                />

                <Button onPress={() => handleSubmit()} loading={loading}>
                  Enviar
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

export default RecoveryPassword;
