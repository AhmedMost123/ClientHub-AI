"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, X, UserPlus } from "lucide-react";
import { useFormContext } from "react-hook-form";

// Make sure to add getClient to your imports from the actions file
import type { ClientSearchResult } from "@/types/client";
import { searchProjectClients } from "@/lib/actions/user/search-clients";
import { getClient } from "@/lib/actions/user/get-client";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProjectClientCombobox() {
  const { control, setValue, watch } = useFormContext();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientSearchResult[]>([]);

  // Watch the form value at the component level to trigger the useEffect properly
  const linkedClientId = watch("linkedClientId");

  // Fix 1 & Fix 4: Store the fetched client based on field value changes
  const [selected, setSelected] = useState<ClientSearchResult | null>(null);

  useEffect(() => {
    if (!linkedClientId) {
      return;
    }

    let isMounted = true;
    getClient(linkedClientId).then((result) => {
      if (isMounted && result.success) {
        setSelected(result.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [linkedClientId]);

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setClients([]);
        return;
      }

      setLoading(true);

      const result = await searchProjectClients(query);

      if (result.success) {
        setClients(result.data);
      } else {
        setClients([]);
      }

      setLoading(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, open]);

  return (
    <FormField
      control={control}
      name="linkedClientId"
      render={({ field }) => {
        // Fix 2: Check if it's in the current search array, if not, fallback to the fetched 'selected' state
        const listSelected =
          clients.find((client) => client.id === field.value) ?? null;

        const displayClient = !field.value 
          ? null 
          : (listSelected ?? (selected?.id === field.value ? selected : null));

        return (
          <FormItem className="flex flex-col space-y-2">
            <FormLabel>Linked Client</FormLabel>

            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                  <FormControl>
                    {/* @ts-expect-error PopoverTrigger types are conflicting */}
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-11 flex-1 justify-between rounded-xl overflow-hidden",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {displayClient ? (
                          <span className="truncate">
                            {displayClient.name} ({displayClient.email})
                          </span>
                        ) : (
                          "Search client by email..."
                        )}

                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </FormControl>

                <PopoverContent align="start" className="w-[420px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Type client's email..."
                    value={query}
                    onValueChange={setQuery}
                  />

                  <CommandList>
                    {loading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="size-5 animate-spin" />
                      </div>
                    )}

                    {!loading && (
                      <>
                        <CommandEmpty>No clients found.</CommandEmpty>

                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.id}
                              onSelect={() => {
                                setValue("linkedClientId", client.id, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });

                                setSelected(client);
                                setOpen(false);
                              }}
                            >
                              <Avatar className="mr-3 size-8">
                                <AvatarFallback>
                                  {client.name
                                    .split(" ")
                                    .map((x) => x[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {client.name}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  {client.email}
                                </span>
                              </div>

                              <Check
                                className={cn(
                                  "ml-auto size-4",
                                  client.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}

                          {!loading && query.trim() && clients.length === 0 && (
                            <CommandItem disabled className="gap-3 opacity-80">
                              <UserPlus className="size-4" />

                              <div className="flex flex-col">
                                <span>No client found</span>

                                <span className="text-xs text-muted-foreground">
                                  You&apos;ll be able to invite this email in
                                  the next step.
                                </span>
                              </div>
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {displayClient && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.onChange(null);
                  setSelected(null);
                  setClients([]);
                  setQuery("");
                }}
              >
                <X className="size-5" />
              </Button>
            )}
            </div>

            <p className="text-xs text-muted-foreground">
              Leave empty to create an offline project.
            </p>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
