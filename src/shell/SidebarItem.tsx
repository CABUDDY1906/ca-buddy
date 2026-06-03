import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  route: string;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, route, onClick }: SidebarItemProps) {
  return (
    <li>
      <NavLink
        to={route}
        end={route === '/'}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
            isActive
              ? 'border-l-4 border-accent-500 bg-primary-800 text-white'
              : 'border-l-4 border-transparent text-neutral-200 hover:bg-primary-800 hover:text-white'
          )
        }
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate">{label}</span>
      </NavLink>
    </li>
  );
}
