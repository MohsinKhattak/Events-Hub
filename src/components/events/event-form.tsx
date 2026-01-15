"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, Plus, Trash2, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { SPORT_TYPES, type EventWithVenues, type SportType } from "@/types/database";
import { createEvent, updateEvent } from "@/lib/actions/events";

const venueSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().optional(),
});

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required").max(100),
  sportType: z.enum(SPORT_TYPES as unknown as [string, ...string[]]),
  dateTime: z.string().min(1, "Date and time is required"),
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, "At least one venue is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: EventWithVenues;
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!event;

  // Format the date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || "",
      sportType: event?.sport_type || "Soccer",
      dateTime: event?.date_time ? formatDateForInput(event.date_time) : "",
      description: event?.description || "",
      venues: event?.venues.length
        ? event.venues.map((v) => ({ name: v.name, address: v.address || "" }))
        : [{ name: "", address: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "venues",
  });

  async function onSubmit(values: EventFormValues) {
    startTransition(async () => {
      const input = {
        name: values.name,
        sportType: values.sportType as SportType,
        dateTime: new Date(values.dateTime).toISOString(),
        description: values.description,
        venues: values.venues.map((v) => ({
          name: v.name,
          address: v.address,
        })),
      };

      const result = isEditing
        ? await updateEvent({ ...input, id: event.id })
        : await createEvent(input);

      if (result.success) {
        toast.success(
          isEditing ? "Event updated successfully" : "Event created successfully"
        );
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Soccer Tournament" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="sportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPORT_TYPES.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="datetime-local"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Add details about the event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Venues</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", address: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Venue
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`venues.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Central Stadium" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`venues.${index}.address`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Address (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {form.formState.errors.venues?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.venues.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Event" : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
