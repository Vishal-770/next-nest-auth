"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Session = {
  user: {
    id: string;
    name: string;
    email?: string;
  };
};

const secretKey = process.env.SESSION_SECRET_KEY;
if (!secretKey) {
  throw new Error(
    "SESSION_SECRET_KEY is not defined in environment variables. Please add it to your .env file."
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
