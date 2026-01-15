"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { EventWithVenues } from "@/types/database";
import { deleteEvent } from "@/lib/actions/events";

interface EventCardProps {
  event: EventWithVenues;
}

export function EventCard({ event }: EventCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEvent(event.id);
      if (result.success) {
        toast.success("Event deleted successfully");
        setShowDeleteDialog(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  const sportTypeColors: Record<string, string> = {
    Soccer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Basketball: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Tennis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Baseball: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Football: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Hockey: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Golf: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Swimming: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    Volleyball: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    Cricket: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    Rugby: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <>
      <Card className="group transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {event.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className={sportTypeColors[event.sport_type] || sportTypeColors.Other}
            >
              {event.sport_type}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/events/${event.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(event.date_time), "PPP 'at' p")}
          </div>

          {event.venues.length > 0 && (
            <div className="flex items-start text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
              <span className="line-clamp-2">
                {event.venues.map((v) => v.name).join(", ")}
              </span>
            </div>
          )}

          {event.description && (
            <CardDescription className="line-clamp-2">
              {event.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{event.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
