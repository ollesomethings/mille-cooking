import { PressableScale } from '@/components/ui/pressable-scale';
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';

/**
 * The design system's "Selector Buttons" pattern — stadium-outlined option
 * rows with a right-pinned radio — rebuilt from the sales demo's spec
 * (kaiser-rfp-demo src/stories/live/vibe.css, which matches the app):
 * row 72 tall with icons / 54 text-only, border 1.5 #dfdad3, selected =
 * tangelo border + #fff6f1 fill + tangelo radio with a white check,
 * press = scale(.985).
 *
 * API mirrors @somethings-ui/native SelectGroup so it can be swapped back.
 */

const TANGELO = '#FF5001';

export interface SelectorOption {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}

export function SelectorRows({
  options,
  value,
  onChange,
  multiple = false,
  maxSelected,
}: {
  options: SelectorOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxSelected?: number;
}) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const hasIcons = options.some(o => o.icon);
  const hasSubs = options.some(o => o.sub);
  const rowHeight = hasIcons || hasSubs ? 72 : 54;

  const pick = (v: string) => {
    if (!multiple) {
      onChange(v);
      return;
    }
    if (selectedValues.includes(v)) {
      onChange(selectedValues.filter(x => x !== v));
    } else if (!maxSelected || selectedValues.length < maxSelected) {
      onChange([...selectedValues, v]);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      {options.map(option => {
        const selected = selectedValues.includes(option.value);
        return (
          <PressableScale
            key={option.value}
            scaleTo={0.985}
            onPress={() => pick(option.value)}
            accessibilityRole={multiple ? 'checkbox' : 'radio'}
            accessibilityState={{ selected }}
            className="flex-row items-center"
            style={{
              height: rowHeight,
              paddingHorizontal: 24,
              gap: 8,
              backgroundColor: selected ? '#fff6f1' : '#ffffff',
              borderWidth: 1.5,
              borderColor: selected ? TANGELO : '#dfdad3',
              borderRadius: 999,
            }}
          >
            {option.icon ? (
              <View style={{ width: 40, height: 40 }}>{option.icon}</View>
            ) : null}
            <View
              className="flex-1 justify-center"
              style={{ paddingLeft: option.icon ? 8 : 4, minWidth: 0 }}
            >
              <Text
                className="text-primary"
                style={{ fontFamily: 'TWKLausanne-400', fontSize: 16 }}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {option.sub ? (
                <Text
                  style={{ fontFamily: 'TWKLausanne-400', fontSize: 13, color: '#6f6b64', marginTop: 1 }}
                  numberOfLines={1}
                >
                  {option.sub}
                </Text>
              ) : null}
            </View>
            <View
              className="items-center justify-center"
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: selected ? TANGELO : '#c7c7c7',
                backgroundColor: selected ? TANGELO : 'transparent',
              }}
            >
              {selected && <Check size={12} color="#fff" strokeWidth={3.5} />}
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}
