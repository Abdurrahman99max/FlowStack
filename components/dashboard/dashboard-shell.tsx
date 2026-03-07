"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Bookmark,
  Menu,
  X,
  LogOut,
  Search,
  Wrench,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface DashboardShellProps {
  user: {
    id: string;
    email: string;
    displayName: string;
    roleName: string;
    roleSlug: string;
  };
  children: React.ReactNode;
}

const navItems = [
  { label: "Explore Tools", href: "/dashboard", icon: LayoutGrid },
  { label: "My Stack", href: "/dashboard/bookmarks", icon: Bookmark },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [tools, setTools] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/dashboard/bookmarks");
    router.prefetch("/dashboard/profile");
  }, [router]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (searchOpen && tools.length === 0 && !isSearchLoading) {
      const fetchTools = async () => {
        setIsSearchLoading(true);
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("tools")
            .select("id, name, slug")
            .order("name");

          if (data) setTools(data);
        } catch (error) {
          console.error("Error fetching tools:", error);
        } finally {
          setIsSearchLoading(false);
        }
      };

      fetchTools();
    }
  }, [searchOpen, tools.length, isSearchLoading]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={`relative hidden shrink-0 border-r border-border bg-card transition-all duration-300 ease-in-out lg:flex lg:flex-col h-full ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        <div
          className={`flex h-16 shrink-0 items-center border-b border-border transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : "px-6"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <Image
                src="/images/logo.png"
                alt="FlowStack"
                width={28}
                height={28}
              />
            </div>
            {!isCollapsed && (
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                FlowStack
              </span>
            )}
          </Link>
        </div>

        <Link
          href="/dashboard/profile"
          className={`shrink-0 pb-2 pt-6 transition-all duration-300 ${
            isCollapsed ? "px-2" : "px-4"
          }`}
        >
          <div
            className={`flex items-center rounded-xl p-3 transition-colors hover:bg-secondary/50 ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.roleName}
                </p>
              </div>
            )}
          </div>
        </Link>

        <nav
          className={`flex flex-1 flex-col gap-1 overflow-y-auto py-2 transition-all duration-300 ${
            isCollapsed ? "px-2" : "px-3"
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={`mt-auto shrink-0 border-t border-border py-4 transition-all duration-300 ${
            isCollapsed ? "flex justify-center px-2" : "px-4"
          }`}
        >
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "sm"}
            title={isCollapsed ? "Sign out" : undefined}
            className={`text-muted-foreground hover:bg-destructive/10 hover:text-destructive ${
              isCollapsed
                ? "h-10 w-10 rounded-xl"
                : "w-full justify-start gap-2"
            }`}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
              <Image
                src="/images/logo.png"
                alt="FlowStack"
                width={28}
                height={28}
              />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              FlowStack
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary"
              aria-label="Search tools"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 text-foreground transition-colors hover:bg-secondary"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 shrink-0 border-b border-border bg-card p-4 shadow-md duration-200 lg:hidden">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.displayName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.roleName}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-border pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search tools by name..." className="my-4" />
        <CommandList className="pb-2">
          <CommandEmpty>
            {isSearchLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              "No tools found."
            )}
          </CommandEmpty>

          {tools.length > 0 && (
            <CommandGroup heading="Tools">
              {tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={`tool-${tool.name}`}
                  onSelect={() => {
                    setSearchOpen(false);
                    router.push(`/dashboard/tools/${tool.slug}`);
                  }}
                  className="cursor-pointer transition-transform duration-200 data-[selected=true]:scale-[1.02] data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{tool.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
