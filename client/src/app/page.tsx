"use client";

import { useState } from "react";

const CATEGORIES = [
  "Product",
  "Support",
  "Billing",
  "Feature Request",
  "UI/UX",
  "Other",
] as const;

const MESSAGE_MAX = 500;

type FormData = {
  name: string;
  email: string;
  category: string;
  message: string;
};

type FormErrors = Partial<Record<"name" | "category" | "message", string>>;

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  category: "",
  message: "",
};

export default function Home() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function updateField<K extends keyof FormData>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for a field as soon as the user edits it.
    if (field in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  }

  function validate(data: FormData): FormErrors {
    const nextErrors: FormErrors = {};
    if (!data.name.trim()) nextErrors.name = "Name is required";
    if (!data.category) nextErrors.category = "Category is required";
    if (!data.message.trim()) nextErrors.message = "Message is required";
    return nextErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowSuccess(false);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    // Placeholder for the real API call — logs the payload for now.
    console.log(
      "Feedback submission:",
      JSON.stringify(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          category: form.category,
          message: form.message.trim(),
        },
        null,
        2
      )
    );

    // Simulate a network round-trip.
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setForm(EMPTY_FORM);
      setErrors({});
    }, 1000);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-125">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            We value your feedback
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Tell us what&apos;s working, what&apos;s not, or what you&apos;d
            love to see next.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          {showSuccess && (
            <div
              role="status"
              className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Thanks! Your feedback has been submitted successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Jane Doe"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1.5 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-600/20 ${
                  form.category ? "text-gray-900" : "text-gray-400"
                } ${
                  errors.category
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
              >
                <option value="" disabled>
                  Select a category
                </option>
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="text-gray-900"
                  >
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="category-error" className="mt-1.5 text-sm text-red-600">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-xs ${
                    form.message.length > MESSAGE_MAX
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {form.message.length} / {MESSAGE_MAX}
                </span>
              </div>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                maxLength={MESSAGE_MAX}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Share your thoughts…"
                className={`w-full resize-y rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-600/20 ${
                  errors.message
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1.5 text-sm text-red-600">
                  {errors.message}
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
              {isSubmitting ? "Submitting…" : "Submit Feedback"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Your feedback is secure and anonymous.
        </p>
      </div>
    </main>
  );
}
