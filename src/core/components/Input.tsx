import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
};

export function Input({
  label,
  error,
  containerStyle,
  labelStyle,
  style,
  placeholderTextColor,
  ...props
}: InputProps) {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: colors.foreground, marginBottom: spacing.xs },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: error 
              ? colors.destructive 
              : isFocused 
                ? colors.primary 
                : colors.border,
            color: colors.foreground,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.md,
          },
          style,
        ]}
        placeholderTextColor={placeholderTextColor ?? colors.mutedForeground}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error ? (
        <Text
          style={[
            styles.error,
            { color: colors.destructive, marginTop: spacing.xs },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, fontSize: 16 },
  error: { fontSize: 12 },
});
