import { useToast } from '@/src/shared/components/ui/toast';
import { setToastInstance } from '@/src/shared/services';
import { useEffect } from 'react';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();

  useEffect(() => {
    setToastInstance(toast);
  }, [toast]);

  return <>{children}</>;
};
