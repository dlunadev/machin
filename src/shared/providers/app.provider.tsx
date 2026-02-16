import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SWRConfig } from 'swr';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { ToastInitializer } from '../hooks/utils/useToast';

export default function Providers({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        shouldRetryOnError: false,
        dedupingInterval: 5000,
      }}
    >
      <GluestackUIProvider mode="light">
        <SafeAreaProvider>
          <ToastInitializer>{children}</ToastInitializer>
        </SafeAreaProvider>
      </GluestackUIProvider>
    </SWRConfig>
  );
}
