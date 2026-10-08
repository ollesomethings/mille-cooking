import { Easing } from 'react-native-reanimated';

/**
 * Brand motion language, from the sales-demo tokens (--sm-ease-standard).
 * Fast out, long settle — use for every entrance/slide/fill.
 */
export const EASE_STANDARD = Easing.bezier(0.32, 0.72, 0, 1);
