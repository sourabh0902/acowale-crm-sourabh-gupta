"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginErrors = Partial<Record<"email" | "password", string>>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Set when the user was redirected here from a protected page while logged out.
  const redirectedForAuth = searchParams.get("reason") === "auth";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginErrors;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setIsSubmitting(true);

    const response = await api<{
      token: string;
      user: { id: string; email: string; role: string };
    }>("/auth/login", {
      method: "POST",
      body: { email: result.data.email, password: result.data.password },
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setServerError(response.error);
      return;
    }

    setToken(response.data.token);
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-100">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-blue-600">
              Acowale CRM
            </h1>
            <p className="mt-1 text-sm text-gray-500">Admin sign in</p>
          </div>

          {redirectedForAuth && !serverError && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Please log in to access the dashboard.
            </div>
          )}

          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="text-gray-500 transition hover:text-blue-600"
          >
            ← Back to feedback form
          </Link>
        </p>
      </div>
    </main>
  );
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
