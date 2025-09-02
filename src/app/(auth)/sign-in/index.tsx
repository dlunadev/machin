import { Machin } from "@/assets/svg";
import { sign_in } from "@/sdk/auth/auth";
import { Button, Container, Input, KeyboardContainer } from "@/src/components";
import { Text } from "@/src/components/text/text.component";
import { Center } from "@/src/components/ui/center";
import { Colors } from "@/src/constants/Colors";
import { useCustomToast } from "@/src/hooks/utils/useToast";
import { AuthRoutes } from "@/src/utils/enum/routes";
import { sign_in_schema } from "@/src/utils/schemas/auth/login.schema";
import { RelativePathString, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";

function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useCustomToast();

  const fakeRequest = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);

      const resp = await sign_in(values.email, values.password);

      if (resp.error) {
        showToast({
          title: "Error de inicio de sesión",
          children: resp.error.message,
        });
        return;
      }

      showToast({
        title: "Inicio de sesión",
        children: `Correo: ${values.email}\nContraseña: ${values.password}`,
      });
    } catch (err: any) {
      showToast({
        title: "Error inesperado",
        children: err.message || "No se pudo iniciar sesión. Intenta de nuevo.",
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
              Iniciar{" "}
              <Text size={20} color={Colors.PRIMARY} weight={600}>
                Sesión
              </Text>
            </Text>
          </View>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={sign_in_schema}
            onSubmit={(values) => fakeRequest(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="w-full gap-7">
                <View className="gap-4">
                  <Input
                    label="Correo electrónico"
                    placeholder="toto.luna0930@gmail.com"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    touched={touched.email}
                    error={
                      touched.email && errors.email ? errors.email : undefined
                    }
                  />
                  <Input
                    label="Contraseña"
                    placeholder="Escribe tu contraseña aquí..."
                    secureTextEntry
                    rightIcon
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    touched={touched.password}
                    error={
                      touched.password && errors.password
                        ? errors.password
                        : undefined
                    }
                  />
                </View>

                <Button onPress={() => handleSubmit()} loading={loading}>
                  Ingresar
                </Button>
              </View>
            )}
          </Formik>
          <View className="gap-2 items-center justify-center mt-4">
            <Text size={14}>¿Olvidaste tu contraseña?</Text>
            <Text
              size={14}
              color={Colors.PRIMARY}
              underline
              onPress={() =>
                router.push(
                  AuthRoutes.RECOVERY_PASSWORD as unknown as RelativePathString
                )
              }
            >
              Haz click aqui
            </Text>
          </View>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default SignIn;
