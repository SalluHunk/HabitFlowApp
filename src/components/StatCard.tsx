import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Shadow, Spacing, FontSize } from '../theme';

interface Props {
  value: string | number;
  label: string;
  icon: string;
  iconColor?: string;
  accentColor?: string;
}

export default function StatCard({ value, label, icon, iconColor, accentColor }: Props) {
  return (
    <View style={[styles.card, accentColor ? { borderLeftColor: accentColor, borderLeftWidth: 3 } : null]}>
      <Text style={[styles.icon, iconColor ? { color: iconColor } : null]}>{icon}</Text>
      <View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  icon: {
    fontSize: 22,
    color: Colors.primary,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 26,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.text3,
    marginTop: 1,
  },
});
