import React, { useState } from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { Colors } from "../../constants/Colors";
import { scaleSize } from "../../helpers/scale-size";
import styles from "./styles";
import { TextProps } from "./text.type";

export const Text = (props: RNTextProps & TextProps) => {
  const {
    underline = false,
    size = 14,
    color = Colors.BLACK,
    align,
    weight = 300,
    transform = "none",
    style,
    onPress,
    children,
    maxLength,
    className,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const textDecoration = underline ? "underline" : "none";

  let displayedText = children as string;
  if (maxLength && !isExpanded && displayedText.length > maxLength) {
    displayedText = `${displayedText.substring(0, maxLength)}`;
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <RNText
      onPress={onPress}
      allowFontScaling={false}
      style={[
        {
          color,
          textDecorationLine: textDecoration,
          fontSize: scaleSize(size),
          textAlign: align,
          textTransform: transform,
          fontWeight: weight,
        },
        style,
      ]}
      className={className}
    >
      {displayedText}
      {maxLength && !isExpanded && (children as string).length > maxLength && (
        <RNText onPress={() => handleToggleExpand()} style={styles.more}>
          ...mas
        </RNText>
      )}
    </RNText>
  );
};
