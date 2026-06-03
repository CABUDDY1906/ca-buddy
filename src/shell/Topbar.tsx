import { Menu, MessageCircle } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsBell } from './NotificationsBell';
import { ProfileMenu } from './ProfileMenu';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden w-80 sm:block">
          <GlobalSearch />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* WhatsApp quick action */}
        <button
          type="button"
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-5 w-5" />
        </button>

        <NotificationsBell />

        <div className="mx-2 h-6 w-px bg-neutral-200" />

        <ProfileMenu />
      </div>
    </header>
  );
}
