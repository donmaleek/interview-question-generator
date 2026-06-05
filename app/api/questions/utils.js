export function getJobTitle(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

export function normalizeQuestions(payload) {
  if (!payload || !Array.isArray(payload.questions)) {
    return [];
  }

  return payload.questions
    .filter((question) => typeof question === "string")
    .map((question) => question.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function buildPrompt(jobTitle) {
  return `
Generate exactly 3 thoughtful interview questions for the job title "${jobTitle}".

Requirements:
- Make each question specific to the role.
- Focus on practical judgment, communication, ownership, and role-specific work.
- Do not ask for protected-class, personal, private, or resume-specific information.
- Do not include names, phone numbers, email addresses, or private details.
- Return valid JSON only in this exact shape:
{
  "questions": [
    "Question one?",
    "Question two?",
    "Question three?"
  ]
}
`;
}
