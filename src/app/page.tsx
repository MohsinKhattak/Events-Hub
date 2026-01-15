import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/actions/auth";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="container flex h-16 items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          📅 Event Hub
        </span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Manage Your{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Events
            </span>{" "}
            with Ease
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create, organize, and manage events with venue information.
            Perfect for event planners, organizers, and anyone managing multiple events.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-3 max-w-4xl">
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Event Types</h3>
            <p className="text-sm text-muted-foreground text-center">
              Manage all types of events - conferences, meetings, celebrations, and more
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Easy Scheduling</h3>
            <p className="text-sm text-muted-foreground text-center">
              Set dates, times, and manage your event calendar effortlessly
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Venue Management</h3>
            <p className="text-sm text-muted-foreground text-center">
              Add multiple venues with addresses for each event
            </p>
          </div>
        </div>
      </main>

      <footer className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Event Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
