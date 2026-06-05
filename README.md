# AI Interview Question Generator

A small Next.js app for the technical screen. It accepts a job title, calls the Gemini API, and returns exactly three thoughtful interview questions specific to that role.

Primary example: `Customer Success Manager`.

## Live Links

- Live App: https://interview-question-generator-green.vercel.app/
- GitHub Repository: https://github.com/donmaleek/interview-question-generator
- Loom Walkthrough: https://www.loom.com/share/9220269f8a5041b8afd53891e816de8b

## What It Does

- Shows a clean web page with one job-title input
- Uses `Customer Success Manager` as the default example
- Submits the job title to a server-side API route
- Calls Gemini from the server so the API key is not exposed in the browser
- Displays a loading state while the API request is running
- Renders exactly three generated interview questions
- Shows simple user-facing errors when validation or generation fails

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Google Gemini SDK (`@google/genai`)
- Vercel for deployment

## Provider And Model Choice

Provider: Google Gemini

Default model: `gemini-2.5-flash`

I chose Gemini because the assignment explicitly mentioned it as a good free-tier option, it is fast for short structured generation, and the app only needs a compact JSON response with three questions.

The model can be changed with `GEMINI_MODEL` without changing the application code.

## Prompt

The API route sends Gemini this prompt shape:

```text
Generate exactly 3 thoughtful interview questions for the job title "{jobTitle}".

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
```

The route also sets `responseMimeType: "application/json"` and validates the parsed response before returning it to the UI.

## Privacy And Security

- The app only sends the job title entered by the user.
- The prompt tells Gemini not to request or include personal, private, protected-class, or resume-specific information.
- The Gemini API key is read from server-side environment variables only.
- `.env.local` is ignored by git and should not be committed.
- `.env.local.example` contains placeholders only.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.local.example .env.local
```

3. Add your Gemini key:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

4. Start the dev server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## API Reference

Endpoint:

```text
POST /api/questions
```

Request:

```json
{
  "jobTitle": "Customer Success Manager"
}
```

Successful response:

```json
{
  "questions": [
    "Question one?",
    "Question two?",
    "Question three?"
  ]
}
```

Error responses:

- `400` when the request body is invalid or the job title is missing
- `500` when the Gemini API key is not configured or an unexpected server error occurs
- `502` when Gemini returns empty or incorrectly shaped output

## Project Structure

```text
app/
  api/questions/route.ts  Server-side Gemini call and response validation
  api/questions/utils.js   Testable prompt and response helpers
  globals.css             Shared styles
  layout.tsx              App metadata and fonts
  page.tsx                Main form, loading state, error state, and output
docs/
  assignment-compliance.md Requirement-by-requirement checklist
  loom-video-outline.md    4-7 minute Loom script outline
tests/
  questions-utils.test.mjs No-dependency tests for API helper behavior
.env.local.example        Environment variable template
```

## Supporting Docs

- [Assignment compliance](docs/assignment-compliance.md)
- [Loom video outline](docs/loom-video-outline.md)

## Scripts

```bash
npm run dev      # start local development
npm test         # run helper tests
npm run build    # create a production build
npm run start    # run the production build
npm run lint     # run ESLint
```

## Tests

The project includes a small no-dependency test suite for the API helper logic:

```bash
npm test
```

It covers:

- Job title cleanup
- Rejection of invalid job title values
- Normalizing Gemini output to the first three non-empty questions
- Rejection of malformed question arrays
- Prompt requirements for JSON output, exactly three questions, and privacy constraints

## Deployment

Vercel is the simplest option for this app.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add environment variables in Vercel:

```text
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

4. Deploy.
5. Test the live URL with `Customer Success Manager`.

## Submission Checklist

- [ ] GitHub repository is pushed and public or accessible to the reviewer
- [ ] Live deployment URL works
- [ ] `Customer Success Manager` generates exactly 3 questions
- [ ] Loading state appears while questions are being generated
- [ ] `npm test`, `npm run lint`, and `npm run build` pass locally
- [ ] No API key or personal information is committed
- [ ] Loom video is 4 to 7 minutes
- [ ] Submission email includes GitHub link, live URL, and Loom link

## Loom Video Outline

Use `docs/loom-video-outline.md` for a short script that covers the required talking points.
