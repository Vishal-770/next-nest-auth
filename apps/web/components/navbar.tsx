import { getSession } from "@/actions/session";
import { SignOutButton } from "./signout-button";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold text-xl mr-8">
          Auth App
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome,{" "}
                <span className="font-medium text-foreground">
                  {session.user.name}
                </span>
              </span>
              <ModeToggle />
              <SignOutButton />
            </>
          ) : (
            <>
              <ModeToggle />
              <Link
                href="/auth/login"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
