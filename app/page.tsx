"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("Customer Success Manager");
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setQuestions([]);

    const trimmedJobTitle = jobTitle.trim();

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate questions.");
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
    <main className="relative min-h-screen overflow-hidden px-6 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,91,42,0.35),transparent_65%)] blur-3xl float-slow" />
        <div className="absolute top-20 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(43,109,224,0.35),transparent_70%)] blur-3xl float-slow-delay" />
        <div className="absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,186,140,0.4),transparent_70%)] blur-3xl float-slow" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5 fade-up">
            <span className="chip">Interview Question Studio</span>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Make every interview feel deliberate.
            </h1>
            <p className="max-w-xl text-base text-[color:var(--muted)] sm:text-lg">
              Generate three focused questions that measure judgment,
              communication, and ownership for any role.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="tag">Judgment</span>
              <span className="tag">Communication</span>
              <span className="tag">Ownership</span>
              <span className="tag">Role depth</span>
            </div>
          </div>

          <div className="surface-strong rounded-3xl p-6 fade-up-1">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Output
            </p>
            <p className="font-display mt-4 text-5xl">3</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              tailored questions per role
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
              <span>Fast turnaround</span>
              <span>Structured thinking</span>
              <span>Team ready</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card rounded-3xl p-8 fade-up-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  Input
                </p>
                <h2 className="font-display mt-3 text-2xl">
                  Start with a job title
                </h2>
              </div>
              <span className="tag">Live generator</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-medium">
                  Job title
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="Customer Success Manager"
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-white/70 px-4 py-4 text-base outline-none transition focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#f05b2a] px-6 py-3 text-sm font-semibold text-[#1d1712] shadow-[0_16px_30px_rgba(240,91,42,0.35)] transition hover:-translate-y-0.5 hover:bg-[#d84b20] disabled:cursor-not-allowed disabled:bg-[#f4b19a] disabled:text-[#3a2a22]"
                >
                  {isLoading ? "Generating..." : "Generate Questions"}
                </button>
                <span className="text-xs text-[color:var(--muted)]">
                  Powered by Gemini
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                Try: Product Manager, Growth Marketer, Staff Engineer.
              </div>
            </form>
          </div>

          <div className="surface-card rounded-3xl p-8 fade-up-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  Output
                </p>
                <h2 className="font-display mt-3 text-2xl">
                  Generated questions
                </h2>
                {questions.length > 0 && (
                  <p className="mt-2 text-sm text-[color:var(--muted)]">
                    Role: {jobTitle.trim()}
                  </p>
                )}
              </div>
              <span className="tag">
                {isLoading
                  ? "Working"
                  : questions.length > 0
                  ? "Ready"
                  : "Waiting"}
              </span>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="mt-6 space-y-3">
                <div className="h-4 w-4/5 rounded-full bg-[color:var(--skeleton)]" />
                <div className="h-4 w-full rounded-full bg-[color:var(--skeleton)]" />
                <div className="h-4 w-2/3 rounded-full bg-[color:var(--skeleton)]" />
              </div>
            )}

            {!isLoading && !error && questions.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/50 p-5 text-sm text-[color:var(--muted)]">
                No questions yet. Enter a job title to generate three focused
                prompts.
              </div>
            )}

            {questions.length > 0 && (
              <ol className="mt-6 space-y-4">
                {questions.map((question, index) => (
                  <li
                    key={question}
                    className="rounded-2xl border border-[color:var(--line)] bg-white/75 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      Question {index + 1}
                    </p>
                    <p className="mt-3 text-base text-[color:var(--foreground)]">
                      {question}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 text-xs text-[color:var(--muted)]">
          <span>Designed for thoughtful, structured interviews.</span>
          <span>Tip: Ask for examples and measurable outcomes.</span>
        </footer>
      </div>
    </main>
  );
}