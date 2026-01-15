"use server";

import { safeAction, requireAuth, type ActionResponse } from "./index";
import type {
  EventWithVenues,
  SportType,
  VenueInsert,
} from "@/types/database";
import { revalidatePath } from "next/cache";

export interface CreateEventInput {
  name: string;
  sportType: SportType;
  dateTime: string;
  description?: string;
  venues: { name: string; address?: string }[];
}

export interface UpdateEventInput extends CreateEventInput {
  id: string;
}

export interface EventFilters {
  search?: string;
  sportType?: SportType | "all";
}

export async function getEvents(
  filters?: EventFilters
): Promise<ActionResponse<EventWithVenues[]>> {
  return safeAction(async () => {
    const { user, supabase } = await requireAuth();

    let query = supabase
      .from("events")
      .select("*, venues(*)")
      .eq("user_id", user.id)
      .order("date_time", { ascending: true });

    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters?.sportType && filters.sportType !== "all") {
      query = query.eq("sport_type", filters.sportType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as EventWithVenues[];
  });
}

export async function getEvent(
  id: string
): Promise<ActionResponse<EventWithVenues>> {
  return safeAction(async () => {
    const { user, supabase } = await requireAuth();

    const { data, error } = await supabase
      .from("events")
      .select("*, venues(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as EventWithVenues;
  });
}

export async function createEvent(
  input: CreateEventInput
): Promise<ActionResponse<EventWithVenues>> {
  return safeAction(async () => {
    const { user, supabase } = await requireAuth();

    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        name: input.name,
        sport_type: input.sportType,
        date_time: input.dateTime,
        description: input.description || null,
      })
      .select()
      .single();

    if (eventError) {
      throw new Error(eventError.message);
    }

    if (input.venues.length > 0) {
      const venueInserts: VenueInsert[] = input.venues.map((venue) => ({
        event_id: event.id,
        name: venue.name,
        address: venue.address || null,
      }));

      const { error: venuesError } = await supabase
        .from("venues")
        .insert(venueInserts);

      if (venuesError) {
        await supabase.from("events").delete().eq("id", event.id);
        throw new Error(venuesError.message);
      }
    }

    const { data: completeEvent, error: fetchError } = await supabase
      .from("events")
      .select("*, venues(*)")
      .eq("id", event.id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    revalidatePath("/dashboard");
    return completeEvent as EventWithVenues;
  });
}

export async function updateEvent(
  input: UpdateEventInput
): Promise<ActionResponse<EventWithVenues>> {
  return safeAction(async () => {
    const { user, supabase } = await requireAuth();

    // Verify ownership
    const { data: existingEvent, error: verifyError } = await supabase
      .from("events")
      .select("id")
      .eq("id", input.id)
      .eq("user_id", user.id)
      .single();

    if (verifyError || !existingEvent) {
      throw new Error("Event not found or you don't have permission to edit it");
    }

    const { error: eventError } = await supabase
      .from("events")
      .update({
        name: input.name,
        sport_type: input.sportType,
        date_time: input.dateTime,
        description: input.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (eventError) {
      throw new Error(eventError.message);
    }

    const { error: deleteVenuesError } = await supabase
      .from("venues")
      .delete()
      .eq("event_id", input.id);

    if (deleteVenuesError) {
      throw new Error(deleteVenuesError.message);
    }

    if (input.venues.length > 0) {
      const venueInserts: VenueInsert[] = input.venues.map((venue) => ({
        event_id: input.id,
        name: venue.name,
        address: venue.address || null,
      }));

      const { error: venuesError } = await supabase
        .from("venues")
        .insert(venueInserts);

      if (venuesError) {
        throw new Error(venuesError.message);
      }
    }

    const { data: completeEvent, error: fetchError } = await supabase
      .from("events")
      .select("*, venues(*)")
      .eq("id", input.id)
      .single();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    revalidatePath("/dashboard");
    revalidatePath(`/events/${input.id}`);
    return completeEvent as EventWithVenues;
  });
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  return safeAction(async () => {
    const { user, supabase } = await requireAuth();

    const { data: existingEvent, error: verifyError } = await supabase
      .from("events")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (verifyError || !existingEvent) {
      throw new Error("Event not found or you don't have permission to delete it");
    }

    await supabase.from("venues").delete().eq("event_id", id);

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard");
  });
}
