import {
  ChartBarIcon,
  GearSixIcon,
  type Icon,
  ListChecksIcon,
  MoonIcon,
  SunIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import type { MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { href, navigate, type Path, useRoute } from '@/lib/router';
import { cn } from '@/lib/utils';
import { useMotion } from '@/providers/MotionProvider';
import { useSettings } from '@/providers/SettingsProvider';
import { useTasks } from '@/providers/TasksProvider';
import { useTheme } from '@/providers/ThemeProvider';

interface NavItem {
  path: Path;
  label: string;
  icon: Icon;
}

const NAV: NavItem[] = [
  { path: '/', label: 'Tasks', icon: ListChecksIcon },
  { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
  { path: '/team', label: 'Team', icon: UsersThreeIcon },
  { path: '/admin', label: 'Admin', icon: GearSixIcon },
];

/**
 * Left rail on desktop, top bar on phones. The active link carries
 * `view-transition-name: nav-active` during a page transition, so the pill
 * slides from the old item to the new one, label and all. (Naming only the
 * background would paint it above the label mid-transition.)
 */
export function Sidebar() {
  const route = useRoute();
  const { settings } = useSettings();
  const { tasks } = useTasks();
  const openCount = tasks.filter((t) => t.status === 'open').length;

  function onNavClick(event: MouseEvent<HTMLAnchorElement>, path: Path) {
    // Leave modified clicks alone so "open in new tab" keeps working.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    navigate(path);
  }

  return (
    <aside
      className={cn(
        'sidebar flex items-center gap-3 border-b bg-sidebar px-3 py-2 text-sidebar-foreground',
        'md:h-dvh md:flex-col md:items-stretch md:gap-6 md:border-r md:border-b-0 md:px-3 md:py-4',
      )}
    >
      <a
        href={href('/')}
        onClick={(e) => onNavClick(e, '/')}
        className="flex shrink-0 items-center gap-2.5 md:px-2"
      >
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground"
        >
          P
        </span>
        <span className="hidden min-w-0 flex-col sm:flex">
          <span className="truncate font-heading text-sm font-semibold leading-tight">
            {settings.workspace || 'Punchlist'}
          </span>
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            punchlist
          </span>
        </span>
      </a>

      <nav
        aria-label="Pages"
        className="min-w-0 flex-1 overflow-x-auto md:flex-none md:overflow-visible"
      >
        <ul className="flex items-center gap-1 md:flex-col md:items-stretch">
          {NAV.map(({ path, label, icon: IconComponent }) => {
            const active = route === path;
            return (
              <li key={path} className="shrink-0">
                <a
                  href={href(path)}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => onNavClick(e, path)}
                  className={cn(
                    'relative flex items-center gap-2.5 px-2.5 py-1.5 text-sm font-medium outline-none',
                    'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
                    'focus-visible:ring-1 focus-visible:ring-ring',
                    active
                      ? 'nav-active text-sidebar-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-sidebar-accent ring-1 ring-foreground/10"
                    />
                  )}
                  <IconComponent
                    className="relative size-4 shrink-0"
                    weight={active ? 'fill' : 'regular'}
                  />
                  <span className="relative hidden sm:inline">{label}</span>
                  {path === '/' && openCount > 0 && (
                    <span
                      key={openCount}
                      className="count relative ml-auto font-mono text-[11px] text-muted-foreground tabular-nums"
                    >
                      {openCount}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-3 md:mt-auto md:flex-col md:items-stretch md:gap-3 md:border-t md:px-2 md:pt-4">
        <ThemeToggle />
        <MotionSwitch />
      </div>
    </aside>
  );
}

function MotionSwitch() {
  const { preference, reduced, active, setPreference } = useMotion();

  return (
    <div className="flex flex-col items-end gap-1.5 md:items-stretch">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="motion-switch" className="text-sm">
          Motion
        </Label>
        <Switch
          id="motion-switch"
          checked={preference}
          disabled={reduced}
          onCheckedChange={(checked) => setPreference(checked)}
          aria-describedby="motion-status"
        />
      </div>
      <p
        id="motion-status"
        className="hidden font-mono text-[11px] leading-snug text-muted-foreground md:block"
      >
        {reduced
          ? 'reduced motion is on in your OS · everything is a cut'
          : active
            ? 'view transitions · @starting-style · flip · springs · scroll-driven'
            : 'off · every change is a cut'}
      </p>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const IconComponent = dark ? MoonIcon : SunIcon;

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="hidden text-sm md:inline">Theme</span>
      <Button
        variant="outline"
        size="icon-sm"
        className="press"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={dark}
        // The circle grows from this button.
        onClick={(event) => toggle(event.currentTarget)}
      >
        <IconComponent
          key={theme}
          weight="fill"
          className="theme-icon size-4"
        />
      </Button>
    </div>
  );
}
