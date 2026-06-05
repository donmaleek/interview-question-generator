# Loom Video Outline

Target length: 4 to 7 minutes.

## 1. Introduce Yourself

Suggested talking point:

> Hi, my name is [Your Name]. For this technical screen, I built a small AI interview question generator. The goal is simple: enter a generic job title, call an AI API, and return three thoughtful interview questions for that role.

## 2. Show The Working App

Demo flow:

1. Open the live URL.
2. Point out the default `Customer Success Manager` example.
3. Click `Generate questions`.
4. Mention the loading state while the API request runs.
5. Read the three generated questions.
6. Try one more generic role if time allows, such as `Product Manager`.

Suggested talking point:

> I kept the interface intentionally simple because the assignment is about a working AI flow, clear thinking, and readable code rather than a complex product.

## 3. Walk Through The Code

Files to show:

- `app/page.tsx`
- `app/api/questions/route.ts`
- `.env.local.example`
- `README.md`

What to say for `app/page.tsx`:

> This is the client page. It keeps track of the job title, loading state, questions, and errors. On submit, it posts the job title to the API route and only renders the result if the API returns exactly three questions.

What to say for `app/api/questions/route.ts`:

> This is the server-side route. I parse and validate the request, keep the Gemini key on the server, build the prompt, call Gemini, parse the JSON response, and validate that the final response has exactly three non-empty strings.

What to say for `.env.local.example`:

> The real API key stays in `.env.local`, which is ignored by git. The example file documents the variables without exposing secrets.

What to say for tests:

> I added a small no-dependency test script for the pure helper logic. It checks job-title cleanup, malformed output handling, the exactly-three-question normalization, and the privacy/JSON requirements in the prompt. I also ran lint and a production build before submission.

## 4. Provider And Model

Required answer:

> I chose Google Gemini and defaulted to `gemini-2.5-flash`. Gemini was recommended in the prompt, has a generous free tier, and this task only needs a fast structured JSON response. I made the model configurable with `GEMINI_MODEL` so it can be swapped without code changes.

## 5. Prompt Decision

Suggested talking point:

> The prompt asks for exactly three role-specific questions and tells the model to return JSON only. I also included privacy constraints so it avoids personal, private, resume-specific, or protected-class information.

## 6. One Improvement With More Time

Pick one:

> With more time, I would add automated tests for the API route, especially cases where Gemini returns malformed JSON or fewer than three questions.

or:

> With more time, I would add a small copy-to-clipboard button and maybe let the user choose the interview style, while still keeping the output to three questions.

## 7. Philosophy Around Building

Suggested answer:

> My philosophy is to start by making the core workflow real, then improve from there. I care about understanding the requirement, making the first version reliable, and keeping the code readable enough that another person can maintain it.

## 8. Collaboration Style

Suggested answer:

> I collaborate by making my assumptions visible early, asking clarifying questions when the requirement is ambiguous, and sharing small working increments. I like getting feedback before I polish too much, because it is easier to correct direction early.

## 9. How You Figure Things Out When Stuck

Suggested answer:

> When I am stuck, I try to reduce the problem. I check the smallest failing piece, read the error carefully, add logging if needed, and verify one assumption at a time. If I still cannot resolve it, I explain what I tried and ask for help with enough context that someone else can reason with me.

## 10. Mention AI Usage

Suggested answer:

> I did use AI as a coding partner. I used it to help refine the implementation, check the assignment requirements, and improve the documentation. I still made the technical decisions around scope, validation, privacy, and how the app should satisfy the prompt.

## Final Reminder

End with:

> Thanks for reviewing. The GitHub repository and live URL are included in my submission email.
