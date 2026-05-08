import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { apiResetPassword } from '../api/client';
import { Colors, FontSize, Radius, Spacing } from '../theme';
import { AuthStackParamList } from '../types';
import PasswordInput from '../components/PasswordInput';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [email, setEmail] = useState(route.params?.email || '');
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || code.length !== 6 || newPw.length < 6) {
      Alert.alert('Missing info', 'Email, 6-digit code, and a password of at least 6 chars are required.');
      return;
    }
    setBusy(true);
    try {
      await apiResetPassword(email.trim(), code, newPw);
      Alert.alert('Password updated', 'You can now sign in with your new password.', [
        { text: 'Sign in', onPress: () => nav.navigate('Login') },
      ]);
    } catch (e: any) {
      Alert.alert('Reset failed', e.message || 'Invalid or expired code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>🌱 HabitFlow</Text>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.sub}>Enter the 6-digit code from your email and choose a new password.</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={Colors.text3}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>6-digit code</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={t => setCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
          placeholder="123456"
          placeholderTextColor={Colors.text3}
          keyboardType="numeric"
          maxLength={6}
        />

        <Text style={styles.label}>New password</Text>
        <PasswordInput value={newPw} onChangeText={setNewPw} placeholder="At least 6 characters" />

        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} disabled={busy}>
          {busy ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnPrimaryTxt}>Reset password</Text>}
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => nav.navigate('ForgotPassword')}>
            <Text style={styles.link}>Resend code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('Login')}>
            <Text style={styles.link}>← Back to sign in</Text>
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
  label: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text2, marginBottom: 6, marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, padding: Spacing.md, fontSize: FontSize.base, color: Colors.text },
  btnPrimary: { backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.xl },
  btnPrimaryTxt: { color: Colors.white, fontWeight: '700', fontSize: FontSize.base },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xl },
  link: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.sm },
});
