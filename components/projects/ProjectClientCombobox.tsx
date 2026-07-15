"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Dummy data for clients
const CLIENTS = [
  {
    id: "cl_123",
    name: "Sarah Johnson",
    email: "sarah.j@microsoft.com",
    initials: "SJ",
  },
  {
    id: "cl_456",
    name: "Michael Chen",
    email: "m.chen@startup.io",
    initials: "MC",
  },
  {
    id: "cl_789",
    name: "Emily Davis",
    email: "emily@designco.net",
    initials: "ED",
  },
];

export function ProjectClientCombobox() {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="linkedClientId"
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-2">
          <FormLabel className="text-sm font-medium text-foreground">
            Linked Client
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            {/* @ts-expect-error type error in radux-ui */}
          <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between h-11 rounded-xl bg-background border border-input px-3",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? CLIENTS.find((client) => client.id === field.value)?.name ||
                      "Unknown Client"
                    : "Search by email or Client ID"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 rounded-xl" align="start">
              <Command>
                <CommandInput placeholder="Search existing clients..." />
                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {CLIENTS.map((client) => (
                      <CommandItem
                        value={`${client.name} ${client.email} ${client.id}`}
                        key={client.id}
                        onSelect={() => {
                          setValue("linkedClient", client.id);
                          setOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 cursor-pointer"
                      >
                        <Avatar className="size-8 ring-1 ring-border">
                          <AvatarFallback className="text-[10px] font-semibold">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-medium truncate">
                            {client.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {client.email} • {client.id}
                          </p>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-primary",
                            client.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground/80">
            Leave empty to keep this project as an offline project.
          </p>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
