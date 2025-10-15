"use server";

import { getSession } from "@/actions/session";

/**
 * Server action to get the access token from session
 * Can be called from client components
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.user.accessToken || null;
}
