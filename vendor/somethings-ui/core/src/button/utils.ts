import { colorsV2 } from '../styles/colors_v2';
import type { ButtonVariant } from './types';

/**
 * Get the text color for a button variant
 * @param variant - The button variant
 * @returns The hex color string or undefined if variant not found
 */
export function getButtonTextColor(variant: ButtonVariant): string | undefined {
  return colorsV2.buttonText[variant];
}

/**
 * Get the spinner color for a button variant (same as text color)
 * @param variant - The button variant
 * @returns The hex color string or undefined if variant not found
 */
export const getButtonSpinnerColor = getButtonTextColor;
