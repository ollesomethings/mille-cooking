/* <div className="w-3 h-3 p-0.5 bg-[#ffede6] rounded-full justify-center items-center gap-0.5 inline-flex">
<div className="w-2 h-2 justify-center items-center flex">
<div className="w-2 h-2 relative flex-col justify-start items-start flex overflow-hidden" />
</div>
</div>
*/

import { BrandIconSize } from './types';

export const brandIconBaseStyles =
  'flex items-center justify-center p-2 rounded-full';

export const getBrandIconSizeStyles = (size?: BrandIconSize) => {
  switch (size) {
    case 'sm':
      return 'w-6 h-6 p-[4px]';
    case 'md':
      return 'w-8 h-8';
    case 'lg':
      return 'w-10 h-10';
    case 'xl':
      return 'w-12 h-12';
    case '2xl':
      return 'w-14 h-14';
    case '3xl':
      return 'w-16 h-16';
    default:
      return 'w-8 h-8';
  }
};
