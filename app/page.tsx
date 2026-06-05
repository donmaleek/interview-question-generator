"use client";

import { FormEvent, useState } from "react";

type QuestionsApiResponse = {
  questions?: string[];
  error?: string;
};

const EXAMPLE_ROLES = [
  "Customer Success Manager",
  "Product Manager",
  "Software Engineer",
];

export default function Home() {
  const [jobTitle, setJobTitle] = useState("Customer Success Manager");
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedJobTitle = jobTitle.trim();

    setError("");
    setQuestions([]);

    if (!trimmedJobTitle) {
      setError("Please enter a job title.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle: trimmedJobTitle }),
      });

      const data = (await response.json()) as QuestionsApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions.");
      }

      if (!Array.isArray(data.questions) || data.questions.length !== 3) {
        throw new Error("The API did not return exactly 3 questions.");
      }

      setQuestions(data.questions);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 text-[color:var(--foreground)]">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <header className="app-panel p-6">
          <p className="eyebrow">AI interview question generator</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Generate role-specific interview questions.
          </h1>
          <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
            Enter a generic job title and Gemini will return three thoughtful
            questions tailored to that role.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="app-panel p-6">
            <label htmlFor="jobTitle" className="text-sm font-semibold">
              Job title
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Customer Success Manager"
              className="mt-2 w-full rounded-lg border border-[color:var(--line-strong)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {EXAMPLE_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setJobTitle(role)}
                  className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
                >
                  {role}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-lg bg-[color:var(--accent)] px-4 py-3 font-semibold text-white transition hover:bg-[color:var(--accent-strong)] disabled:bg-[#94b5a8]"
            >
              {isLoading ? "Generating..." : "Generate questions"}
            </button>

            <p className="mt-4 text-sm text-[color:var(--muted)]">
              Privacy note: this app sends only the job title you enter.
            </p>
          </form>

          <section className="app-panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Output</p>
                <h2 className="mt-2 text-2xl font-bold">Interview questions</h2>
              </div>
              <span className="rounded-lg border border-[color:var(--line)] bg-[color:var(--panel-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--muted)]">
                {isLoading
                  ? "Loading"
                  : questions.length > 0
                  ? "Ready"
                  : "Waiting"}
              </span>
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="mt-5 grid gap-3">
                <div className="skeleton-line w-11/12" />
                <div className="skeleton-line w-full" />
                <div className="skeleton-line w-4/5" />
              </div>
            )}

            {!isLoading && !error && questions.length === 0 && (
              <div className="mt-5 rounded-lg border border-dashed border-[color:var(--line-strong)] bg-[color:var(--panel-muted)] p-4 text-sm text-[color:var(--muted)]">
                Submit a job title to generate three questions.
              </div>
            )}

            {questions.length > 0 && (
              <ol className="mt-5 grid gap-4">
                {questions.map((question, index) => (
                  <li
                    key={`${question}-${index}`}
                    className="rounded-lg border border-[color:var(--line)] bg-white p-4"
                  >
                    <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
                      Question {index + 1}
                    </p>
                    <p className="mt-2 leading-7">{question}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
