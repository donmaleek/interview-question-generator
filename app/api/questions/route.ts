import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  buildPrompt,
  getJobTitle,
  normalizeQuestions,
} from "./utils";

type GeminiQuestionResponse = {
  questions?: unknown;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send valid JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Please provide a job title." },
      { status: 400 }
    );
  }

  const jobTitle = getJobTitle((body as Record<string, unknown>).jobTitle);

  if (jobTitle.length < 2) {
    return NextResponse.json(
      { error: "Please provide a valid job title." },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: buildPrompt(jobTitle),
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (!response.text) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(response.text) as GeminiQuestionResponse;
    const questions = normalizeQuestions(parsed);

    if (questions.length !== 3) {
      return NextResponse.json(
        { error: "Gemini did not return exactly 3 questions." },
        { status: 502 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Question generation failed:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating questions." },
      { status: 500 }
    );
  }
}
