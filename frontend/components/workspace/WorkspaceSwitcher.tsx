"use client";

import { Fragment, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useWorkspace } from '@/lib/hooks/use-workspace'; // Assuming this hook exists
import { Workspace } from '@/lib/types/workspace'; // Assuming this type exists
import { LayoutDashboard } from 'lucide-react'; // Example icon, replace as needed

interface WorkspaceSwitcherProps {
  isSidebarOpen: boolean;
}

export function WorkspaceSwitcher({ isSidebarOpen }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { currentWorkspace, workspaces, isLoading, selectWorkspace } = useWorkspace(); // Hook to manage workspace state

  const formattedWorkspaces = workspaces.map((workspace) => ({
    label: workspace.name,
    value: workspace.id,
  }));

  const onWorkspaceSelect = (workspaceId: string) => {
    const selected = workspaces.find((w) => w.id === workspaceId);
    if (selected) {
      selectWorkspace(selected);
    }
    setOpen(false);
    // Optionally redirect or re-fetch data based on new workspace
    // For now, just ensure the current path remains relevant (e.g., /dashboard, /tasks, etc.)
    router.push(pathname); 
  };

  if (isLoading) {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-label="Select a workspace"
        className={cn(
          "w-full justify-between transition-all duration-300",
          isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 pointer-events-none"
        )}
        disabled
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Loading Workspaces...
        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a workspace"
          className={cn(
            "w-full justify-between transition-all duration-300",
            isSidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0 pointer-events-none"
          )}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          {(isSidebarOpen || !isSidebarOpen) && ( // Always show selected workspace name if sidebar is open
            <span className="truncate">
              {currentWorkspace ? currentWorkspace.name : "Select Workspace"}
            </span>
          )}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search workspace..." />
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup heading="Workspaces">
              {formattedWorkspaces.map((workspace) => (
                <CommandItem
                  key={workspace.value}
                  onSelect={() => onWorkspaceSelect(workspace.value)}
                  className="text-sm"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {workspace.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentWorkspace?.id === workspace.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push("/dashboard/workspaces/create"); // Navigate to workspace creation page
                }}
              >
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Create New Workspace
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

