import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiForgotPassword } from '../api/client';
import { Colors, FontSize, Radius, Spacing } from '../theme';
import { AuthStackParamList } from '../types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const nav = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Email required');
      return;
    }
    setBusy(true);
    try {
      await apiForgotPassword(email.trim());
      Alert.alert(
        'Check your email',
        'If an account exists for that email, a 6-digit code has been sent.',
        [{ text: 'Enter code', onPress: () => nav.navigate('ResetPassword', { email: email.trim() }) }],
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send reset code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>🌱 HabitFlow</Text>
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.sub}>Enter your email and we'll send you a 6-digit reset code.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={Colors.text3}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} disabled={busy}>
          {busy ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnPrimaryTxt}>Send reset code</Text>}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => nav.navigate('Login')}>
            <Text style={styles.link}>← Back to sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('ResetPassword', { email: email.trim() })}>
            <Text style={styles.link}>Already got a code →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.bg },
  body: { padding: Spacing.xl, paddingTop: 60 },
  brand: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: FontSize.sm, color: Colors.text2, marginBottom: Spacing.xl },
  label: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, padding: Spacing.md, fontSize: FontSize.base, color: Colors.text },
  btnPrimary: { backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.xl },
  btnPrimaryTxt: { color: Colors.white, fontWeight: '700', fontSize: FontSize.base },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xl },
  link: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.sm },
});
