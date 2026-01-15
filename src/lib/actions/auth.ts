"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { safeAction, type ActionResponse } from "./index";

export async function signUp(
  email: string,
  password: string
): Promise<ActionResponse> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });
}

export async function signIn(
  email: string,
  password: string
): Promise<ActionResponse> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  });
}

export async function signInWithGoogle(): Promise<ActionResponse<string>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.url;
  });
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
