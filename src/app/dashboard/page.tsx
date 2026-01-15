import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { EventList } from "@/components/events/event-list";
import { EventFilters } from "@/components/events/event-filters";
import { EventListSkeleton } from "@/components/events/event-skeleton";
import { getUser } from "@/lib/actions/auth";
import { getEvents, type EventFilters as Filters } from "@/lib/actions/events";
import type { SportType } from "@/types/database";

interface DashboardPageProps {
  searchParams: Promise<{ search?: string; sportType?: string }>;
}

async function EventsContent({ filters }: { filters: Filters }) {
  const result = await getEvents(filters);

  if (!result.success) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading events: {result.error}
      </div>
    );
  }

  return <EventList events={result.data} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters: Filters = {
    search: params.search,
    sportType: params.sportType as SportType | "all" | undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={user.email} />

      <main className="container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
              <p className="text-muted-foreground">
                Manage your sports events and venues
              </p>
            </div>
            <Button asChild>
              <Link href="/events/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          <EventFilters />

          <Suspense fallback={<EventListSkeleton />}>
            <EventsContent filters={filters} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
