import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            There was an error during the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This could happen if the authentication link has expired or was already used.
            Please try signing in again.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
