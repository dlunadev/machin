import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Linking } from "react-native";

export function useRecoverySession() {
  const navigation = useNavigation();

  useEffect(() => {
    const handleUrl = (url: string) => {
      try {
        const urlObj = new URL(url);
        console.log("Deep link URL:", url);

        console.log(url)
        // Supabase normalmente pasa tipo de acción en query param
        // ejemplo: ?type=password_reset&oobCode=abc123
        const type = urlObj.searchParams.get("type");
        const oobCode = urlObj.searchParams.get("oobCode");

        if (type === "password_reset" && oobCode) {
          console.log("Password reset detected:", oobCode);
          // Redirige a tu pantalla de nueva contraseña y pasa el oobCode
          // navigation.navigate(, { oobCode });
        }

        // Si tu deep link viene dentro de un query param "url"
        const innerUrl = urlObj.searchParams.get("url");
        if (innerUrl) {
          handleUrl(decodeURIComponent(innerUrl));
        }

      } catch (e) {
        console.log("Invalid URL", url, e);
      }
    };

    // Captura deep link cuando la app ya está abierta
    const subscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    // Captura deep link inicial cuando la app abre
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleUrl(initialUrl);
    })();

    return () => {
      subscription.remove();
    };
  }, [navigation]);
}
