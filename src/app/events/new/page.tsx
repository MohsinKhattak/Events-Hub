import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { EventForm } from "@/components/events/event-form";
import { getUser } from "@/lib/actions/auth";

export default async function NewEventPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userEmail={user.email} />

      <main className="container py-8 max-w-3xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
              <p className="text-muted-foreground">
                Add a new sports event with venue details
              </p>
            </div>
          </div>

          <EventForm />
        </div>
      </main>
    </div>
  );
}
