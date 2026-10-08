import { ChevronDown, Circle } from 'lucide-react-native';
import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetSectionList,
  BottomSheetBackdrop,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Circle as SvgCircle } from 'react-native-svg';

const Bullseye = ({
  size = 16,
  color = '#1F1E1D',
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <SvgCircle
      cx="8"
      cy="8"
      r="7"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <SvgCircle cx="8" cy="8" r="4" fill={color} />
  </Svg>
);

export interface DropdownItem {
  label: string;
  value: string | number;
  key?: string;
}

export interface DropdownSection {
  key?: string;
  title: string;
  data: DropdownItem[];
}

interface BaseDropdownProps {
  className?: string;
  error?: string;
  disableChevron?: boolean;
  value?: string | number;
  placeholder?: string;
  onChange: (item: DropdownItem) => void;
  disabled?: boolean;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

interface FlatDropdownProps extends BaseDropdownProps {
  data: DropdownItem[];
  sections?: never;
}

interface SectionedDropdownProps extends BaseDropdownProps {
  sections: DropdownSection[];
  data?: never;
}

export type DropdownProps = FlatDropdownProps | SectionedDropdownProps;

interface DropdownOption {
  item: DropdownItem;
  key: string;
}

interface NormalizedDropdownSection {
  key: string;
  title?: string;
  data: DropdownOption[];
}

function valueKey(value: DropdownItem['value']): string {
  return String(value);
}

function duplicateValues(items: DropdownItem[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  items.forEach(item => {
    const key = valueKey(item.value);

    if (seen.has(key)) {
      duplicates.add(key);
      return;
    }

    seen.add(key);
  });

  return duplicates;
}

function toDropdownOptions(
  items: DropdownItem[],
  sectionKey: string,
  duplicates: Set<string>,
): DropdownOption[] {
  return items.map((item, index) => {
    const itemValueKey = valueKey(item.value);
    const key =
      item.key ??
      (duplicates.has(itemValueKey)
        ? `${sectionKey}:${itemValueKey}:${index}`
        : itemValueKey);

    return { item, key };
  });
}

function normalizeDropdownSections(
  data?: DropdownItem[],
  sections?: DropdownSection[],
): NormalizedDropdownSection[] {
  if (sections) {
    const allItems = sections.flatMap(section => section.data);
    const duplicates = duplicateValues(allItems);

    return sections.map((section, index) => {
      const sectionKey = section.key ?? `${section.title}:${index}`;

      return {
        key: sectionKey,
        title: section.title,
        data: toDropdownOptions(section.data, sectionKey, duplicates),
      };
    });
  }

  return [
    {
      key: 'flat',
      data: toDropdownOptions(data ?? [], 'flat', duplicateValues(data ?? [])),
    },
  ];
}

function filterSections(
  sections: NormalizedDropdownSection[],
  searchQuery: string,
): NormalizedDropdownSection[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) {
    return sections;
  }

  return sections
    .map(section => {
      const titleMatch = section.title?.toLowerCase().includes(q) ?? false;
      const matchingItems = section.data.filter(item =>
        item.item.label.toLowerCase().includes(q),
      );

      if (titleMatch) {
        return section;
      }
      if (matchingItems.length === 0) {
        return null;
      }
      return { ...section, data: matchingItems };
    })
    .filter(
      (section): section is NormalizedDropdownSection => section !== null,
    );
}

export const Select: React.FC<DropdownProps> = ({
  className,
  error,
  disableChevron,
  data,
  sections,
  value,
  placeholder = 'Select item',
  onChange,
  disabled = false,
  enableSearch = false,
  searchPlaceholder = 'Search...',
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsSearchFocused] = useState(false);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const { top: topInset } = useSafeAreaInsets();

  const normalizedSections = useMemo(
    () => normalizeDropdownSections(data, sections),
    [data, sections],
  );

  const selectedItem = useMemo(
    () =>
      normalizedSections
        .flatMap(section => section.data)
        .find(option => option.item.value === value)?.item,
    [normalizedSections, value],
  );

  const filteredSections = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) {
      return normalizedSections;
    }
    return filterSections(normalizedSections, searchQuery);
  }, [normalizedSections, searchQuery, enableSearch]);

  const handlePresentModal = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsVisible(true);
      bottomSheetRef.current?.present();
    }
  }, [disabled]);

  const handleSelectItem = useCallback(
    (item: DropdownItem) => {
      onChange(item);
      setIsVisible(false);
      bottomSheetRef.current?.dismiss();
    },
    [onChange],
  );

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setSearchQuery('');
    setIsSearchFocused(false);
  }, []);

  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (enableSearch && bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
    }
  }, [enableSearch]);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused(false);
  }, []);

  const renderItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: DropdownOption;
      index: number;
      section: NormalizedDropdownSection;
    }) => {
      const isSelected = item.item.value === value;
      const isLastInSection = index === section.data.length - 1;

      return (
        <Pressable
          style={[
            styles.optionItem,
            isSelected && styles.selectedOptionItem,
            isLastInSection && styles.lastOptionItem,
          ]}
          onPress={() => handleSelectItem(item.item)}
        >
          <Text
            style={[styles.optionText, isSelected && styles.selectedOptionText]}
          >
            {item.item.label}
          </Text>
          {isSelected ? (
            <Bullseye size={16} color="#1F1E1D" />
          ) : (
            <Circle size={16} color="#DFDAD3" strokeWidth={2} />
          )}
        </Pressable>
      );
    },
    [value, handleSelectItem],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: NormalizedDropdownSection }) =>
      section.title ? (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{section.title}</Text>
        </View>
      ) : null,
    [],
  );

  const keyExtractor = useCallback((item: DropdownOption) => item.key, []);

  return (
    <View className={className}>
      <TouchableOpacity
        style={[styles.dropdown, disabled && styles.disabled]}
        onPress={handlePresentModal}
        disabled={disabled}
      >
        <Text
          style={
            selectedItem ? styles.selectedTextStyle : styles.placeholderStyle
          }
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        {!disableChevron && <ChevronDown color="#1F1E1D" size={20} />}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        topInset={topInset}
        enablePanDownToClose
        onDismiss={handleDismiss}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <View style={styles.bottomSheetContent}>
          {enableSearch && (
            <View style={styles.searchContainer}>
              <BottomSheetTextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </View>
          )}
          <BottomSheetSectionList
            sections={filteredSections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 38,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 2,
    borderColor: '#1F1E1D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabled: {
    opacity: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#B8B2A9',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#1F1E1D',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 8,
    color: '#F47A7A',
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  searchInput: {
    height: 38,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderColor: '#1F1E1D',
    fontSize: 16,
    color: '#1F1E1D',
  },
  searchContainer: {
    paddingTop: 16,
    marginBottom: 16,
  },
  sectionHeaderContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6560',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  selectedOptionItem: {
    backgroundColor: 'transparent',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#1F1E1D',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '500',
  },
});
