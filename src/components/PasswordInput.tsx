import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '../theme';

interface Props extends Omit<TextInputProps, 'secureTextEntry'> {}

export default function PasswordInput(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrap}>
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        secureTextEntry={!visible}
        placeholderTextColor={Colors.text3}
      />
      <TouchableOpacity style={styles.toggle} onPress={() => setVisible(v => !v)}>
        <Text style={styles.toggleTxt}>{visible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', justifyContent: 'center' },
  input: {
    backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.sm, padding: Spacing.md, paddingRight: 64,
    fontSize: FontSize.base, color: Colors.text,
  },
  toggle: {
    position: 'absolute', right: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 4,
  },
  toggleTxt: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
});
