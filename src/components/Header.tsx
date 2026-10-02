import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useMotion } from '@/providers/MotionProvider';

interface HeaderProps {
  openCount: number;
  total: number;
}

export function Header({ openCount, total }: HeaderProps) {
  const { preference, reduced, active, setPreference } = useMotion();

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Punchlist
        </h1>
        <p className="text-sm text-muted-foreground">
          <span key={openCount} className="count tabular-nums">
            {openCount}
          </span>{' '}
          open · <span className="tabular-nums">{total}</span> total
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-3">
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
          className="font-mono text-[11px] text-muted-foreground"
        >
          {reduced
            ? 'reduced motion is on in your OS · everything is a cut'
            : active
              ? 'view transitions · @starting-style · flip · springs'
              : 'off · every change is a cut'}
        </p>
      </div>
    </header>
  );
}
