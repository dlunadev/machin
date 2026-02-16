import { useToast } from '@/src/shared/components/ui/toast';
import { setToastInstance } from '@/src/shared/services';
import { ReactNode, useEffect } from 'react';

interface ToastInitializerProps {
  children: ReactNode;
}

export const ToastInitializer = ({ children }: ToastInitializerProps) => {
  const toast = useToast();

  useEffect(() => {
    setToastInstance(toast);
  }, [toast]);

  return <>{children}</>;
};
