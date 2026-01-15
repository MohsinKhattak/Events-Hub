import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { EventForm } from "@/components/events/event-form";
import { getUser } from "@/lib/actions/auth";
import { getEvent } from "@/lib/actions/events";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await getEvent(id);

  if (!result.success) {
    notFound();
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
              <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
              <p className="text-muted-foreground">
                Update your event details and venues
              </p>
            </div>
          </div>

          <EventForm event={result.data} />
        </div>
      </main>
    </div>
  );
}
