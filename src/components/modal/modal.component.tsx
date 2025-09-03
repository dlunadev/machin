// Modal.tsx
// Componente aislado y reutilizable usando Gluestack UI

import { Colors } from '@/src/constants/Colors';
import React from 'react';
import { Button } from '../button/button.component';
import { Text } from '../text/text.component';
import { HStack } from '../ui/hstack';
import { Modal as GSModal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from '../ui/modal';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  showFooter = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ModalProps) => {
  return (
    <GSModal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent style={{ backgroundColor: Colors.WHITE, marginHorizontal: 12 }} className="w-[90%]">
        <ModalCloseButton />
        {title && (
          <ModalHeader className="flex justify-center items-center mb-4">
            <Text size={20} weight={600} color={Colors.PRIMARY} align='center'>
              {title}
            </Text>
          </ModalHeader>
        )}
        <ModalBody>
          {description && (
            <Text size={14} color={Colors.TEXT} align="center">
              {description}
            </Text>
          )}
        </ModalBody>
        {showFooter && (
          <HStack className="gap-2 mt-4">
            <Button onPress={onCancel ?? onClose} stretch outlined>
              {cancelText}
            </Button>
            <Button onPress={onConfirm ?? onClose} stretch>
              {confirmText}
            </Button>
          </HStack>
        )}
      </ModalContent>
    </GSModal>
  );
};

// Ejemplo de uso:
// const [open, setOpen] = React.useState(false)
// <>
//   <Button onPress={() => setOpen(true)}><ButtonText>Abrir</ButtonText></Button>
//   <Modal
//     isOpen={open}
//     onClose={() => setOpen(false)}
//     title="Título del modal"
//     description="Descripción corta"
//     showFooter
//     onConfirm={() => console.log('Confirmado')}
//   >
//     <Text>Contenido dentro del modal</Text>
//   </Modal>
// </>
