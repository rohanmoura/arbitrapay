import { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Registration Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email to verify your account.');
    }
  }

  return (
    <View>
      <Text>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Creating account...' : 'Register'}
        onPress={handleRegister}
        disabled={loading}
      />
      <Button
        title="Already have an account? Login"
        onPress={() => router.push('/(auth)/login')}
      />
    </View>
  );
}
