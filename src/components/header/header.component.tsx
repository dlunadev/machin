import { Logout, Machin } from "@/assets/svg";
import { sign_out } from "@/sdk/services/auth/auth";
import { Colors } from "@/src/constants/Colors";
import { scaleSize } from "@/src/helpers/scale-size";
import { useInsets } from "@/src/hooks/utils/useInsets";
import { AuthRoutes } from "@/src/utils/enum/routes";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { HStack } from "../ui/hstack";

export const Header = () => {
  const insets = useInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await sign_out();
      router.replace(AuthRoutes.SIGN_IN);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HStack
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 0,
        backgroundColor: Colors.WHITE,
      }}
      className="items-center px-6 justify-between"
    >
      <View className="flex-row gap-2 items-center">
        <Machin width={scaleSize(85)} height={scaleSize(35)} />
      </View>
      <Pressable onPress={handleLogout}>
        <Logout />
      </Pressable>
    </HStack>
  );
};
