import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useInsets = () => {
  const insets = useSafeAreaInsets();
  return insets;
};
