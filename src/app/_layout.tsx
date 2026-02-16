import { restoreSession } from '@/sdk/utils/shared/restore_session';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../../global.css';
import Providers from '../shared/providers/app.provider';
import { AuthRoutes, HomeRoutes } from '../shared/utils/enum/routes';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!loaded) return;

      const session = await restoreSession();
      if (!redirected) {
        setRedirected(true);

        if (session) {
          router.replace(HomeRoutes.HOME);
        } else {
          router.replace(AuthRoutes.SIGN_IN);
        }

        SplashScreen.hideAsync();
      }
    };

    init();
  }, [loaded, redirected, router]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <Stack initialRouteName="(auth)">
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </Providers>
  );
}
