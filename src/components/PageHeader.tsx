import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </header>
  );
}
