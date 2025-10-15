"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

export type Session = {
  user: {
    id: number;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
};

const secretKey = config.session.secretKey;
if (!secretKey) {
  throw new Error(
    "SESSION_SECRET_KEY is not defined in environment variables. Please add it to your .env file."
  );
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiresAt = new Date(
    Date.now() + config.session.expiryDays * 24 * 60 * 60 * 1000
  );
  const session = await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(`${config.session.expiryDays}d`)
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    expires: expiresAt,
    sameSite: config.cookie.sameSite,
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
