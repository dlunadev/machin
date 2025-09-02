import { Check } from "@/assets/svg";
import { Button, Container, KeyboardContainer, VStack } from "@/src/components";
import { Text } from "@/src/components/text/text.component";
import { Center } from "@/src/components/ui/center";
import { Colors } from "@/src/constants/Colors";
import { AuthRoutes } from "@/src/utils/enum/routes";
import { useRouter } from "expo-router";
import React from "react";

function Confirmation() {
  const router = useRouter();

  const handle_sign_in = () => {
    router.dismissAll();
    router.replace(AuthRoutes.SIGN_IN)
  }

  return (
    <Container>
      <KeyboardContainer>
        <Center className="flex flex-1">
          <VStack className="items-center gap-4 mb-7">
            <Check />
            <Text color={Colors.BLACK} size={20} weight={600} align="center">
              Contraseña reestablecida con éxito
            </Text>
            <Text color={Colors.TERTIARY} align="center" size={14}>
              ¡Listo! Tu contraseña ha sido restablecida. Ya puedes iniciar
              sesión con tu nueva contraseña.
            </Text>
          </VStack>

          <Button onPress={handle_sign_in}>
            Iniciar Sesión
          </Button>
        </Center>
      </KeyboardContainer>
    </Container>
  );
}

export default Confirmation;
