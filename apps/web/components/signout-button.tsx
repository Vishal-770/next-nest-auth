"use client";

import { Button } from "@/components/ui/button";
import { deleteSession } from "@/actions/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await deleteSession();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut} disabled={isLoading} variant="outline">
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
