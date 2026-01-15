import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Event Not Found</CardTitle>
          <CardDescription>
            The event you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
