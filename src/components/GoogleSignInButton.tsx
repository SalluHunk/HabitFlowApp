import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../api/AuthContext';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '../config';
import { Colors, FontSize, Radius, Spacing } from '../theme';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = React.useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        setBusy(true);
        try {
          const idToken = response.params?.id_token || response.authentication?.idToken;
          if (!idToken) {
            Alert.alert('Sign-in failed', 'No ID token returned from Google.');
            return;
          }
          await loginWithGoogle(idToken);
        } catch (e: any) {
          Alert.alert('Sign-in failed', e.message || 'Could not verify Google account.');
        } finally {
          setBusy(false);
        }
      } else if (response?.type === 'error') {
        Alert.alert('Sign-in cancelled', response.error?.message || 'Try again.');
      }
    })();
  }, [response, loginWithGoogle]);

  const handlePress = async () => {
    setBusy(true);
    try {
      await promptAsync();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not start Google sign-in.');
    } finally {
      // setBusy is unset by the response useEffect on success.
      // For cancel/error, reset here:
      setTimeout(() => setBusy(false), 500);
    }
  };

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={handlePress}
      disabled={!request || busy}
      activeOpacity={0.8}
    >
      {busy ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <>
          <Text style={styles.icon}>G</Text>
          <Text style={styles.txt}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  icon: {
    fontSize: 20, fontWeight: '900',
    color: '#4285F4', // Google blue
    fontFamily: 'serif',
  },
  txt: {
    fontSize: FontSize.base, fontWeight: '700', color: Colors.text,
  },
});
