"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutGrid, Wrench, Briefcase, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

type SearchItem = {
  id: string;
  name: string;
  slug: string;
};

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [tools, setTools] = React.useState<SearchItem[]>([]);
  const [roles, setRoles] = React.useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (open && tools.length === 0 && roles.length === 0 && !isLoading) {
      const fetchSearchData = async () => {
        setIsLoading(true);
        try {
          const [toolsResponse, rolesResponse] = await Promise.all([
            supabase.from("tools").select("id, name, slug").order("name"),
            supabase.from("roles").select("id, name, slug").order("name"),
          ]);

          if (toolsResponse.data) setTools(toolsResponse.data);
          if (rolesResponse.data) setRoles(rolesResponse.data);
        } catch (error) {
          console.error("Error fetching search data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchData();
    }
  }, [open, tools.length, roles.length, isLoading, supabase]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start rounded-full border-border/50 bg-secondary/50 text-xs font-normal text-muted-foreground shadow-none transition-colors hover:bg-secondary/80 hover:text-foreground sm:pr-12 md:w-56 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-3.5 w-3.5" />
        <span className="hidden lg:inline-flex">Search tools or roles...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.2rem] top-[0.2rem] hidden h-6 select-none items-center gap-1 rounded-full border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-foreground opacity-100 sm:flex">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a tool name or role..."
          className="my-4"
        />
        <CommandList className="pb-2">
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>

          {roles.length > 0 && (
            <CommandGroup heading="Roles">
              {roles.map((role) => (
                <CommandItem
                  key={role.id}
                  value={`role-${role.name}`}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/dashboard?role=${role.slug}`),
                    )
                  }
                  className="cursor-pointer transition-transform duration-200 data-[selected=true]:scale-[1.02] data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{role.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {roles.length > 0 && tools.length > 0 && <CommandSeparator />}

          {tools.length > 0 && (
            <CommandGroup heading="Tools">
              {tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={`tool-${tool.name}`}
                  onSelect={() =>
                    runCommand(() =>
                      router.push(`/dashboard/tools/${tool.slug}`),
                    )
                  }
                  className="cursor-pointer transition-transform duration-200 data-[selected=true]:scale-[1.02] data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <Wrench className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{tool.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="cursor-pointer transition-transform duration-200 data-[selected=true]:scale-[1.02] data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
            >
              <LayoutGrid className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">
                Browse Full Directory
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
