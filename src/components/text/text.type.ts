import { TextStyle } from 'react-native';

export type TextProps = {
  disabled?: boolean;
  color?: string;
  underline?: boolean;
  size?: number;
  weight?: TextStyle['fontWeight'];
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  transform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  style?: TextStyle | TextStyle[];
  maxLength?: number;
};
