import { useInsets } from '@/src/hooks/utils/useInsets';
import React, { ReactNode, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';
import { ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, Actionsheet as GActionSheet } from '../ui/actionsheet';

type CustomActionSheetProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
};

export const ActionSheet = ({ isOpen, onClose, children }: CustomActionSheetProps) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useInsets();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    };

    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const snapPoints = keyboardHeight > 0 ? [65 + keyboardHeight / 10] : [65];

  return (
    <GActionSheet isOpen={isOpen} onClose={onClose} snapPoints={snapPoints} useRNModal>
      <ActionsheetBackdrop />
      <ActionsheetContent
        style={{
          backgroundColor: 'white',
          paddingBottom: keyboardHeight + insets.bottom,
        }}
        className='gap-2'
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {children}
      </ActionsheetContent>
    </GActionSheet>
  );
};
