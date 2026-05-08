import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  SafeAreaView, RefreshControl, StatusBar, ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, HabitWithStatus } from '../types';
import { apiListHabits, apiCreateHabit, apiToggleLog, apiAnalytics } from '../api/client';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../theme';
import HabitCard from '../components/HabitCard';
import StatCard from '../components/StatCard';
import CompletionRing from '../components/CompletionRing';
import AddHabitModal from '../components/AddHabitModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning 👋';
  if (h < 17) return 'Good afternoon 👋';
  return 'Good evening 👋';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const [habits, setHabits]         = useState<HabitWithStatus[]>([]);
  const [stats, setStats]           = useState<any>({ total_habits: 0, completed_today: 0, completion_rate: 0, best_streak: 0, total_logs: 0 });
  const [modalVisible, setModal]    = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    try {
      const [h, a] = await Promise.all([apiListHabits(), apiAnalytics()]);
      setHabits(h.habits);
      setStats(a.stats);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleLog = useCallback(async (id: number) => {
    try {
      await apiToggleLog(id);
      await load();
    } catch (e: any) {
      console.error(e);
    }
  }, [load]);

  const handleCreate = useCallback(async (data: any) => {
    try {
      await apiCreateHabit(data);
      await load();
    } catch (e: any) {
      console.error(e);
    }
  }, [load]);

  const today = formatDate(new Date());

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <FlatList
        data={habits}
        keyExtractor={h => String(h.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.title}>Today's Habits</Text>
                <Text style={styles.date}>{today}</Text>
              </View>
              <CompletionRing pct={stats.completion_rate} />
            </View>

            <View style={styles.statsRow}>
              <StatCard
                value={`${stats.completed_today}/${stats.total_habits}`}
                label="Completed" icon="✅" iconColor={Colors.primary}
              />
              <StatCard value={stats.best_streak} label="Best Streak" icon="🔥" iconColor={Colors.warning} />
              <StatCard value={stats.total_logs} label="Total Logs" icon="📅" iconColor={Colors.success} />
            </View>

            {habits.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🌱</Text>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptyText}>Start building better habits today.</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => setModal(true)}>
                  <Text style={styles.emptyBtnTxt}>+ Add First Habit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onLog={handleLog}
            onPress={id => navigation.navigate('HabitDetail', { habitId: id })}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModal(true)} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModal(false)}
        onSave={handleCreate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.xl },
  greeting: { fontSize: FontSize.sm, color: Colors.text2, marginBottom: 2 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  date: { fontSize: FontSize.xs, color: Colors.text3, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl, flexWrap: 'wrap' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptyText: { fontSize: FontSize.sm, color: Colors.text3, marginBottom: 24 },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full },
  emptyBtnTxt: { color: Colors.white, fontWeight: '700', fontSize: FontSize.base },
  fab: {
    position: 'absolute', right: 20, bottom: 28, width: 58, height: 58, borderRadius: 29,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.lg,
  },
  fabIcon: { fontSize: 28, color: Colors.white, lineHeight: 32, fontWeight: '300' },
});
