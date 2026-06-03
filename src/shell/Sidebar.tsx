import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  CheckSquare,
  FolderTree,
  Receipt,
  FileText,
  Calculator,
  ClipboardCheck,
  Bell,
  MessageCircle,
  Megaphone,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { SidebarItem } from './SidebarItem';

interface NavItem {
  icon: LucideIcon;
  label: string;
  route: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', route: ROUTES.DASHBOARD },
  { icon: Users, label: 'Clients', route: ROUTES.CLIENTS },
  { icon: UserCog, label: 'Staff', route: ROUTES.STAFF },
  { icon: CheckSquare, label: 'Tasks', route: ROUTES.TASKS },
  { icon: FolderTree, label: 'Files', route: ROUTES.FILES },
  { icon: Receipt, label: 'Service Requests', route: ROUTES.SERVICE_REQUESTS },
  { icon: FileText, label: 'Invoices', route: ROUTES.INVOICES },
  { icon: Calculator, label: 'GST Filing', route: ROUTES.GST },
  { icon: ClipboardCheck, label: 'Audits', route: ROUTES.AUDITS },
  { icon: Bell, label: 'Reminders', route: ROUTES.REMINDERS },
  { icon: MessageCircle, label: 'WhatsApp', route: ROUTES.WHATSAPP },
  { icon: Megaphone, label: 'Bulletin', route: ROUTES.BULLETIN },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', route: ROUTES.SETTINGS },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary-700 transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-primary-600 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 font-bold text-white text-sm">
            CA
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            CA BUDDY
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <SidebarItem
                key={item.route}
                icon={item.icon}
                label={item.label}
                route={item.route}
                onClick={onClose}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-primary-600 px-3 py-4">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => (
              <SidebarItem
                key={item.route}
                icon={item.icon}
                label={item.label}
                route={item.route}
                onClick={onClose}
              />
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
