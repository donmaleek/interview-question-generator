# Assignment Compliance

This document maps the technical screen requirements to the implementation.

## Requirement Mapping

| Requirement | Implementation |
| --- | --- |
| Accept a job title as text input | `app/page.tsx` renders a controlled text input named `jobTitle`. |
| Use `Customer Success Manager` as the primary example | The input defaults to `Customer Success Manager`, and it is the first example button. |
| On submission, call an AI API | The form posts to `POST /api/questions`, which calls Gemini on the server. |
| Return 3 thoughtful interview questions | The API prompt asks for exactly 3 questions and the route validates that exactly 3 are returned. |
| API call must work | The Gemini SDK is configured in `app/api/questions/route.ts`; deployment needs `GEMINI_API_KEY`. |
| Model selection is up to you | Default model is `gemini-2.5-flash`, configurable with `GEMINI_MODEL`. |
| No personal information | The UI only sends a generic job title, and the prompt instructs Gemini not to include private or protected information. |
| Clean readable UI | The page uses a simple two-column layout with clear form and output areas. |
| Basic loading state | The submit button changes to `Generating...`, and the output area shows skeleton loading lines. |
| Clear code and simple error handling | The client validates empty input, the API validates request JSON, and both show clear errors. |
| Readable and maintainable code | Prompt building, job-title cleanup, and response normalization live in `app/api/questions/utils.js` and are covered by `npm test`. |
| Submit GitHub link and live URL | README has a Live Demo placeholder and deployment checklist. |
| Explain provider and model in Loom | README and `docs/loom-video-outline.md` include provider/model reasoning. |
| Do not hide AI usage | README notes the assignment context and the Loom outline includes how AI was used. |

## Reviewer Test Path

1. Open the live URL.
2. Leave `Customer Success Manager` in the input.
3. Click `Generate questions`.
4. Confirm the page shows a loading state.
5. Confirm exactly three role-specific questions appear.
6. Try another generic role, such as `Product Manager`.

## Local Verification

Run these before submission:

```bash
npm test
npm run lint
npm run build
```

`npm test` covers the core helper behavior without calling Gemini, so it is fast and does not consume API quota.

## Things To Avoid Before Submitting

- Do not commit `.env.local`.
- Do not paste a real API key into the README, code, Loom description, or email.
- Do not use a private resume, phone number, name, or personal background in the prompt.
- Do not submit without first testing the deployed URL.
- Do not leave the README live URL placeholder unchanged.
