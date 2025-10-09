import { CircleIcon, EyeIcon, EyeOffIcon } from '@/assets/svg';
import { Colors } from '@/src/constants/Colors';
import React, { useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { Text } from '../text/text.component';
import { FormControl, FormControlErrorIcon, FormControlLabel } from '../ui/form-control';
import { Input as GInput, InputField, InputIcon, InputSlot } from '../ui/input';
import { CustomInputProps } from './input.interface';
import styles from './input.style';

export const Input: React.FC<CustomInputProps> = (props) => {
  const {
    label,
    error,
    touched,
    size = 'lg',
    stretch,
    leftIcon,
    rightIcon,
    icon,
    pressable = false,
    secureTextEntry: secureProp,
    isRequired,
    customLeftIcon,
    style,
    onPress,
    isDisabled,
    ...rest
  } = props;
  const [secureTextEntry, setSecureTextEntry] = useState(!!secureProp);

  const borderColor = isDisabled ? Colors.GRAY : error ? Colors.PRIMARY : Colors.TERTIARY;

  const backgroundColor = isDisabled ? Colors.GRAY : Colors.WHITE;

  const InputContent = (
    <GInput
      size={size}
      variant="rounded"
      pointerEvents={pressable ? 'none' : 'auto'}
      isDisabled={isDisabled}
      style={[styles.input, { borderColor, backgroundColor }, style as ViewStyle]}
    >
      {leftIcon && <InputSlot className="pl-3">{customLeftIcon || (icon && <InputIcon as={icon} />)}</InputSlot>}

      <InputField {...rest} secureTextEntry={secureTextEntry} placeholderTextColor={Colors.TERTIARY} style={{ backgroundColor, fontSize: 16, flex: 1, color: Colors.TEXT }} />

      {rightIcon && (
        <InputSlot style={styles.slot} onPress={() => secureProp && setSecureTextEntry(!secureTextEntry)}>
          <InputIcon as={icon || (secureTextEntry ? EyeIcon : EyeOffIcon)} color={error ? Colors.PRIMARY : Colors.TERTIARY} />
        </InputSlot>
      )}
    </GInput>
  );

  return (
    <FormControl isInvalid={!!error && touched} className={stretch ? 'flex-1' : ''}>
      {label && (
        <FormControlLabel className="mb-4">
          <Text size={16} weight="400" color={error ? Colors.PRIMARY : Colors.TEXT}>
            {label}
          </Text>
        </FormControlLabel>
      )}

      {pressable ? <Pressable onPress={onPress}>{InputContent}</Pressable> : InputContent}

      {touched && error && (
        <View className="mt-2 items-start flex flex-row gap-2">
          {!isRequired && <FormControlErrorIcon as={CircleIcon} color={Colors.PRIMARY} />}
          <Text color={Colors.PRIMARY} weight={300} className="flex-wrap flex-shrink">
            {isRequired ? `*${error}` : error}
          </Text>
        </View>
      )}
    </FormControl>
  );
};
