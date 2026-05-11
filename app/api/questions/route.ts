/*
 * External dependencies used by this route handler.
 * - GoogleGenAI provides the Gemini client used to generate interview questions.
 * - NextResponse helps us construct JSON responses with status codes in Next.js.
 */
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

/*
 * Expected shape of the JSON returned by the AI.
 * This is a TypeScript hint only; we still validate at runtime because the
 * AI response is untrusted and can drift from the expected contract.
 */
type QuestionsResponse = {
  questions: string[];
};

/*
 * Guard to ensure we only accept usable job titles.
 * A valid value must be a string with at least 2 non-whitespace characters,
 * which keeps the prompt meaningful and prevents trivial inputs.
 */
function isValidJobTitle(value: unknown): value is string {
  /* Return true only when the value is a non-empty string after trimming. */
  return typeof value === "string" && value.trim().length >= 2;
}

/*
 * Normalize and limit AI output to three non-empty strings.
 * This function is defensive: it accepts unknown input, verifies the
 * expected shape, trims each question, drops empty values, and caps the
 * list at 3. If the payload is not compatible, it returns an empty array
 * so the caller can treat the response as invalid.
 */
function extractQuestions(payload: unknown): string[] {
  /* Verify that the payload is an object with a questions array. */
  if (
    typeof payload === "object" &&
    payload !== null &&
    "questions" in payload &&
    Array.isArray((payload as QuestionsResponse).questions)
  ) {
    /* Filter to strings, trim whitespace, drop empties, then cap at 3. */
    return (payload as QuestionsResponse).questions
      .filter((question) => typeof question === "string")
      .map((question) => question.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  /* Return an empty list when the payload does not match expectations. */
  return [];
}

/*
 * POST /api/questions
 * Flow:
 * 1) Parse request JSON and validate input.
 * 2) Ensure the Gemini API key is present.
 * 3) Build a strict prompt requesting JSON output.
 * 4) Parse and validate the response before returning it.
 */
export async function POST(request: Request) {
  /* Wrap the handler in try/catch to handle parsing and SDK failures. */
  try {
    /*
     * Parse and validate the incoming payload. If the JSON is invalid,
     * request.json() will throw and be handled by the catch block.
     */
    const body = await request.json();
    /* Extract jobTitle from the request body for validation and prompting. */
    const jobTitle = body.jobTitle;

    if (!isValidJobTitle(jobTitle)) {
      /* Return 400 when input is missing or too short for a useful prompt. */
      return NextResponse.json(
        { error: "Please provide a valid job title." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      /* Return 500 when server configuration is incomplete. */
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    /*
     * Initialize the Gemini client using the server-side API key.
     * The key is never exposed to the client.
     */
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    /*
     * Prompt forces a strict JSON response shape so we can parse safely.
     * The model is instructed to return exactly 3 questions.
     */
    const prompt = `
Generate exactly 3 thoughtful interview questions for the role: "${jobTitle.trim()}".

Requirements:
- Questions must be specific to the role.
- Questions should evaluate practical judgment, communication, ownership, and role-specific thinking.
- Do not include personal information.
- Return valid JSON only in this exact format:
{
  "questions": [
    "Question one?",
    "Question two?",
    "Question three?"
  ]
}
`;

    /*
     * Request JSON-formatted content from the model.
     * responseMimeType nudges the model to emit JSON only.
     */
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    /* Read the raw text returned by the model wrapper. */
    const text = response.text;

    /*
     * Fail fast if the model returns nothing.
     * This prevents JSON.parse from throwing on an empty value.
     */
    if (!text) {
      /* Upstream model failed to return content. */
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    /*
     * Validate JSON shape and enforce exactly three questions.
     * If the AI response drifts from the contract, return a 502.
     */
    /* Parse the JSON text into a JavaScript value. */
    const parsed = JSON.parse(text);
    /* Extract and normalize the questions from the parsed payload. */
    const questions = extractQuestions(parsed);

    if (questions.length !== 3) {
      /* Upstream model returned invalid JSON or wrong count. */
      return NextResponse.json(
        { error: "The AI response was not in the expected format." },
        { status: 502 }
      );
    }

    /* Return the validated questions to the client. */
    return NextResponse.json({ questions });
  } catch (error) {
    /* Catch-all for JSON parsing, network, or SDK errors. */
    console.error("Question generation failed:", error);

    /* Return 500 for unexpected server errors. */
    return NextResponse.json(
      { error: "Something went wrong while generating questions." },
      { status: 500 }
    );
  }
}