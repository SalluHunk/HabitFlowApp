import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { getAllHabits, getLogsForHabit, getAllLogs } from '../database/db';
import {
  getDashboardStats, getWeeklyActivity, getCategoryBreakdown,
  getTopHabits, getAnnualHeatmap,
} from '../utils/analytics';
import {
  Colors, FontSize, Radius, Shadow, Spacing,
  CategoryColors, CategoryBadgeColors,
} from '../theme';
import StatCard from '../components/StatCard';
import HeatmapGrid from '../components/HeatmapGrid';
import { RootStackParamList } from '../types';

const SCREEN_W = Dimensions.get('window').width;
type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const CAT_PALETTE: Record<string, string> = {
  general: '#94a3b8', health: '#10b981', fitness: '#f59e0b',
  work: '#6366f1', learning: '#3b82f6', mindfulness: '#8b5cf6',
  social: '#ec4899', finance: '#14b8a6',
};

export default function AnalyticsScreen() {
  const nav = useNavigation<Nav>();
  const [stats, setStats]     = useState<any>(null);
  const [weekly, setWeekly]   = useState<any[]>([]);
  const [catData, setCatData] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);

  const load = useCallback(() => {
    const habits  = getAllHabits();
    const allLogs = getAllLogs();
    const logMap  = new Map(habits.map(h => [h.id, getLogsForHabit(h.id)]));

    setStats(getDashboardStats(habits, logMap));
    setWeekly(getWeeklyActivity(allLogs));
    setLeaders(getTopHabits(habits, logMap));
    setHeatmap(getAnnualHeatmap(allLogs, 52));

    const breakdown = getCategoryBreakdown(habits);
    setCatData(
      Object.entries(breakdown).map(([k, v]) => ({
        name: k,
        population: v as number,
        color: CAT_PALETTE[k] ?? '#94a3b8',
        legendFontColor: Colors.text2,
        legendFontSize: 12,
      }))
    );
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!stats) return null;

  const weekLabels  = weekly.map(d => d.label);
  const weekCounts  = weekly.map(d => d.count);
  const maxWeek     = Math.max(1, ...weekCounts);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Page title */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Insights 📊</Text>
          <Text style={styles.title}>Analytics</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard value={stats.total_habits}    label="Active"      icon="🌱" iconColor={Colors.success} />
          <StatCard value={stats.best_streak}     label="Best Streak" icon="🔥" iconColor={Colors.warning} />
          <StatCard value={stats.total_logs}      label="Total Logs"  icon="⚡" iconColor={Colors.primary} />
          <StatCard value={`${stats.completion_rate}%`} label="Today" icon="%" iconColor="#ec4899" />
        </View>

        {/* Annual heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Year Activity</Text>
          <View style={styles.card}>
            <HeatmapGrid cells={heatmap} color={Colors.success} cellSize={11} gap={2} />
            <View style={styles.legend}>
              <Text style={styles.legendTxt}>Less</Text>
              {['#e2e8f0','#a7f3d0','#34d399','#059669'].map(c => (
                <View key={c} style={[styles.lc, { backgroundColor: c }]} />
              ))}
              <Text style={styles.legendTxt}>More</Text>
            </View>
          </View>
        </View>

        {/* Weekly chart */}
        {weekly.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.card}>
              <BarChart
                data={{ labels: weekLabels, datasets: [{ data: weekCounts }] }}
                width={SCREEN_W - Spacing.lg * 2 - 32}
                height={180}
                yAxisLabel="" yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: Colors.card,
                  backgroundGradientTo: Colors.card,
                  decimalPlaces: 0,
                  color: (op = 1) => `rgba(99,102,241,${0.25 + op * 0.75})`,
                  labelColor: () => Colors.text3,
                  barPercentage: 0.65,
                  propsForBackgroundLines: { stroke: Colors.border },
                }}
                style={{ borderRadius: Radius.md }}
                fromZero
                showValuesOnTopOfBars
              />
            </View>
          </View>
        )}

        {/* Category donut */}
        {catData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Category</Text>
            <View style={styles.card}>
              <PieChart
                data={catData}
                width={SCREEN_W - Spacing.lg * 2 - 32}
                height={180}
                chartConfig={{
                  color: (op = 1) => `rgba(0,0,0,${op})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="12"
                absolute
              />
            </View>
          </View>
        )}

        {/* Leaderboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Leaderboard</Text>
          {leaders.length === 0 ? (
            <Text style={styles.empty}>No habits yet.</Text>
          ) : (
            leaders.map((h, i) => {
              const badge = CategoryBadgeColors[h.category] ?? CategoryBadgeColors.general;
              return (
                <TouchableOpacity
                  key={h.id}
                  style={styles.leaderRow}
                  onPress={() => nav.navigate('HabitDetail', { habitId: h.id })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.rank}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </Text>
                  <Text style={styles.leaderIcon}>{h.icon}</Text>
                  <View style={styles.leaderInfo}>
                    <Text style={styles.leaderName} numberOfLines={1}>{h.name}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeTxt, { color: badge.text }]}>{h.category}</Text>
                    </View>
                  </View>
                  <View style={styles.leaderStats}>
                    <Text style={styles.leaderStreak}>{h.current_streak} 🔥</Text>
                    <Text style={styles.leaderSub}>Best: {h.best_streak}</Text>
                    <Text style={styles.leaderSub}>{h.total_completions} days</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  body:  { padding: Spacing.lg, paddingBottom: 40 },
  header: { marginBottom: Spacing.xl },
  subtitle: { fontSize: FontSize.sm, color: Colors.text2 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  section:  { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  legend:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  legendTxt: { fontSize: FontSize.xs, color: Colors.text3 },
  lc:        { width: 12, height: 12, borderRadius: 3 },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  rank: { fontSize: 18, minWidth: 26, textAlign: 'center' },
  leaderIcon: { fontSize: 20 },
  leaderInfo: { flex: 1, gap: 3 },
  leaderName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 2, borderRadius: Radius.full },
  badgeTxt: { fontSize: FontSize.xs, fontWeight: '700', textTransform: 'capitalize' },
  leaderStats: { alignItems: 'flex-end', gap: 2 },
  leaderStreak: { fontSize: FontSize.base, fontWeight: '800', color: '#d97706' },
  leaderSub:  { fontSize: FontSize.xs, color: Colors.text3 },
  empty:      { fontSize: FontSize.sm, color: Colors.text3 },
});
