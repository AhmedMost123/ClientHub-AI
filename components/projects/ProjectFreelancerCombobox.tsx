"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, X, MailPlus } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { searchProjectFreelancers } from "@/lib/actions/user/search-freelancers";
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

export function ProjectFreelancerCombobox() {
  const { control, setValue, watch } = useFormContext();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [freelancers, setFreelancers] = useState<any[]>([]);

  const freelancerEmail = watch("freelancerEmail");

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setFreelancers([]);
        return;
      }

      setLoading(true);

      const result = await searchProjectFreelancers(query);

      if (result.success) {
        setFreelancers(result.data);
      } else {
        setFreelancers([]);
      }

      setLoading(false);
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, open]);

  return (
    <FormField
      control={control}
      name="freelancerEmail"
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col space-y-2">
            <FormLabel>Freelancer Email (Optional)</FormLabel>

            <div className="flex items-center gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                  {/* @ts-expect-error type issue with PopoverTrigger */}
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-11 flex-1 justify-between rounded-xl overflow-hidden",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          <span className="truncate">{field.value}</span>
                        ) : (
                          "Search by email or name..."
                        )}

                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                <PopoverContent align="start" className="w-[420px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Type freelancer's email..."
                    value={query}
                    onValueChange={(val) => {
                      setQuery(val);
                      // Update the field value as they type if they want to invite someone not on the platform
                      setValue("freelancerEmail", val, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />

                  <CommandList>
                    {loading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="size-5 animate-spin" />
                      </div>
                    )}

                    {!loading && (
                      <>
                        <CommandEmpty>
                          No freelancer found. If the email is correct, we will send them an invite link.
                        </CommandEmpty>

                        <CommandGroup>
                          {freelancers.map((freelancer) => (
                            <CommandItem
                              key={freelancer.id}
                              value={freelancer.email}
                              onSelect={() => {
                                setValue("freelancerEmail", freelancer.email, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });

                                setOpen(false);
                              }}
                            >
                              <Avatar className="mr-3 size-8">
                                <AvatarFallback>
                                  {freelancer.name
                                    .split(" ")
                                    .map((x: string) => x[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {freelancer.name}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  {freelancer.email}
                                </span>
                              </div>

                              <Check
                                className={cn(
                                  "ml-auto size-4",
                                  freelancer.email === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.onChange("");
                  setQuery("");
                }}
              >
                <X className="size-5" />
              </Button>
            )}
            </div>

            <p className="text-xs text-muted-foreground">
              If they are already registered, they will be invited to this project.
            </p>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
