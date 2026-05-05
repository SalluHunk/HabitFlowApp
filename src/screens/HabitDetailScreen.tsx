import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, StatusBar,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { RootStackParamList, HabitStats, MilestoneDisplay } from '../types';
import {
  getHabit, getLogsForHabit, getMilestones, toggleLog,
  updateHabit, deleteHabit, isLogged,
} from '../database/db';
import { calculateStreak, calculateBestStreak, getCalendarCells, today } from '../utils/streak';
import { getTrendData } from '../utils/analytics';
import {
  Colors, FontSize, Radius, Shadow, Spacing,
  MILESTONE_LABELS, MILESTONE_ICONS, MILESTONE_THRESHOLDS,
  CategoryBadgeColors,
} from '../theme';
import StatCard from '../components/StatCard';
import HeatmapGrid from '../components/HeatmapGrid';
import AddHabitModal from '../components/AddHabitModal';

const SCREEN_W = Dimensions.get('window').width;

function hexToRgb(hex: string) {
  const clean = (hex ?? '').replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(clean.slice(0, 2), 16) || 0;
  const g = parseInt(clean.slice(2, 4), 16) || 0;
  const b = parseInt(clean.slice(4, 6), 16) || 0;
  return { r, g, b };
}

type Route = { key: string; name: 'HabitDetail'; params: { habitId: number } };
type Nav   = NativeStackNavigationProp<RootStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen() {
  const route     = useRoute<Route>();
  const nav       = useNavigation<Nav>();
  const habitId   = route.params.habitId;

  const [habit, setHabit]         = useState<any>(null);
  const [stats, setStats]         = useState<HabitStats | null>(null);
  const [calendar, setCalendar]   = useState<any[]>([]);
  const [trend, setTrend]         = useState<any[]>([]);
  const [recentLogs, setRecent]   = useState<any[]>([]);
  const [editVisible, setEdit]    = useState(false);

  const load = useCallback(() => {
    const h = getHabit(habitId);
    if (!h) { nav.goBack(); return; }
    setHabit(h);

    const logs = getLogsForHabit(habitId);
    const t = today();
    const streak = calculateStreak(logs, t);
    const best   = calculateBestStreak(logs);
    const cutoff = (() => {
      const d = new Date(); d.setDate(d.getDate() - 30);
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    })();
    const recent30 = logs.filter(l => l.date >= cutoff);
    const rate = Math.round(recent30.length / 30 * 100);

    // Milestones
    const achieved = new Set(getMilestones(habitId).map(m => m.type));
    const milestones: MilestoneDisplay[] = MILESTONE_THRESHOLDS.map(thresh => ({
      key: `streak_${thresh}`,
      label: MILESTONE_LABELS[thresh],
      icon: MILESTONE_ICONS[thresh],
      achieved: achieved.has(`streak_${thresh}`),
      threshold: thresh,
    }));

    setStats({ streak, best_streak: best, total_completions: logs.length, completion_rate: rate, milestones });
    setCalendar(getCalendarCells(logs, 12));
    setTrend(getTrendData(logs, 8));
    setRecent(logs.slice(0, 20));
  }, [habitId, nav]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleToggleLog = () => {
    toggleLog(habitId);
    load();
  };

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Delete "${habit?.name}"? This removes all logs.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        deleteHabit(habitId);
        nav.goBack();
      }},
    ]);
  };

  const handleSaveEdit = (data: any) => {
    updateHabit(habitId, data);
    load();
  };

  if (!habit || !stats) return null;

  const logged = isLogged(habitId);
  const badge  = CategoryBadgeColors[habit.category] ?? CategoryBadgeColors.general;

  const chartData = {
    labels: trend.map(d => d.label),
    datasets: [{ data: trend.map(d => d.count) }],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setEdit(true)}>
            <Text style={styles.actionTxt}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
            <Text style={[styles.actionTxt, { color: Colors.danger }]}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Hero header */}
        <View style={[styles.hero, { borderLeftColor: habit.color }]}>
          <View style={[styles.heroIcon, { backgroundColor: habit.color + '22' }]}>
            <Text style={styles.heroEmoji}>{habit.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{habit.name}</Text>
            <View style={styles.heroMeta}>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeTxt, { color: badge.text }]}>{habit.category}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{habit.frequency}</Text>
              </View>
            </View>
            {!!habit.description && <Text style={styles.heroDesc}>{habit.description}</Text>}
          </View>
        </View>

        {/* Log button */}
        <TouchableOpacity
          style={[styles.logBtn, { borderColor: habit.color, backgroundColor: logged ? habit.color : 'transparent' }]}
          onPress={handleToggleLog}
          activeOpacity={0.85}
        >
          <Text style={[styles.logBtnTxt, { color: logged ? Colors.white : habit.color }]}>
            {logged ? '✓  Logged Today — Tap to Undo' : 'Log Today'}
          </Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value={stats.streak}            label="Streak"      icon="🔥" iconColor={Colors.warning} />
          <StatCard value={stats.best_streak}       label="Best"        icon="🏆" iconColor="#a855f7" />
          <StatCard value={stats.total_completions} label="Total Days"  icon="📅" iconColor={Colors.success} />
          <StatCard value={`${stats.completion_rate}%`} label="30-Day Rate" icon="%" iconColor={Colors.primary} />
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.milestoneRow}>
              {stats.milestones.map(m => (
                <View key={m.key} style={[styles.ms, m.achieved && styles.msAchieved]}>
                  <Text style={styles.msIcon}>{m.icon}</Text>
                  <Text style={styles.msLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Calendar heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12-Week Activity</Text>
          <View style={styles.card}>
            <HeatmapGrid cells={calendar} color={habit.color} cellSize={15} gap={3} />
            <View style={styles.legend}>
              <Text style={styles.legendTxt}>Less</Text>
              <View style={[styles.lc, { backgroundColor: Colors.border }]} />
              <View style={[styles.lc, { backgroundColor: habit.color + '44' }]} />
              <View style={[styles.lc, { backgroundColor: habit.color + '99' }]} />
              <View style={[styles.lc, { backgroundColor: habit.color }]} />
              <Text style={styles.legendTxt}>More</Text>
            </View>
          </View>
        </View>

        {/* Trend chart */}
        {trend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Trend</Text>
            <View style={styles.card}>
              <BarChart
                data={chartData}
                width={SCREEN_W - Spacing.lg * 2 - 32}
                height={180}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.card,
                  backgroundGradientTo: Colors.card,
                  decimalPlaces: 0,
                  color: (op = 1) => { const {r,g,b} = hexToRgb(habit.color); return `rgba(${r},${g},${b},${op})`; },
                  labelColor: () => Colors.text3,
                  style: { borderRadius: Radius.md },
                  barPercentage: 0.6,
                  propsForBackgroundLines: { stroke: Colors.border },
                }}
                style={{ borderRadius: Radius.md }}
                showValuesOnTopOfBars
                fromZero
              />
            </View>
          </View>
        )}

        {/* Recent logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          {recentLogs.length === 0 ? (
            <Text style={styles.empty}>No logs yet. Start tracking!</Text>
          ) : (
            <View style={styles.card}>
              {recentLogs.map((l, i) => (
                <View key={l.id} style={[styles.logRow, i < recentLogs.length - 1 && styles.logRowBorder]}>
                  <Text style={styles.logDate}>{l.date}</Text>
                  <Text style={styles.logValue}>{l.value} {habit.unit}</Text>
                  <Text style={styles.logNote}>{l.notes || '—'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </ScrollView>

      <AddHabitModal
        visible={editVisible}
        onClose={() => setEdit(false)}
        onSave={handleSaveEdit}
        editHabit={habit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.bg },
  body:        { padding: Spacing.lg, paddingBottom: 40 },
  topBar:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm },
  backBtn:     { paddingVertical: 6, paddingHorizontal: 2 },
  backTxt:     { fontSize: FontSize.base, color: Colors.primary, fontWeight: '600' },
  topActions:  { flexDirection: 'row', gap: Spacing.sm },
  actionBtn:   { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  deleteBtn:   { borderColor: Colors.dangerLight },
  actionTxt:   { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text2 },
  hero: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.lg,
    borderLeftWidth: 5, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md, ...Shadow.sm,
  },
  heroIcon:  { width: 60, height: 60, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 28 },
  heroTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, letterSpacing: -0.4 },
  heroMeta:  { flexDirection: 'row', gap: Spacing.xs, marginTop: 4, flexWrap: 'wrap' },
  heroDesc:  { fontSize: FontSize.xs, color: Colors.text3, marginTop: 4 },
  badge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full,
    backgroundColor: Colors.bg,
  },
  badgeTxt: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize', color: Colors.text2 },
  logBtn: {
    borderWidth: 2, borderRadius: Radius.sm, paddingVertical: 13,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  logBtnTxt: { fontSize: FontSize.base, fontWeight: '700' },
  statsRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  section:   { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  milestoneRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 4 },
  ms: {
    alignItems: 'center', padding: Spacing.sm, borderRadius: Radius.md,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.bg,
    opacity: 0.4, minWidth: 68,
  },
  msAchieved: { opacity: 1, backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  msIcon:    { fontSize: 24, marginBottom: 3 },
  msLabel:   { fontSize: 9, fontWeight: '700', color: Colors.text2, textAlign: 'center' },
  legend:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  legendTxt: { fontSize: FontSize.xs, color: Colors.text3 },
  lc:        { width: 12, height: 12, borderRadius: 3 },
  logRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  logRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  logDate:   { flex: 2, fontSize: FontSize.sm, color: Colors.text2 },
  logValue:  { flex: 1, fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  logNote:   { flex: 2, fontSize: FontSize.xs, color: Colors.text3, textAlign: 'right' },
  empty:     { fontSize: FontSize.sm, color: Colors.text3, padding: Spacing.md },
});
