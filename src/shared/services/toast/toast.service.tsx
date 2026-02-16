import { useToast, Toast, ToastTitle, ToastDescription } from '@/src/shared/components/ui/toast';

let toastInstance: ReturnType<typeof useToast> | null = null;

export const setToastInstance = (instance: ReturnType<typeof useToast>) => {
  toastInstance = instance;
};

export const toastService = {
  success: (description: string, title?: string) => {
    if (!toastInstance) {
      console.warn('Toast instance not initialized');
      return;
    }

    toastInstance.show({
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action="success" variant="solid">
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  },

  error: (description: string, title?: string) => {
    if (!toastInstance) {
      console.warn('Toast instance not initialized');
      return;
    }

    toastInstance.show({
      placement: 'top',
      duration: 4000,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  },

  warning: (description: string, title?: string) => {
    if (!toastInstance) {
      console.warn('Toast instance not initialized');
      return;
    }

    toastInstance.show({
      placement: 'top',
      duration: 3500,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action="warning" variant="solid">
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  },

  info: (description: string, title?: string) => {
    if (!toastInstance) {
      console.warn('Toast instance not initialized');
      return;
    }

    toastInstance.show({
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action="info" variant="solid">
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  },

  close: (id: string) => {
    if (!toastInstance) return;
    toastInstance.close(id);
  },

  closeAll: () => {
    if (!toastInstance) return;
    toastInstance.closeAll();
  },
};
