"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthPageGuard({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      // Just refresh to show logged-in state, don't redirect
      router.refresh();
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
}
