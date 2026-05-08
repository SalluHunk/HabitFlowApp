import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../api/AuthContext';
import { Colors, FontSize, Radius, Spacing } from '../theme';
import { AuthStackParamList } from '../types';
import GoogleSignInButton from '../components/GoogleSignInButton';
import PasswordInput from '../components/PasswordInput';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const nav = useNavigation<Nav>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Email and password required.');
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Sign in failed', e.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>🌱 HabitFlow</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to track your habits.</Text>

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

        <Text style={styles.label}>Password</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
        />

        <TouchableOpacity onPress={() => nav.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={busy}>
          {busy
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.btnPrimaryTxt}>Sign in</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerTxt}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <GoogleSignInButton />

        <TouchableOpacity onPress={() => nav.navigate('Signup')}>
          <Text style={styles.foot}>
            No account? <Text style={styles.link}>Create one</Text>
          </Text>
        </TouchableOpacity>
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
  input: {
    backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.sm, padding: Spacing.md, fontSize: FontSize.base, color: Colors.text,
  },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: Spacing.md,
    alignItems: 'center', marginTop: Spacing.xl,
  },
  btnPrimaryTxt: { color: Colors.white, fontWeight: '700', fontSize: FontSize.base },
  foot: { textAlign: 'center', marginTop: Spacing.xl, color: Colors.text2, fontSize: FontSize.sm },
  link: { color: Colors.primary, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerTxt: { fontSize: FontSize.xs, color: Colors.text3, fontWeight: '600' },
  forgot: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600', marginTop: Spacing.sm, alignSelf: 'flex-end' },
});
