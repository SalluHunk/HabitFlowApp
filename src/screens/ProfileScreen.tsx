import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Colors, FontSize, Radius, Shadow, Spacing } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert('Sign out?', 'You will need to sign in again next time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Account</Text>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.card}>
        {user.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarTxt}>{user.name[0]?.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutTxt}>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg, padding: Spacing.lg },
  header: { marginBottom: Spacing.xl },
  subtitle: { fontSize: FontSize.sm, color: Colors.text2 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.xl,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg, ...Shadow.sm,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, marginBottom: Spacing.md,
  },
  avatarFallback: {
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { fontSize: 32, fontWeight: '800', color: Colors.white },
  name: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  email: { fontSize: FontSize.sm, color: Colors.text2, marginTop: 4 },
  logoutBtn: {
    backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
    padding: Spacing.md, borderRadius: Radius.sm, alignItems: 'center',
  },
  logoutTxt: { color: Colors.danger, fontWeight: '700', fontSize: FontSize.base },
});
