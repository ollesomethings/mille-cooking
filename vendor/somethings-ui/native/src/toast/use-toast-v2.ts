import Toast, { ToastShowParams } from 'react-native-toast-message';
import { ToastProps } from './Toast';

export const useToastV2 = () => {
  const toast = (props: ToastProps, config?: ToastShowParams) => {
    Toast.show({
      props: props,
      type: 'v2',
      position: 'bottom',
      ...(config || {}),
    });
  };

  return {
    toast,
  };
};
