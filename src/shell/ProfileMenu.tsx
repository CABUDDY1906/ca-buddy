import { ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-neutral-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
          CA
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium text-neutral-800">Admin</p>
          <p className="text-xs text-neutral-500">CA Firm</p>
        </div>
        <ChevronDown className={cn(
          'hidden h-4 w-4 text-neutral-400 transition-transform sm:block',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-dropdown">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="my-1 border-t border-neutral-200" />
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-neutral-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
