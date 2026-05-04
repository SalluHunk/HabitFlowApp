import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { Habit } from '../types';
import { CategoryColors, CategoryIcons, Colors, FontSize, Radius, Shadow, Spacing } from '../theme';

const CATEGORIES = [
  { key: 'general',     label: '✨ General' },
  { key: 'health',      label: '💊 Health' },
  { key: 'fitness',     label: '💪 Fitness' },
  { key: 'work',        label: '💼 Work' },
  { key: 'learning',    label: '📚 Learning' },
  { key: 'mindfulness', label: '🧘 Mindfulness' },
  { key: 'social',      label: '👥 Social' },
  { key: 'finance',     label: '💰 Finance' },
];

const FREQUENCIES = [
  { key: 'daily',   label: 'Daily' },
  { key: 'weekly',  label: 'Weekly' },
  { key: 'custom',  label: 'Custom' },
];

const COLORS = [
  '#6366f1','#10b981','#f59e0b','#ef4444',
  '#3b82f6','#8b5cf6','#ec4899','#14b8a6',
  '#f97316','#64748b',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string; description: string; category: string;
    frequency: string; target_value: number; unit: string;
    color: string; icon: string;
  }) => void;
  editHabit?: Habit | null;
}

export default function AddHabitModal({ visible, onClose, onSave, editHabit }: Props) {
  const [name, setName]         = useState('');
  const [desc, setDesc]         = useState('');
  const [category, setCategory] = useState('general');
  const [frequency, setFreq]    = useState('daily');
  const [target, setTarget]     = useState('1');
  const [unit, setUnit]         = useState('times');
  const [color, setColor]       = useState('#6366f1');
  const [icon, setIcon]         = useState('✨');

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name);
      setDesc(editHabit.description);
      setCategory(editHabit.category);
      setFreq(editHabit.frequency);
      setTarget(String(editHabit.target_value));
      setUnit(editHabit.unit);
      setColor(editHabit.color);
      setIcon(editHabit.icon);
    } else {
      resetForm();
    }
  }, [editHabit, visible]);

  function resetForm() {
    setName(''); setDesc(''); setCategory('general'); setFreq('daily');
    setTarget('1'); setUnit('times'); setColor('#6366f1'); setIcon('✨');
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    if (!editHabit) {
      setColor(CategoryColors[cat] ?? '#6366f1');
      setIcon(CategoryIcons[cat] ?? '✨');
    }
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(), description: desc, category,
      frequency, target_value: parseInt(target, 10) || 1,
      unit: unit || 'times', color, icon: icon || '✨',
    });
    resetForm();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editHabit ? '✏️  Edit Habit' : '🌱  New Habit'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Morning Run"
                placeholderTextColor={Colors.text3}
                autoFocus={!editHabit}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={desc}
                onChangeText={setDesc}
                placeholder="Optional…"
                placeholderTextColor={Colors.text3}
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pillRow}>
                  {CATEGORIES.map(c => (
                    <TouchableOpacity
                      key={c.key}
                      style={[styles.pill, category === c.key && { backgroundColor: color + '22', borderColor: color }]}
                      onPress={() => handleCategoryChange(c.key)}
                    >
                      <Text style={[styles.pillTxt, category === c.key && { color }]}>{c.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Frequency */}
            <View style={styles.field}>
              <Text style={styles.label}>Frequency</Text>
              <View style={styles.pillRow}>
                {FREQUENCIES.map(f => (
                  <TouchableOpacity
                    key={f.key}
                    style={[styles.pill, frequency === f.key && { backgroundColor: color + '22', borderColor: color }]}
                    onPress={() => setFreq(f.key)}
                  >
                    <Text style={[styles.pillTxt, frequency === f.key && { color }]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Target + Unit */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Target</Text>
                <TextInput
                  style={styles.input}
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="times"
                  placeholderTextColor={Colors.text3}
                />
              </View>
            </View>

            {/* Color */}
            <View style={styles.field}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorRow}>
                {COLORS.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorSwatch, { backgroundColor: c },
                      color === c && styles.colorSelected]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </View>

            {/* Icon */}
            <View style={styles.field}>
              <Text style={styles.label}>Icon (emoji)</Text>
              <TextInput
                style={[styles.input, styles.emojiInput]}
                value={icon}
                onChangeText={t => setIcon(t.slice(-2))}
                placeholder="✨"
                placeholderTextColor={Colors.text3}
              />
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: color }]}
              onPress={handleSave}
            >
              <Text style={styles.saveTxt}>
                {editHabit ? 'Save Changes' : 'Create Habit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '92%',
    ...Shadow.lg,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  closeBtn: { padding: 4 },
  closeTxt: { fontSize: FontSize.lg, color: Colors.text3 },
  body: { padding: Spacing.xl, paddingBottom: Spacing.sm },
  field: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm,
    padding: Spacing.sm + 2, fontSize: FontSize.base, color: Colors.text,
    backgroundColor: Colors.bg,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  pill: {
    paddingHorizontal: Spacing.sm + 2, paddingVertical: 6,
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  pillTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text2 },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  colorSwatch: { width: 34, height: 34, borderRadius: Radius.full },
  colorSelected: { borderWidth: 3, borderColor: Colors.text },
  emojiInput: { fontSize: 24, textAlign: 'center', paddingVertical: Spacing.sm },
  actions: {
    flexDirection: 'row', gap: Spacing.md,
    padding: Spacing.xl, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  cancelBtn: {
    flex: 1, padding: Spacing.md, borderRadius: Radius.sm,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  cancelTxt: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text2 },
  saveBtn: { flex: 2, padding: Spacing.md, borderRadius: Radius.sm, alignItems: 'center' },
  saveTxt: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
});
