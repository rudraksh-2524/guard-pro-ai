import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  FileText,
  FlaskConical,
  HelpCircle,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  PlayCircle,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const icons = {
  layout: LayoutDashboard,
  list: ListChecks,
  play: PlayCircle,
  history: History,
  user: User,
  activity: Activity,
  users: Users,
  file: FileText,
  help: HelpCircle,
  image: ImageIcon,
  chart: BarChart3,
  flask: FlaskConical,
  settings: Settings,
} as const;

export interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: keyof typeof icons;
}

export function AppShell({
  nav,
  roleLabel,
  children,
  mobileNavCount = 4,
}: {
  nav: readonly NavItem[];
  roleLabel: string;
  children: ReactNode;
  mobileNavCount?: number;
}) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    void navigate({ to: "/login", replace: true });
  }

  const name = session ? session.user.full_name : "Guest";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link to="/" aria-label="Proctor Guard AI home">
            <Logo />
          </Link>
        </div>
        <p className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {roleLabel}
        </p>
        <nav className="flex-1 space-y-0.5 px-2" aria-label={`${roleLabel} navigation`}>
          {nav.map((item) => (
            <SideLink key={item.to} item={item} active={pathname.startsWith(item.to)} />
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded bg-secondary text-xs font-semibold text-foreground">
              {initials(name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-foreground">{name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {session ? session.user.email : ""}
              </span>
            </span>
          </div>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 lg:hidden">
        <Link to="/" aria-label="Proctor Guard AI home">
          <Logo />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto border-b border-border bg-sidebar p-3 lg:hidden">
          <nav className="space-y-0.5" aria-label={`${roleLabel} navigation`}>
            {nav.map((item) => (
              <SideLink
                key={item.to}
                item={item}
                active={pathname.startsWith(item.to)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
          </Button>
        </div>
      )}

      <main className="pb-20 lg:pb-0 lg:pl-60">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6">{children}</div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-border bg-sidebar lg:hidden"
        style={{ gridTemplateColumns: `repeat(${mobileNavCount}, minmax(0, 1fr))` }}
        aria-label="Primary"
      >
        {nav.slice(0, mobileNavCount).map((item) => {
          const Icon = icons[item.icon];
          const active = pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[10px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SideLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = icons[item.icon];
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
      {active && <span className="ml-auto h-4 w-0.5 rounded-full bg-primary" aria-hidden="true" />}
    </Link>
  );
}