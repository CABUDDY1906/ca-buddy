import { Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function GlobalSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative flex items-center rounded-lg border bg-neutral-50 px-3 py-2 transition-all duration-200',
        isFocused
          ? 'border-accent-500 ring-2 ring-accent-500/20'
          : 'border-neutral-200'
      )}
    >
      <Search className="mr-2 h-4 w-4 text-neutral-400" />
      <input
        type="text"
        placeholder="Search clients, tasks, invoices..."
        className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <kbd className="ml-2 hidden rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-medium text-neutral-500 sm:inline-block">
        ⌘K
      </kbd>
    </div>
  );
}
