import React from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@somethings-ui/core';
import { TextInput } from '../text-input';
import { Select } from '../dropdown';

export interface PhoneInputProps {
  className?: string;
  error?: string;
  countryCodes: { label: string; value: string; phone: string }[];
  placeholder?: string;
  disclaimer?: boolean;
  requireAcknowledgment?: boolean;
  value?: string;
  countryCode?: string;
  callingCode?: string;
  onPhoneChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  onAcknowledgeChange?: (acknowledged: boolean) => void;
}

export const PhoneInput = React.forwardRef<RNTextInput, PhoneInputProps>(
  (
    {
      className,
      error,
      countryCodes,
      placeholder = 'XXX-XXX-XXXX',
      disclaimer,
      requireAcknowledgment = false,
      countryCode,
      value,
      onPhoneChange,
      onCountryChange,
      onAcknowledgeChange,
    },
    ref,
  ) => {
    const [acknowledged, setAcknowledged] = React.useState(false);

    const handleCountryChange = (item: any) => {
      onCountryChange?.(item.value);
    };

    const handleAcknowledgePress = () => {
      const next = !acknowledged;
      setAcknowledged(next);
      onAcknowledgeChange?.(next);
    };

    const disclaimerText = (
      <Text style={styles.disclaimerText}>
        By continuing, you agree to our{' '}
        <Text
          onPress={() => Linking.openURL('https://somethings.com/terms-of-use')}
          className="underline"
        >
          Terms of Service
        </Text>
        ,{' '}
        <Text
          onPress={() =>
            Linking.openURL('https://somethings.com/privacy-policy')
          }
          className="underline"
        >
          Privacy Policy
        </Text>
        , and{' '}
        <Text
          onPress={() => Linking.openURL('https://somethings.com/hipaa')}
          className="underline"
        >
          HIPAA Notice
        </Text>
        . You also agree to receive SMS messages related to your Mentorship.
      </Text>
    );

    return (
      <View className={className}>
        <View style={styles.container}>
          <View style={styles.countryCodeContainer}>
            <Select
              data={countryCodes}
              onChange={handleCountryChange}
              value={countryCode}
              disableChevron={true}
              enableSearch={true}
            />
          </View>
          <View style={styles.phoneNumberContainer}>
            <TextInput
              ref={ref}
              variant="default"
              placeholder={placeholder}
              value={value}
              onChangeText={onPhoneChange}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
            />
          </View>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {disclaimer &&
          (requireAcknowledgment ? (
            <View className="mt-3 flex-row items-start gap-3">
              <Pressable
                testID="disclaimer-acknowledge-checkbox"
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acknowledged }}
                onPress={handleAcknowledgePress}
                className="h-4 w-4 items-center justify-center rounded-xs border"
                style={{
                  borderColor: acknowledged
                    ? colors.blue[700]
                    : styles.disclaimerText.color,
                  backgroundColor: acknowledged
                    ? colors.blue[700]
                    : colors.white.DEFAULT,
                }}
              >
                {acknowledged && (
                  <Check
                    size={12}
                    strokeWidth={3}
                    color={colors.white.DEFAULT}
                  />
                )}
              </Pressable>
              <View className="flex-1">{disclaimerText}</View>
            </View>
          ) : (
            disclaimerText
          ))}
      </View>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    minWidth: 80,
    paddingRight: 12,
  },
  phoneNumberContainer: {
    flex: 1,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 8,
    color: '#F47A7A',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999388',
  },
});
