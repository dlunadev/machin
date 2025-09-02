import { IInputFieldProps } from "@gluestack-ui/core/lib/esm/input/creator/types";
import { ElementType } from "react";
import { TextInputProps } from "react-native";

export interface CustomInputProps extends TextInputProps, IInputFieldProps {
  label?: string;
  error?: string | false;
  touched?: boolean;
  size?: "sm" | "md" | "lg";
  stretch?: boolean;
  leftIcon?: boolean;
  rightIcon?: boolean;
  icon?: ElementType;
  pressable?: boolean;
  customLeftIcon?: React.ReactNode;
}