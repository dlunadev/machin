import { Container, Modal, Text, VStack } from '@/src/shared/components';
import { View } from 'react-native';
import { useHomeViewModel } from '../view-model';
import { ClientSelectorSheet, LocationPermissionModal, ShiftLayouts } from './components';

export default function Home() {
  const vm = useHomeViewModel();

  return (
    <Container>
      <VStack className="gap-1">
        <Text size={24} weight="600">
          Hola {vm.user?.name ?? ''} {vm.user?.lastname ?? ''}!
        </Text>
        <Text size={14} weight={300}>
          Que gusto tenerte aqui de nuevo!
        </Text>
      </VStack>

      <View className="flex flex-1 my-12">
        <ShiftLayouts status={vm.state.shiftStatus} user={vm.user} zone={vm.state.zone} finalizeShift={vm.state.finalizeShift} shiftVM={vm.shiftVM} onOpenModal={vm.openModal} />
      </View>

      <Modal
        isOpen={vm.state.isModalOpen}
        onClose={vm.closeModal}
        title="¿Estás seguro de finalizar su turno?"
        description="Una vez finalizado el turno se registrará en el sistema."
        showFooter
        onConfirm={() => {
          vm.closeModal();
          vm.openSheet();
        }}
        cancelText="No"
        confirmText="Si"
      />

      <ClientSelectorSheet isOpen={vm.state.isSheetOpen} onClose={vm.closeSheet} clientVM={vm.clientVM} onFinish={vm.shiftVM.finishShift} loading={vm.shiftVM.loading} />

      <LocationPermissionModal isOpen={vm.locationVM.modalShown} onOpenSettings={vm.locationVM.openSettings} />
    </Container>
  );
}
