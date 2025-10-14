"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Mail, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi, type VerifyEmailData } from "@/lib/auth-api";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  // Use TanStack Query mutation for email verification
  const verifyMutation = useMutation({
    mutationFn: (data: VerifyEmailData) => authApi.verifyEmail(data),
    onSuccess: () => {
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    },
  });

  const handleVerify = () => {
    if (!code) {
      return;
    }
    verifyMutation.mutate({ code });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <FieldGroup>
            <div className="flex flex-col items-center gap-4 text-center">
              {!code ? (
                <>
                  <div className="bg-red-100 p-4 rounded-full">
                    <XCircle className="size-12 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold">
                    Invalid Verification Link
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    The verification link is invalid or missing. Please check
                    your email and try again.
                  </p>
                </>
              ) : verifyMutation.isSuccess ? (
                <>
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="size-12 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Email Verified!</h1>
                  <p className="text-muted-foreground text-sm">
                    {verifyMutation.data.message ||
                      "Your email has been verified successfully. You can now log in to your account."}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Redirecting to login page...
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Mail className="size-12 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold">Verify Your Email</h1>
                  <p className="text-muted-foreground text-sm">
                    Click the button below to verify your email address and
                    activate your account.
                  </p>
                </>
              )}
            </div>

            {verifyMutation.isError && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {verifyMutation.error?.message ||
                  "An error occurred during verification"}
              </div>
            )}

            {code && !verifyMutation.isSuccess && (
              <Field>
                <Button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending}
                  className="w-full"
                >
                  {verifyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>
              </Field>
            )}

            {verifyMutation.isSuccess && (
              <Field>
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full"
                >
                  Go to Login
                </Button>
              </Field>
            )}

            {!code && (
              <Field>
                <Button
                  onClick={() => router.push("/auth/signup")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Signup
                </Button>
              </Field>
            )}

            {code && !verifyMutation.isSuccess && (
              <FieldDescription className="text-center">
                Need a new verification link?{" "}
                <a href="/auth/signup" className="underline underline-offset-4">
                  Sign up again
                </a>
              </FieldDescription>
            )}
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
