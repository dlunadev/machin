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

        const type = urlObj.searchParams.get("type");
        const oobCode = urlObj.searchParams.get("oobCode");

        if (type === "password_reset" && oobCode) {
          console.log("Password reset detected:", oobCode);
        }
        const innerUrl = urlObj.searchParams.get("url");
        if (innerUrl) {
          handleUrl(decodeURIComponent(innerUrl));
        }

      } catch (e) {
        console.log("Invalid URL", url, e);
      }
    };

    const subscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleUrl(initialUrl);
    })();

    return () => {
      subscription.remove();
    };
  }, [navigation]);
}
