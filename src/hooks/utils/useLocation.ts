import { LocationAdapter } from "@/sdk/infraestructure/location/location.supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, Linking, Platform } from "react-native";

async function ensureBatteryOptimizationHandled() {
  if (Platform.OS !== "android") return;

  const alreadyConfirmed = await AsyncStorage.getItem("batteryWhitelistConfirmed");
  if (alreadyConfirmed === "true") {
    console.log("🔋 Batería ya confirmada por el usuario");
    return;
  }

  console.log("⚠️ Redirigiendo a ajustes de batería");
  await IntentLauncher.startActivityAsync(
    "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"
  );

  await AsyncStorage.setItem("batteryWhitelistConfirmed", "true");
}


const TASK_NAME = "BACKGROUND_LOCATION";
const { create: create_location } = new LocationAdapter();

TaskManager.defineTask(
  TASK_NAME,
  async ({ data, error }: TaskManager.TaskManagerTaskBody<any>) => {
    if (error) {
      return;
    }

    if (data) {
      const shift_id = await AsyncStorage.getItem("shift_id");
      console.log("background", shift_id);

      const { locations } = data as { locations: Location.LocationObject[] };
      const latest = locations[locations.length - 1];

      if (latest) {
        const coords = {
          latitude: latest.coords.latitude,
          longitude: latest.coords.longitude,
          accuracy: latest.coords.accuracy,
          timestamp: latest.timestamp,
        };

        console.log(">>> BACKGROUND_LOCATION_TASK <<<", coords);
        console.log("Última ubicación en background:", coords);

        try {
          await create_location({
            shift_id: shift_id || "",
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy || 0,
          });

          console.log("Ubicación enviada al servidor");
        } catch (err) {
          console.error("Error enviando ubicación:", err);
        }
      }
    }
  }
);

async function startBackgroundLocationUpdates() {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  if (!hasStarted) {
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 50,
      timeInterval: 60000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Tracking activo",
        notificationBody: "La app está registrando tu ubicación en segundo plano",
        notificationColor: "#FF0000",
      },
    });
    console.log("Background location updates started");
  }
}

export const useLocation = (
  onLocationUpdate?: (coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  }) => void
) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [modalShown, setModalShown] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const subscriberRef = useRef<Location.LocationSubscription | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const openSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  const checkPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      setPermissionGranted(true);
      setError(null);
      return true;
    }
    setPermissionGranted(false);
    return false;
  }, []);

  const requestPermissionAndSubscribe = useCallback(async () => {
    if (permissionGranted) return true;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (status !== "granted" && bgStatus !== "granted") {
        setError("Permiso de geolocalización denegado");
        setPermissionGranted(false);
        return false;
      }

      startBackgroundLocationUpdates()
      setPermissionGranted(true);
      setError(null);
      setModalShown(false);

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy as number,
      };

      setLocation(coords);
      onLocationUpdate?.(coords);

      subscriberRef.current?.remove();

      subscriberRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 30000, distanceInterval: 0 },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy as number,
          };
          setLocation(coords);
          onLocationUpdate?.(coords);
        }
      );

      return true;
    } catch (e) {
      setError("Error obteniendo ubicación");
      return false;
    }
  }, [permissionGranted, onLocationUpdate]);

  useEffect(() => {
    const init = async () => {
      const granted = await checkPermission();
      if (!granted) {
        await requestPermissionAndSubscribe();
      }

      await ensureBatteryOptimizationHandled();
    };
    init();
  }, [checkPermission, requestPermissionAndSubscribe]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        const granted = await checkPermission();
        if (granted) await requestPermissionAndSubscribe();
      }
      appState.current = next;
    });

    return () => subscription.remove();
  }, [checkPermission, requestPermissionAndSubscribe]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy as number,
      };

      setLocation(coords);
      onLocationUpdate?.(coords);
    }, 30000);

    return () => clearInterval(interval);
  }, [onLocationUpdate]);

  useEffect(() => {
    if (error && !location) {
      setModalShown(true);
    } else if (!error || location) {
      setModalShown(false);
    }
  }, [error, location]);

  useEffect(() => {
    (async () => {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      console.log("Registered tasks:", tasks);
    })();
  }, []);

  return { location, error, modalShown, openSettings };
};
