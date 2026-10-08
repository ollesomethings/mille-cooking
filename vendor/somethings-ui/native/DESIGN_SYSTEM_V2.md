# Design System V2 - Native Components

A comprehensive guide to all native components available in the `@somethings-ui/native` package.

## Table of Contents

- [Button](#button)
- [TextInput](#textinput)
- [SelectGroup](#selectgroup)
- [Dropdown](#dropdown)
- [Modal](#modal)
- [Switch](#switch)
- [PhoneInput](#phoneinput)
- [ContentBlock](#contentblock)

---

## Button

A versatile button component with multiple variants, sizes, and states.

### Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'destructive' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'pill' | 'rounded' | 'square';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  onPress?: (event: GestureResponderEvent) => void;
}
```

### Features

- **Variants**: Primary, secondary, tertiary, quaternary, destructive, elevated
- **Sizes**: Small, medium, large
- **Shapes**: Pill, rounded, square
- **States**: Loading, disabled
- **Icons**: Leading and trailing icon support
- **Haptics**: Configurable haptic feedback
- **Responsive**: Full width option

### Usage

```tsx
<Button 
  variant="primary" 
  size="lg" 
  onPress={handlePress}
  leadingIcon={<Icon />}
>
  Click me
</Button>
```

---


```tsx
<IconButton 
  icon={<HeartIcon />} 
  variant="primary" 
  size="md" 
  onPress={handleLike}
/>
```

---

## TextInput

A comprehensive text input component with validation and icon support.

### Props

```typescript
interface TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: 'outlined' | 'default';
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}
```

### Features

- **Validation**: Error and helper text support
- **Icons**: Leading and trailing icon positioning
- **Variants**: Outlined and default styles
- **Accessibility**: Proper label association
- **Styling**: Customizable class names for each element

### Usage

```tsx
<TextInput
  label="Email"
  placeholder="Enter your email"
  error="Invalid email format"
  leadingIcon={<MailIcon />}
/>
```

---

## SelectGroup

A flexible selection component supporting radio buttons and checkboxes.

### Props

```typescript
interface SelectGroupProps {
  options: SelectGroupOption[];
  value?: SelectGroupValue;
  onChange: (value: SelectGroupValue) => void;
  variant?: 'radio' | 'checkbox';
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}
```

### Features

- **Selection types**: Radio buttons and checkboxes
- **Multiple selection**: Support for multi-select
- **Animations**: Smooth transitions and haptic feedback
- **Customization**: Flexible styling and layout options
- **Accessibility**: Proper ARIA attributes

### Usage

```tsx
<SelectGroup
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  variant="radio"
/>
```

---

## Dropdown

A dropdown selection component using bottom sheet presentation.

### Props

```typescript
interface DropdownProps {
  data: DropdownItem[];
  value?: string | number;
  placeholder?: string;
  onChange: (item: DropdownItem) => void;
  disabled?: boolean;
  error?: string;
  disableChevron?: boolean;
  enableSearch?: boolean;
}
```

### Features

- **Bottom sheet**: Native bottom sheet presentation
- **Search**: Optional search functionality
- **Validation**: Error state support
- **Haptics**: Touch feedback on selection
- **Customization**: Disable chevron, custom styling

### Usage

```tsx
<Select
  data={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Select country"
/>
```

---

## Modal

A bottom sheet modal component with customizable content and header.

### Props

```typescript
interface ModalProps {
  visible?: boolean;
  title?: string;
  description?: string;
  dismissible?: boolean;
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  onDismiss?: () => void;
  onClose?: () => void;
}
```

### Features

- **Bottom sheet**: Native bottom sheet implementation
- **Auto-sizing**: Dynamic height based on content
- **Haptic feedback**: Configurable touch feedback
- **Backdrop**: Customizable backdrop behavior
- **Accessibility**: Proper modal behavior

### Usage

```tsx
<BottomSheetModal
  visible={isVisible}
  title="Settings"
  description="Configure your preferences"
  onDismiss={handleDismiss}
>
  <View>Modal content here</View>
</BottomSheetModal>
```

---


## Switch

A toggle switch component with animations and haptic feedback.

### Props

```typescript
interface SwitchProps {
  value?: boolean;
  defaultValue?: boolean;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  enableHaptics?: boolean;
  hapticIntensity?: Haptics.ImpactFeedbackStyle;
  onValueChange?: (value: boolean) => void;
}
```

### Features

- **Smooth animations**: Spring-based transitions
- **Loading state**: Spinner animation when loading
- **Haptic feedback**: Configurable touch feedback
- **Label positioning**: Left or right label placement
- **Accessibility**: Proper switch role and states

### Usage

```tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  label="Enable notifications"
  description="Receive push notifications"
  labelPosition="right"
/>
```

---

## PhoneInput

A phone number input component with country code selection.

### Props

```typescript
interface PhoneInputProps {
  countryCodes: { label: string; value: string; phone: string }[];
  value?: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string, phonePrefix: string) => void;
  placeholder?: string;
  error?: string;
  disclaimer?: boolean;
}
```

### Features

- **Country selection**: Dropdown for country codes
- **Phone formatting**: Placeholder and validation
- **Error handling**: Error state display
- **Disclaimer**: Optional terms and conditions text
- **Responsive layout**: Flexible container sizing

### Usage

```tsx
<PhoneInput
  countryCodes={countryList}
  value={phoneNumber}
  onChange={setPhoneNumber}
  onCountryChange={handleCountryChange}
  placeholder="XXX-XX-XXXX"
  disclaimer={true}
/>
```

---


## ContentBlock

A content container component for structured text layout.

### Props

```typescript
interface ContentBlockProps {
  header?: string;
  body?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 's' | 'm' | 'l';
  fullWidth?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}
```

### Features

- **Text structure**: Header and body text sections
- **Alignment**: Left, center, or right alignment
- **Sizes**: Small, medium, and large text sizes
- **Styling**: Customizable class names
- **Responsive**: Full width option

### Usage

```tsx
<ContentBlock
  header="Welcome"
  body="This is the main content area"
  alignment="center"
  size="l"
/>
```

---


## Component Dependencies

All components are built on top of the `@somethings-ui/core` package and use:

- **React Native**: Core platform components
- **React Native Reanimated**: Smooth animations
- **Expo Haptics**: Touch feedback
- **Lucide React Native**: Icon library
- **React Native Bottom Sheet**: Modal presentations
- **Tailwind CSS**: Styling system

## Usage Guidelines

1. **Consistent theming**: Use the provided variant and size props
2. **Accessibility**: All components include proper accessibility attributes
3. **Haptic feedback**: Enable haptics for better user experience
4. **Responsive design**: Use fullWidth and flexible layouts appropriately
5. **Error handling**: Implement proper error states and validation

## Getting Started

```tsx
import { 
  Button, 
  TextInput, 
  SelectGroup,
  Modal 
} from '@somethings-ui/native';

// Use components with consistent API
<Button variant="primary" size="lg">
  Get Started
</Button>
```
