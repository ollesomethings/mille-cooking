import { cva } from 'class-variance-authority';

const modalOverlayStyles = cva([
  'fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50',
]);

const modalContainerStyles = cva(
  ['bg-white rounded-t-[20px] w-full max-h-[90vh] px-[24px]'],
  {
    variants: {
      visible: {
        true: 'translate-y-0',
        false: 'translate-y-full',
      },
    },
    defaultVariants: {
      visible: false,
    },
  },
);

const modalHeaderStyles = cva([
  'flex flex-row justify-between items-start mt-[32px]',
]);

const modalHandleStyles = cva([
  'w-[40px] h-[4px] bg-surfaces-divider rounded-full mx-auto mb-[8px] mt-[8px]',
]);

const modalTitleStyles = cva(['text-text-primary text-header-3 gap-[4px]']);

const modalDescriptionStyles = cva([
  'flex flex-row justify-between items-start mt-[4px] mb-[24px]',
]);

const modalDescriptionTextStyles = cva([
  'text-text-secondary text-body-1 gap-[4px]',
]);

const modalCloseButtonStyles = cva(['p-2 rounded-full hover:bg-gray-100']);

const modalContentStyles = cva(['overflow-y-auto mb-[16px]']);

export {
  modalOverlayStyles,
  modalContainerStyles,
  modalHeaderStyles,
  modalHandleStyles,
  modalTitleStyles,
  modalDescriptionStyles,
  modalDescriptionTextStyles,
  modalCloseButtonStyles,
  modalContentStyles,
};
