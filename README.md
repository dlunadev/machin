# 📱 Proyecto Machin (Expo + React Native + Supabase)

Aplicación móvil construida con **Expo** y **React Native**, organizada con una arquitectura en capas (**SDK/Core, Application, Infra, Domain**) y un `src/` bien estructurado.  
La app gestiona **auth, clientes, turnos, ubicación en tiempo real, vendedores y zonas**; integra **Supabase** como backend y soporta **tareas en segundo plano** para tracking de ubicación.

---

## 🚀 Tecnologías principales

- **[Expo](https://expo.dev/)** → framework base para desarrollo mobile.
- **React Native 0.79 + React 19** → motor de la app.
- **Expo Router** → navegación declarativa.
- **React Navigation** → tabs y stack.
- **Supabase** → autenticación y base de datos en la nube.
- **Gluestack UI + Nativewind + TailwindCSS** → UI y estilos.
- **Lucide React Native** → iconografía.
- **Formik + Yup + Ajv** → formularios y validación.
- **SWR** → data fetching y caching.
- **Day.js** → manejo de fechas.
- **React Aria / Stately** → accesibilidad y estados complejos.
- **Background tasks**:
  - `expo-task-manager`
  - `expo-background-fetch`
  - `react-native-background-actions`

---

## 📂 Estructura del proyecto

```
root/
├── sdk/              # Core de la app (lógica base, aplicación e infraestructura)
│   ├── application/  # Casos de uso / servicios
│   ├── infra/        # Adaptadores, comunicación con APIs externas (ej. Supabase)
│   └── domain/       # Entidades del dominio
│       ├── auth/
│       ├── client/
│       ├── location-live/
│       ├── seller/
│       ├── shift/
│       ├── shift-clients/
│       ├── shift-status/
│       ├── user/
│       └── zone/
│
├── supabase/         # Instancia y configuración de Supabase
├── utils/            # Enums, interfaces compartidas, helpers
├── tests/            # (pendiente) pruebas unitarias con Jest
└── src/
    ├── app/          # Navegación y vistas principales
    │   ├── auth/         # Login
    │   ├── sign-in/        # Pantalla de login
    │   ├── password/     # Recupero de contraseña
    │   │   ├── confirmation/     #Pantalla de confirmacion
    │   │   ├── new-password/     #Pantalla de nueva contraseña
    │   │   └── recovery-password/    # Pantalla de recupero de contraseña
    │   │   └── send-email/    # Pantalla de envio de email
    │   └── home/         # Vista principal
    │       └── index.tsx
    │       # UI dinámica según estado del turno
    │       # export enum ShiftStatus { STARTED, PAUSED, RESUMED, FINISHED, IDLE }
    │
    ├── components/   # Componentes reutilizables
    │   ├── action-sheet/
    │   ├── badge/
    │   ├── button/
    │   ├── container/
    │   ├── header/
    │   ├── input/
    │   ├── keyboard/
    │   ├── modal/
    │   ├── select/
    │   ├── summary/
    │   ├── text/
    │   ├── turn/
    │   └── ui/       # Implementaciones de Gluestack
    │
    ├── constants/    # Colores de la app
    │   └── colors.ts
    │
    ├── helpers/      # Helpers generales
    │   ├── date-formatter.ts
    │   ├── get-dimensions.ts
    │   └── scale-size.ts
    │
    ├── hooks/
    │   ├── services/ # Hooks SWR para data fetching
    │   │   ├── client.ts
    │   │   ├── shift.ts
    │   │   ├── user.ts
    │   │   └── zone.ts
    │   │   └── index.ts # barrel export
    │   │
    │   └── utils/    # Hooks de utilidades
    │       ├── useInsets.ts
    │       ├── useTimer.ts
    │       ├── useToast.ts
    │       ├── useToken.ts
    │       └── useLocation.ts # integración con background tasks
    │
    └── utils/        # Schemas y enums globales
        ├── schemas.ts
        └── routes.enum.ts
```

---

## 🧩 Dominios principales

- **Auth** → autenticación con Supabase.
- **Client** → gestión de clientes.
- **Location-live** → seguimiento en tiempo real de ubicación.
- **Seller** → módulo de vendedores.
- **Shift** → turnos de trabajo.
- **Shift-clients** → relación turnos ↔ clientes.
- **Shift-status** → estado de los turnos.
- **User** → usuarios del sistema.
- **Zone** → zonas asignadas / delimitación.

---

## 🛠️ Scripts

### Desarrollo

```bash
# Instalar dependencias
yarn install

# Levantar en desarrollo
yarn expo start
```

### Testing

```bash
# Ejecutar tests (con Jest)
yarn test
```

---

## 🧪 Testing

El proyecto usará **Jest** para test unitarios y de integración.  
Los tests cubrirán principalmente:

- Validaciones (Yup, Ajv, Zod si aplica).
- Casos de uso en capa **application**.
- Servicios de capa **infra** (mockeando Supabase y otros).
- Lógica de dominio (ej. turnos, clientes, zonas).
- Hooks críticos (`useLocation`, `useTimer`, `useToast`, etc.).

## 📦 Generar APK (assembleRelease)

Para generar el APK de producción ejecuta:

```bash
cd android
./gradlew assembleRelease
```

**IMPORTANTE:** Antes de generar el APK, asegúrate de modificar el `AndroidManifest.xml` agregando los siguientes permisos, de lo contrario la app no podrá utilizar las background tasks de ubicación:

```xml
<!-- Permisos necesarios para background tasks de ubicación -->
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

---

## 📌 Roadmap

- [ ] Implementar suite de tests con Jest.
- [ ] Integración de E2E testing (Detox o Maestro).
- [ ] Mejorar manejo offline (sincronización con Supabase).
- [ ] Optimizar background tasks (fetch y acciones).

---

## 📄 Licencia

Proyecto privado / uso interno.
