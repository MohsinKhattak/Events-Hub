"use server";

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    console.error("Action error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

export async function requireAuth() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to perform this action");
  }

  return { user, supabase };
}
