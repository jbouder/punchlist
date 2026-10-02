import { AppShell } from '@/components/AppShell';
import { MotionProvider } from '@/providers/MotionProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import { TasksProvider } from '@/providers/TasksProvider';

export default function App() {
  return (
    <MotionProvider>
      <SettingsProvider>
        <TasksProvider>
          <AppShell />
        </TasksProvider>
      </SettingsProvider>
    </MotionProvider>
  );
}
