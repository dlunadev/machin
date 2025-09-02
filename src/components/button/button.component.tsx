import { Colors } from "@/src/constants/Colors";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
} from "react-native";
import { Text } from "../text/text.component";

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  loading?: boolean;
  outlined?: boolean;
  children: ReactNode;
}

export const Button = (props: ButtonProps) => {
  const {
    onPress,
    disabled = false,
    style = {},
    children,
    loading,
    outlined = false,
  } = props;

  const buttonStyles = [
    styles.button,
    outlined ? styles.outlined : {},
    style,
    disabled && (outlined ? styles.outlinedDisabled : styles.disabled),
  ];

  const textColor = outlined
    ? disabled
      ? Colors.GRAY
      : Colors.BLACK
    : Colors.WHITE;

  return (
    <Pressable onPress={onPress} style={buttonStyles} disabled={disabled}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text size={16} weight={600} color={textColor}>
          {children}
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
    height: 47,
    width: '100%',
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  disabled: {
    backgroundColor: "#A0A0A0",
  },
  outlinedDisabled: {
    borderColor: Colors.GRAY,
  },
});
