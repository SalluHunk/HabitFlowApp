import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { RootStackParamList, HabitStats, MilestoneDisplay } from '../types';
import {
  apiGetHabitDetail, apiToggleLog, apiUpdateHabit, apiDeleteHabit,
} from '../api/client';
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
  const route   = useRoute<Route>();
  const nav     = useNavigation<Nav>();
  const habitId = route.params.habitId;

  const [habit, setHabit]       = useState<any>(null);
  const [stats, setStats]       = useState<HabitStats | null>(null);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [trend, setTrend]       = useState<any[]>([]);
  const [recentLogs, setRecent] = useState<any[]>([]);
  const [editVisible, setEdit]  = useState(false);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await apiGetHabitDetail(habitId);
      setHabit(r.habit);
      // Build milestones from threshold list + achieved set
      const stats = r.stats;
      setStats({
        streak: stats.streak,
        best_streak: stats.best_streak,
        total_completions: stats.total_completions,
        completion_rate: stats.completion_rate,
        milestones: MILESTONE_THRESHOLDS.map(t => {
          const got = (stats.milestones || []).find((m: any) => m.threshold === t);
          return {
            key: `streak_${t}`,
            label: MILESTONE_LABELS[t],
            icon: MILESTONE_ICONS[t],
            achieved: got ? got.achieved : false,
            threshold: t,
          } as MilestoneDisplay;
        }),
      });
      setCalendar(r.calendar);
      setTrend(r.trend);
      setRecent(r.logs.slice(0, 20));
    } catch (e: any) {
      console.error(e);
      nav.goBack();
    } finally {
      setLoading(false);
    }
  }, [habitId, nav]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleToggleLog = async () => {
    try {
      await apiToggleLog(habitId);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Delete "${habit?.name}"? This removes all logs.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await apiDeleteHabit(habitId);
          nav.goBack();
        } catch (e: any) {
          Alert.alert('Error', e.message);
        }
      }},
    ]);
  };

  const handleSaveEdit = async (data: any) => {
    try {
      await apiUpdateHabit(habitId, data);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading || !habit || !stats) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </SafeAreaView>
    );
  }

  const logged = recentLogs.some(l => l.date === new Date().toISOString().slice(0,10));
  const badge  = CategoryBadgeColors[habit.category] ?? CategoryBadgeColors.general;

  const chartData = {
    labels: trend.map(d => d.label),
    datasets: [{ data: trend.map(d => d.count) }],
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

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

        <TouchableOpacity
          style={[styles.logBtn, { borderColor: habit.color, backgroundColor: logged ? habit.color : 'transparent' }]}
          onPress={handleToggleLog}
          activeOpacity={0.85}
        >
          <Text style={[styles.logBtnTxt, { color: logged ? Colors.white : habit.color }]}>
            {logged ? '✓  Logged Today — Tap to Undo' : 'Log Today'}
          </Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <StatCard value={stats.streak}            label="Streak"      icon="🔥" iconColor={Colors.warning} />
          <StatCard value={stats.best_streak}       label="Best"        icon="🏆" iconColor="#a855f7" />
          <StatCard value={stats.total_completions} label="Total Days"  icon="📅" iconColor={Colors.success} />
          <StatCard value={`${stats.completion_rate}%`} label="30-Day Rate" icon="%" iconColor={Colors.primary} />
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12-Week Activity</Text>
          <View style={styles.card}>
            <HeatmapGrid cells={calendar} color={habit.color} cellSize={15} gap={3} />
          </View>
        </View>

        {trend.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Trend</Text>
            <View style={styles.card}>
              <BarChart
                data={chartData}
                width={SCREEN_W - Spacing.lg * 2 - 32}
                height={180}
                yAxisLabel="" yAxisSuffix=""
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
  safe: { flex: 1, backgroundColor: Colors.bg },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: Spacing.lg, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm },
  backBtn: { paddingVertical: 6, paddingHorizontal: 2 },
  backTxt: { fontSize: FontSize.base, color: Colors.primary, fontWeight: '600' },
  topActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border },
  deleteBtn: { borderColor: Colors.dangerLight },
  actionTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text2 },
  hero: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.lg,
    borderLeftWidth: 5, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md, ...Shadow.sm,
  },
  heroIcon: { width: 60, height: 60, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 28 },
  heroTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, letterSpacing: -0.4 },
  heroMeta: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4, flexWrap: 'wrap' },
  heroDesc: { fontSize: FontSize.xs, color: Colors.text3, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full, backgroundColor: Colors.bg },
  badgeTxt: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize', color: Colors.text2 },
  logBtn: { borderWidth: 2, borderRadius: Radius.sm, paddingVertical: 13, alignItems: 'center', marginBottom: Spacing.lg },
  logBtnTxt: { fontSize: FontSize.base, fontWeight: '700' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm },
  milestoneRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 4 },
  ms: { alignItems: 'center', padding: Spacing.sm, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.bg, opacity: 0.4, minWidth: 68 },
  msAchieved: { opacity: 1, backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  msIcon: { fontSize: 24, marginBottom: 3 },
  msLabel: { fontSize: 9, fontWeight: '700', color: Colors.text2, textAlign: 'center' },
  logRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  logRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  logDate: { flex: 2, fontSize: FontSize.sm, color: Colors.text2 },
  logValue: { flex: 1, fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  logNote: { flex: 2, fontSize: FontSize.xs, color: Colors.text3, textAlign: 'right' },
  empty: { fontSize: FontSize.sm, color: Colors.text3, padding: Spacing.md },
});
