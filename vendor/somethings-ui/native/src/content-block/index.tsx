import * as React from 'react';
import { Text, View } from 'react-native';

import type { BaseContentBlockProps } from '@somethings-ui/core';
import {
  contentBlockContainerStyles,
  contentBlockHeaderStyles,
  contentBlockBodyStyles,
  cn,
  colorsV2,
} from '@somethings-ui/core';

export interface ContentBlockProps
  extends
    Omit<React.ComponentProps<typeof View>, keyof BaseContentBlockProps>,
    BaseContentBlockProps {}

export const ContentBlock = React.forwardRef<View, ContentBlockProps>(
  (
    {
      alignment = 'left',
      size = 'm',
      header,
      body,
      className,
      headerClassName,
      bodyClassName,
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <View
        ref={ref}
        className={cn(
          contentBlockContainerStyles({
            alignment,
            className,
          }),
        )}
        style={style}
        {...props}
      >
        {header && (
          <Text
            className={cn(
              contentBlockHeaderStyles({ alignment, size }),
              headerClassName,
            )}
            style={{ color: colorsV2.text.primary }}
          >
            {header}
          </Text>
        )}
        {body && (
          <Text
            className={cn(
              contentBlockBodyStyles({ alignment, size }),
              bodyClassName,
            )}
            style={{ color: colorsV2.text.secondary }}
          >
            {body}
          </Text>
        )}
      </View>
    );
  },
);

ContentBlock.displayName = 'ContentBlock';
