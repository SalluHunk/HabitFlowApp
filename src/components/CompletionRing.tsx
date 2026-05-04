import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, FontSize } from '../theme';

interface Props {
  pct: number;
  size?: number;
  color?: string;
}

export default function CompletionRing({ pct, size = 80, color = Colors.primary }: Props) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <View style={{ width: size, height: size, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={Colors.border} strokeWidth={8} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={styles.pct}>{pct}%</Text>
        <Text style={styles.sub}>done</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { alignItems: 'center' },
  pct:   { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  sub:   { fontSize: 9, color: Colors.text3 },
});
