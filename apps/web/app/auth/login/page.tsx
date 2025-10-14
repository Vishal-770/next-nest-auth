import { GalleryVerticalEnd, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/actions/session";

export default async function LoginPage() {
  const session = await getSession();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Auth App
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {session ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Already Logged In</h2>
                <p className="text-muted-foreground">
                  You are currently logged in as{" "}
                  <span className="font-medium text-foreground">
                    {session.user.name}
                  </span>
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Go to Home
                </Link>
              </div>
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-muted-foreground">
              Sign in to access your account and continue your journey with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
