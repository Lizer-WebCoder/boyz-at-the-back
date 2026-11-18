import { Stack } from 'expo-router';
import { colors } from '../../src/lib/theme';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.charcoal },
        headerTintColor: colors.orange,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.charcoal },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'The Yard' }} />
      <Stack.Screen name="channel/[id]" options={{ title: 'Cell Block' }} />
    </Stack>
  );
}
