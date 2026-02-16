import React, { ReactNode } from "react";
import { View } from "react-native";
import { useInsets } from "../../hooks/utils/useInsets";

import styles from "./container.style";

export const Container = ({ children }: { children: ReactNode }) => {
  const insets = useInsets();

  return (
    <View
      className={`flex flex-1 px-6`}
      style={[{ paddingTop: insets.top, paddingBottom: insets.bottom }, styles.container]}
    >
      {children}
    </View>
  );
};
