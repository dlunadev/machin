import { Colors } from "@/src/constants/Colors";
import { dimensions } from "@/src/helpers/get-dimensions";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Toast as GToast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "../../components/ui/toast";

interface CustomToastProps {
  title: string;
  children: React.ReactNode;
  duration?: number;
  placement?: "top" | "bottom";
}

export const useCustomToast = () => {
  const toast = useToast();
  const [toastId, setToastId] = React.useState<string>("0");

  const showToast = (props: CustomToastProps) => {
    const { title, children, duration = 3000, placement = "top" } = props;

    if (!toast.isActive(toastId)) {
      const newId = Math.random().toString();
      setToastId(newId);

      toast.show({
        id: newId,
        placement,
        duration,
        render: ({ id }) => (
          <GToast
            nativeID={`toast-${id}`}
            variant="solid"
            action="muted"
            style={{ width: dimensions.width - 32 }}
          >
            <View style={styles.toastContainer}>
              <ToastTitle style={styles.title}>{title}</ToastTitle>
              <ToastDescription style={styles.description}>
                {children}
              </ToastDescription>
            </View>
          </GToast>
        ),
      });
    }
  };

  return { showToast };
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: Colors.SECONDARY, // Fondo del toast
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Para Android
    width: "100%",
    alignSelf: "center",
  },
  title: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  description: {
    color: Colors.WHITE,
    fontSize: 14,
  },
});
