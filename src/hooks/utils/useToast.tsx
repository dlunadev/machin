import { Text } from '@/src/components';
import { dimensions } from '@/src/helpers/get-dimensions';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast as GToast, useToast } from '../../components/ui/toast';

interface CustomToastProps {
  title: string;
  children: React.ReactNode;
  duration?: number;
  placement?: 'top' | 'bottom';
}


export const useCustomToast = () => {
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const [toastId, setToastId] = React.useState<string>('0');

  const showToast = (props: CustomToastProps) => {
    const { title, children, duration = 3000, placement = 'top' } = props;

    if (!toast.isActive(toastId)) {
      const newId = Math.random().toString();
      setToastId(newId);

      toast.show({
        id: newId,
        placement,
        duration,
        render: ({ id }) => (
          <GToast nativeID={`toast-${id}`} style={{ width: dimensions.width - 32, marginTop: insets.top + 16 }} className='bg-white shadow-md'>
            <View style={[styles.toastContainer]}>
              <Text size={18} style={styles.title}>{title}</Text>
              <Text size={14} style={styles.description}>{children}</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});
