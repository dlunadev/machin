import { Colors } from '@/src/shared/constants/Colors';
import React, { ReactNode } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { Text } from '../text/text.component';
import { HStack } from '../ui/hstack';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  loading?: boolean;
  outlined?: boolean;
  icon?: ReactNode;
  left_icon?: boolean;
  right_icon?: boolean;
  stretch?: boolean;
  children: ReactNode;
}

export const Button = (props: ButtonProps) => {
  const { onPress, disabled = false, style = {}, children, loading, outlined = false, icon, left_icon, right_icon, stretch = false } = props;

  const buttonStyles = [
    styles.button,
    outlined ? styles.outlined : {},
    style,
    disabled && (outlined ? styles.outlinedDisabled : styles.disabled),
    stretch
      ? { flex: 1 }
      : {
          width: '100%',
        },
  ];

  const textColor = outlined ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.WHITE;

  return (
    <Pressable onPress={onPress} style={buttonStyles} disabled={disabled}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <HStack className="gap-2 justify-center items-center">
          {left_icon && icon}

          <Text size={16} weight={600} color={textColor}>
            {children}
          </Text>
          {right_icon && icon}
        </HStack>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 47,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
  outlinedDisabled: {
    borderColor: Colors.GRAY,
  },
});
