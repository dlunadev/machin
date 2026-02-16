import { Modal } from '@/src/shared/components';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onOpenSettings: () => void;
}

export const LocationPermissionModal = ({
  isOpen,
  onOpenSettings,
}: LocationPermissionModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      onConfirm={onOpenSettings}
      confirmText="Ir a configuraciones"
      showFooter
      title="Acceso denegado"
      description="Debes de aceptar la geolocalización para usar la app"
    />
  );
};
