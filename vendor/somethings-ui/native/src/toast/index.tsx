import { Toast, ToastProps } from './Toast';
import { BaseToastProps } from 'react-native-toast-message';

export * from './Toast';
export * from './use-toast-v2';

export interface ExtendedToastProps extends BaseToastProps {
  props: ToastProps;
}

export const toastConfig = {
  v2: ({ props }: ExtendedToastProps) => <Toast {...props} />,
};
