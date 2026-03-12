import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useState } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function TestNotification() {
  const [status, setStatus] = useState('');

  async function sendNotification() {
    // 1. Check physical device
    if (!Device.isDevice) {
      setStatus('⚠️ Fonctionne uniquement sur un vrai appareil');
      return;
    }

    // 2. Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== 'granted') {
      setStatus('❌ Permission refusée');
      return;
    }

    // 3. Fire notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Notification Test',
        body: 'Les notifications fonctionnent parfaitement !',
        data: { test: true },
      },
      trigger: { seconds: 1 },
    });

    setStatus('✅ Notification envoyée !');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Notifications</Text>

      <TouchableOpacity style={styles.btn} onPress={sendNotification}>
        <Text style={styles.btnText}>🔔 Envoyer une notification</Text>
      </TouchableOpacity>

      {status ? (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title:     { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 32 },
  btn:       { backgroundColor: '#2563eb', paddingVertical: 16, paddingHorizontal: 36, borderRadius: 16, shadowColor: '#2563eb', shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  btnText:   { color: '#fff', fontSize: 16, fontWeight: '700' },
  statusBox: { marginTop: 24, backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  statusText:{ fontSize: 14, color: '#0f172a', fontWeight: '600' },
});