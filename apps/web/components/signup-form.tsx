"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi, type SignupData } from "@/lib/auth-api";

// Zod schema for signup form validation
const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Use TanStack Query mutation for signup
  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const signupData: SignupData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    signupMutation.mutate(signupData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>

          {signupMutation.isError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {signupMutation.error?.message ||
                "An error occurred during signup"}
            </div>
          )}

          {signupMutation.isSuccess && (
            <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded-md">
              {signupMutation.data.message ||
                "Account created successfully! Please check your email to verify your account."}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              disabled={signupMutation.isPending}
            />
            {errors.name && (
              <FieldDescription className="text-red-500">
                {errors.name.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              disabled={signupMutation.isPending}
            />
            {errors.email ? (
              <FieldDescription className="text-red-500">
                {errors.email.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={signupMutation.isPending}
            />
            {errors.password ? (
              <FieldDescription className="text-red-500">
                {errors.password.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Must be between 6-20 characters long.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              {...register("confirmPassword")}
              disabled={signupMutation.isPending}
            />
            {errors.confirmPassword ? (
              <FieldDescription className="text-red-500">
                {errors.confirmPassword.message}
              </FieldDescription>
            ) : (
              <FieldDescription>Please confirm your password.</FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" disabled={signupMutation.isPending}>
              {signupMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field>
            <Button
              variant="outline"
              type="button"
              disabled={signupMutation.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              Sign up with GitHub
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/auth/login" className="underline underline-offset-4">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
