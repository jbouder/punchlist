import { AppShell } from '@/components/AppShell';
import { MotionProvider } from '@/providers/MotionProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import { TasksProvider } from '@/providers/TasksProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function App() {
  return (
    <MotionProvider>
      <ThemeProvider>
        <SettingsProvider>
          <TasksProvider>
            <AppShell />
          </TasksProvider>
        </SettingsProvider>
      </ThemeProvider>
    </MotionProvider>
  );
}
