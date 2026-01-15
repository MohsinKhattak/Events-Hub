import { EventCard } from "./event-card";
import type { EventWithVenues } from "@/types/database";
import { CalendarX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EventListProps {
  events: EventWithVenues[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarX className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first sports event.
        </p>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
