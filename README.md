# 📱 Machin - Sistema de Gestión de Turnos de Vendedores

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-52-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Aplicación móvil profesional para gestión de turnos, clientes y tracking en tiempo real con arquitectura Clean + MVVM**

[Características](#-características) •
[Arquitectura](#-arquitectura) •
[Instalación](#-instalación) •
[Uso](#-uso) •
[Documentación](#-documentación)

</div>

---

## 🎯 Descripción

**Machin** es una aplicación móvil empresarial desarrollada con React Native y Expo que permite a vendedores gestionar sus turnos de trabajo, rastrear ubicación en tiempo real, administrar clientes por zonas y generar reportes de actividad diaria.

### Problema que resuelve

- ✅ **Gestión de turnos**: Control completo del ciclo de vida de turnos (inicio, pausa, reanudación, finalización)
- ✅ **Tracking GPS**: Monitoreo en tiempo real de ubicación del vendedor durante el turno
- ✅ **Gestión de clientes**: Organización por zonas geográficas
- ✅ **Reportes**: Resumen automático de horas activas, distancia recorrida y rendimiento

---

## ✨ Características

### 🔐 Autenticación
- Login con Supabase Auth
- Recuperación de contraseña vía email
- Sesiones persistentes

### 📍 Gestión de Turnos
- Inicio/pausa/reanudación/finalización de turnos
- Selección de zona de trabajo
- Tracking de tiempo activo
- Registro de distancia recorrida
- Estados: `IDLE`, `STARTED`, `PAUSED`, `RESUMED`, `FINISHED`

### 🗺️ Ubicación en Tiempo Real
- Background location tracking durante turnos activos
- Servicio foreground persistente
- Almacenamiento de puntos GPS en base de datos
- Cálculo automático de distancia recorrida

### 👥 Gestión de Clientes
- Búsqueda y filtrado por zona
- Selección múltiple para asociar a turnos
- Paginación infinita

### 📊 Reportes
- Resumen diario: horas activas, distancia, fechas
- Visualización de métricas de rendimiento

---

## 🏗️ Arquitectura

El proyecto implementa una **arquitectura híbrida** que combina **Clean Architecture** en el SDK con **MVVM** en las features del frontend.

### Diagrama de Capas

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer (MVVM)                  │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
│  │   View   │←─│ViewModel │←─│ View-Model/    │   │
│  │  (TSX)   │  │  (Hooks) │  │ Sub-ViewModels │   │
│  └──────────┘  └──────────┘  └────────────────┘   │
│       ↓              ↓                ↓             │
│  ┌──────────────────────────────────────────────┐  │
│  │         Model (State + Entities)             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              SDK Layer (Clean Architecture)         │
│  ┌──────────────────────────────────────────────┐  │
│  │  Application Layer (Use Cases)               │  │
│  │  - ZoneUseCase, ShiftUseCase, etc.           │  │
│  └──────────────────────────────────────────────┘  │
│       ↓                                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Domain Layer (Entities + Repositories)      │  │
│  │  - Zone, Shift, Client, User entities        │  │
│  │  - Repository interfaces                      │  │
│  └──────────────────────────────────────────────┘  │
│       ↓                                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Infrastructure Layer (Adapters)             │  │
│  │  - SupabaseAdapter, MockAdapter              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│                External Services                    │
│        Supabase • Background Tasks • GPS           │
└─────────────────────────────────────────────────────┘
```

### Estructura de Directorios

```
machin/
├── sdk/                          # Clean Architecture - Core de negocio
│   ├── domain/                   # Entidades y contratos
│   │   ├── auth/
│   │   ├── client/
│   │   ├── shift/
│   │   ├── zone/
│   │   └── ...
│   ├── application/              # Casos de uso
│   │   ├── auth/
│   │   ├── client/
│   │   └── ...
│   └── infrastructure/           # Implementaciones (Supabase, Mock)
│       ├── auth/
│       ├── client/
│       └── ...
│
├── src/
│   ├── app/                      # Expo Router - Navegación
│   │   ├── (auth)/               # Stack de autenticación
│   │   └── (home)/               # Stack principal
│   │
│   ├── features/                 # Features con MVVM
│   │   ├── auth/                 # Feature de autenticación
│   │   │   ├── sign-in/
│   │   │   │   ├── model/        # Estado del sign-in
│   │   │   │   ├── view/         # UI componente
│   │   │   │   ├── view-model/   # Lógica de negocio
│   │   │   │   └── form/         # Validación (Yup + Formik)
│   │   │   ├── recovery-password/
│   │   │   ├── new-password/
│   │   │   └── domain/           # Mappers y servicios compartidos
│   │   │
│   │   └── home/                 # Feature principal
│   │       ├── model/            # Estado global de home
│   │       ├── view/             # Vista principal + componentes
│   │       │   └── components/
│   │       │       ├── layouts/      # Shift layouts por estado
│   │       │       ├── client-selector/
│   │       │       ├── modals/
│   │       │       └── shift-layouts/
│   │       ├── view-model/       # ViewModel principal
│   │       │   ├── use-home-vm.ts
│   │       │   └── sub-vm/       # Sub-ViewModels especializados
│   │       │       ├── use-shift-vm.ts
│   │       │       ├── use-client-vm.ts
│   │       │       └── use-location-vm.ts
│   │       ├── hooks/            # Custom hooks de data fetching
│   │       └── domain/           # Mappers y servicios
│   │
│   └── shared/                   # Recursos compartidos
│       ├── components/           # UI components
│       │   ├── ui/               # Gluestack UI wrappers
│       │   ├── button/
│       │   ├── input/
│       │   ├── modal/
│       │   └── ...
│       ├── services/             # Servicios de infraestructura
│       │   ├── toast/
│       │   ├── location/
│       │   └── shift/
│       ├── hooks/                # Hooks compartidos
│       │   ├── services/         # SWR data fetching
│       │   └── utils/            # Utilidades
│       ├── providers/            # Context providers
│       ├── constants/            # Constantes (colores, etc.)
│       └── helpers/              # Funciones auxiliares
│
└── assets/                       # Recursos estáticos
```

### Patrones de Diseño Implementados

#### 🎨 MVVM (Model-View-ViewModel)
```typescript
// Model - Estado tipado
interface HomeState {
  shiftId: string | null;
  shiftStatus: ShiftStatus;
  zone: Zone | null;
  // ...
}

// ViewModel - Lógica de negocio
const useHomeViewModel = () => {
  const [state, setState] = useState<HomeState>(initialState);
  
  const startShift = async (zone: Zone) => {
    // Lógica de inicio de turno
  };
  
  return { state, startShift, /* ... */ };
};

// View - UI pura
const HomeView = () => {
  const vm = useHomeViewModel();
  return <Container>{/* UI basada en vm.state */}</Container>;
};
```

#### 🏛️ Repository Pattern
```typescript
// Domain
interface ShiftRepository {
  create(data: Shift): Promise<Shift>;
  findById(id: string): Promise<Shift>;
  update(id: string, data: Partial<Shift>): Promise<Shift>;
}

// Infrastructure
class ShiftSupabaseAdapter implements ShiftRepository {
  async create(data: Shift) {
    return supabase.from('shifts').insert(data);
  }
}
```

#### 🔄 Use Case Pattern
```typescript
class ShiftUseCase {
  constructor(private repo: ShiftRepository) {}
  
  async startShift(userId: string, zoneId: string) {
    // Orquestación de la lógica de negocio
    const shift = await this.repo.create({...});
    await this.statusRepo.create({...});
    return shift;
  }
}
```

---

## 🛠️ Stack Tecnológico

### Core
- **React Native** `0.79` - Framework mobile
- **Expo** `~52.0.27` - Toolchain y SDK
- **TypeScript** `~5.3.3` - Tipado estático
- **React** `19.0.0` - Librería UI

### Navegación
- **Expo Router** `~4.0.22` - Navegación basada en archivos
- **React Navigation** `^7.3.0` - Navegación programática

### Estado y Data Fetching
- **SWR** `^2.3.1` - Cache y sincronización de datos
- **React Hook Form** (via Formik) - Gestión de formularios
- **Zustand** (implícito en ViewModels) - State management local

### UI y Estilos
- **Gluestack UI** `^2.1.12` - Sistema de diseño
- **NativeWind** `^4.1.23` - Tailwind CSS para React Native
- **TailwindCSS** `^3.4.17` - Utilidades de CSS
- **Lucide React Native** `^0.468.0` - Iconografía

### Formularios y Validación
- **Formik** `^2.4.6` - Gestión de formularios
- **Yup** `^1.6.2` - Validación de schemas
- **Ajv** `^8.17.1` - JSON Schema validator

### Backend y Base de Datos
- **Supabase JS** `^2.47.10` - Cliente de Supabase
- **PostgreSQL** (via Supabase) - Base de datos

### Utilidades
- **Day.js** `^1.11.15` - Manejo de fechas
- **React Aria** `^3.40.0` - Accesibilidad
- **Expo Task Manager** `~12.0.0` - Background tasks
- **Expo Location** `~18.0.6` - Servicios de ubicación
- **React Native Background Actions** `^4.0.1` - Tareas en background

### Desarrollo
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Jest** (futuro) - Testing

---

## 🚀 Instalación

### Prerequisitos

```bash
node >= 18.x
npm >= 9.x o yarn >= 1.22.x
expo-cli (instalado globalmente)
```

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd machin
```

2. **Instalar dependencias**
```bash
yarn install
# o
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz
cp .env.example .env

# Editar con tus credenciales de Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. **Ejecutar en desarrollo**
```bash
# Iniciar Expo
yarn start

# Escanear QR con Expo Go o
# Presionar 'a' para Android
# Presionar 'i' para iOS
```

---

## 📱 Uso

### Flujo de Trabajo del Vendedor

1. **Login** → El vendedor inicia sesión con sus credenciales
2. **Selección de Zona** → Elige la zona geográfica donde trabajará
3. **Inicio de Turno** → Presiona "Iniciar" para comenzar el turno
   - Se activa el tracking GPS en background
   - Se registra la hora de inicio
4. **Durante el Turno** → Puede:
   - ⏸️ **Pausar** el turno (detiene tracking)
   - ▶️ **Reanudar** el turno (reactiva tracking)
   - 🏁 **Finalizar** el turno
5. **Finalización** → Al finalizar:
   - Selecciona clientes visitados
   - Sistema genera resumen: horas activas, distancia, fechas
6. **Resumen** → Visualiza métricas del día

### Estados del Turno

```typescript
enum ShiftStatus {
  IDLE = 'IDLE',           // Sin turno activo
  STARTED = 'STARTED',     // Turno iniciado
  PAUSED = 'PAUSED',       // Turno pausado
  RESUMED = 'RESUMED',     // Turno reanudado
  FINISHED = 'FINISHED'    // Turno finalizado
}
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
yarn test

# Tests con coverage
yarn test:coverage

# Tests en modo watch
yarn test:watch
```

### Estructura de Tests

```
features/home/
├── view-model/
│   └── __tests__/
│       ├── use-home-vm.test.ts
│       └── sub-vm/
│           ├── use-shift-vm.test.ts
│           ├── use-client-vm.test.ts
│           └── use-location-vm.test.ts
```

---

## 📦 Build y Deploy

### Android APK

1. **Configurar permisos en AndroidManifest.xml**

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest>
  <!-- Permisos de ubicación -->
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
  
  <application>
    <!-- Servicio de background -->
    <service
      android:name="com.asterinet.react.bgactions.RNBackgroundActionsTask"
      android:exported="false"
      android:foregroundServiceType="location" />
  </application>
</manifest>
```

2. **Generar APK**

```bash
cd android
./gradlew assembleRelease

# El APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS (Desarrollo)

```bash
yarn ios
```

---

## 🤝 Contribución

### Workflow

1. Crear rama desde `develop`
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Seguir convenciones:
   - **Features**: `feature/nombre-feature`
   - **Fixes**: `fix/descripcion-fix`
   - **Hotfixes**: `hotfix/descripcion`

3. Commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/)
```bash
feat(shift): add pause functionality
fix(auth): resolve token expiration bug
docs(readme): update installation steps
```

4. Pull Request a `develop`

### Estándares de Código

- ✅ TypeScript estricto
- ✅ ESLint sin warnings
- ✅ Prettier formateado
- ✅ Tests para nueva lógica de negocio
- ✅ Documentación de funciones complejas

---

## 📚 Documentación Adicional

- [Arquitectura Detallada](./docs/ARCHITECTURE.md) *(pendiente)*
- [Guía de Estilos](./docs/STYLE_GUIDE.md) *(pendiente)*
- [API Reference](./docs/API.md) *(pendiente)*

---

## 🐛 Troubleshooting

### Problema: Background location no funciona

**Solución:** Verificar que los permisos estén en `AndroidManifest.xml` y que el servicio esté declarado.

### Problema: App crashea al iniciar

**Solución:** Limpiar cache
```bash
yarn start --clear
```

### Problema: Supabase connection error

**Solución:** Verificar `.env` y que las credenciales sean correctas.

---

## 📄 Licencia

Este proyecto es de uso interno. Todos los derechos reservados © 2026 Novexis.

---

## 👥 Equipo

- **Desarrollador Principal**: [Tu Nombre]
- **Arquitectura**: [Tu Nombre]
- **QA**: [Nombre]

---

## 🔮 Roadmap

### Q1 2026
- [x] Implementación de MVVM completo
- [x] Background location tracking
- [x] Sistema de turnos completo
- [ ] Suite de tests unitarios
- [ ] Documentación completa

### Q2 2026
- [ ] Modo offline con sincronización
- [ ] Notificaciones push
- [ ] Reportes avanzados con gráficos
- [ ] Optimización de performance

### Q3 2026
- [ ] Multi-idioma (i18n)
- [ ] Tema oscuro
- [ ] Exportación de reportes PDF

---

<div align="center">

**Construido con ❤️ usando React Native + Expo + Supabase**

⭐ Si este proyecto te ayuda, considera darle una estrella

</div>
