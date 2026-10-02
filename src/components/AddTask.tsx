import { PlusIcon } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTaskProps {
  onAdd: (title: string) => void;
}

export function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setTitle('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        id="new-task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task and press Enter"
        aria-label="New task title"
        className="flex-1"
      />
      <Button type="submit" className="press" disabled={!title.trim()}>
        <PlusIcon weight="bold" />
        Add
      </Button>
    </form>
  );
}
