import { LocationAdapter } from "@/sdk/infraestructure/location/location.supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Linking, Permission, PermissionsAndroid, Platform } from "react-native";
import BackgroundService from "react-native-background-actions";
import Geolocation from "react-native-geolocation-service";

const { create: create_location } = new LocationAdapter();
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendLocation(latitude: number, longitude: number, accuracy: number) {
  const shift_id = (await AsyncStorage.getItem("shift_id")) || "";
  if (!shift_id) return;
  try {
    await create_location({ shift_id, latitude, longitude, accuracy });
  } catch (err) {
    console.error("[BG_LOCATION] Error enviando ubicación:", err);
  }
}

const androidTrackingTask = async (taskData: any) => {
  while (BackgroundService.isRunning()) {
    Geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
          .catch(err => console.error("[BG_LOCATION] Error sendLocation:", err));
      },
      (err) => console.error("[BG_LOCATION] Error Android Geolocation:", err),
      { enableHighAccuracy: true, distanceFilter: 0 }
    );
    await sleep(30000);
  }
};

const FOREGROUND_SERVICE_LOCATION =
  "android.permission.FOREGROUND_SERVICE_LOCATION" as unknown as Permission;

async function checkAndroidPermissions(): Promise<boolean> {
  const fine = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  const bg = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
  );
  const fgs = await PermissionsAndroid.check(FOREGROUND_SERVICE_LOCATION);

  if (fine && bg && fgs) return true;

  const fineReq = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  const bgReq = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
  );

  let fgsReq: string | undefined;
  const androidVersion = Number(Platform.Version);
  if (androidVersion >= 34) {
    fgsReq = await PermissionsAndroid.request(FOREGROUND_SERVICE_LOCATION);
  }

  return (
    fineReq === PermissionsAndroid.RESULTS.GRANTED &&
    bgReq === PermissionsAndroid.RESULTS.GRANTED &&
    (androidVersion < 34 || fgsReq === PermissionsAndroid.RESULTS.GRANTED)
  );
}


export const useLocation = (onLocationUpdate?: (coords: { latitude: number; longitude: number; accuracy: number }) => void) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalShown, setModalShown] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const watchId = useRef<number | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const openSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  const startTracking = useCallback(async () => {
    const granted = Platform.OS === 'android' ? await checkAndroidPermissions() : (await Geolocation.requestAuthorization('always')) === 'granted';

    if (!granted) {
      setError("Permiso de geolocalización denegado");
      setModalShown(true);
      return;
    }

    setError(null);
    setModalShown(false);
    setPermissionGranted(granted);
    if (Platform.OS === "android") {
      const options = {
        taskName: "LocationTracking",
        taskTitle: "Tracking activo",
        taskDesc: "Enviando ubicación cada 30s",
        taskIcon: { name: "ic_launcher", type: "mipmap" },
        color: "#ff0000",
        parameters: {},
        linkingURI: "com.novexisconsulting.machin",
        foregroundServiceType: "location",
      };
      if (!BackgroundService.isRunning()) {
        await BackgroundService.start(androidTrackingTask, options);
      }
    }

    if (Platform.OS === "ios") {
      if (watchId.current !== null) Geolocation.clearWatch(watchId.current);

      watchId.current = Geolocation.watchPosition(
        async (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy };
          setLocation({ latitude: coords.latitude, longitude: coords.longitude });
          onLocationUpdate?.(coords);
          sendLocation(coords.latitude, coords.longitude, coords.accuracy).catch(console.error);
        },
        (err) => console.error("[BG_LOCATION] Error iOS Geolocation:", err),
        { enableHighAccuracy: true, distanceFilter: 0, interval: 30000, fastestInterval: 15000 }
      );
    }
  }, [onLocationUpdate]);

  useEffect(() => {
    startTracking();
    return () => {
      if (Platform.OS === "android") {
        BackgroundService.stop().catch(() => console.log("[BG_LOCATION] BackgroundService detenido"));
      }
      if (Platform.OS === "ios" && watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [startTracking]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        if (!permissionGranted) await startTracking();
      }
      appState.current = next;
    });
    return () => subscription.remove();
  }, [permissionGranted, startTracking]);

  console.log(location, error, modalShown)

  return { location, error, modalShown, openSettings };
};
