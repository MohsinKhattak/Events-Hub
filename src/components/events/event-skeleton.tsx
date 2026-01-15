import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export function EventListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
