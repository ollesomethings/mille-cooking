import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind only auto-interops core react-native components — className on
 * anything else (reanimated components included) SILENTLY no-ops, dropping
 * padding/rounding/layout. Register every non-core component that takes
 * className here. Imported first in app/_layout.tsx.
 */
cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
cssInterop(Animated.ScrollView, { className: 'style' });
