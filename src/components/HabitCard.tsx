import React, { useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Pressable,
} from 'react-native';
import { HabitWithStatus } from '../types';
import { CategoryBadgeColors, Colors, FontSize, Radius, Shadow, Spacing } from '../theme';

interface Props {
  habit: HabitWithStatus;
  onLog: (id: number) => void;
  onPress: (id: number) => void;
}

export default function HabitCard({ habit, onLog, onPress }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLog = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
    onLog(habit.id);
  }, [habit.id, onLog, scaleAnim]);

  const badge = CategoryBadgeColors[habit.category] ?? CategoryBadgeColors.general;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[
          styles.card,
          { borderLeftColor: habit.color },
          habit.logged_today && styles.cardDone,
        ]}
        onPress={() => onPress(habit.id)}
      >
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: habit.color + '22' }]}>
            <Text style={styles.iconText}>{habit.icon}</Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{habit.category}</Text>
            </View>
          </View>

          <View style={styles.streakWrap}>
            {habit.streak > 0 ? (
              <>
                <Text style={[styles.streakNum, habit.streak >= 3 && styles.streakHot]}>
                  {habit.streak}
                </Text>
                <Text style={styles.fire}>🔥</Text>
              </>
            ) : (
              <Text style={styles.streakZero}>—</Text>
            )}
          </View>
        </View>

        {/* Description */}
        {!!habit.description && (
          <Text style={styles.desc} numberOfLines={1}>{habit.description}</Text>
        )}

        {/* Log button */}
        <TouchableOpacity
          style={[
            styles.logBtn,
            { borderColor: habit.color },
            habit.logged_today && styles.logBtnDone,
          ]}
          onPress={handleLog}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.logBtnText,
            { color: habit.logged_today ? Colors.white : habit.color },
          ]}>
            {habit.logged_today ? '✓  Done Today' : 'Log Today'}
          </Text>
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
    gap: Spacing.sm,
  },
  cardDone: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.border,
    borderLeftColor: Colors.success,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 42, height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText:  { fontSize: 20 },
  meta:      { flex: 1, gap: 3 },
  name:      { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize' },
  streakWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  streakNum:  { fontSize: FontSize.md, fontWeight: '800', color: Colors.text2 },
  streakHot:  { color: '#d97706' },
  fire:       { fontSize: FontSize.md },
  streakZero: { fontSize: FontSize.md, color: Colors.text3 },
  desc:       { fontSize: FontSize.xs, color: Colors.text3 },
  logBtn: {
    borderWidth: 2,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logBtnDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  logBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
});
