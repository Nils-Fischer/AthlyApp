//app\(tabs)\dashboard\active-workout\_layout.tsx
import { Stack } from 'expo-router';

export default function DashboardLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        presentation: 'modal'
      }}
    >
      <Stack.Screen 
        name="active-workout/[id]"
      />
    </Stack>
  );
}