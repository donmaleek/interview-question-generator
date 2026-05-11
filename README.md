# Interview Question Generator

Generate three thoughtful, role-specific interview questions with a polished, recruiter-ready UI. This app uses the Gemini API to deliver structured, JSON-only output and validates responses defensively before showing them.

## Highlights

- Purpose-built UI with clear input/output states and a bold visual theme
- Gemini-backed API route with strict JSON parsing and validation
- Clean separation between UI and API logic

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Google Gemini SDK (@google/genai)

## Quick Start

1) Install dependencies

```bash
npm install
```

2) Create a local env file

```bash
cp .env.local.example .env.local
```

If you do not have an example file, create `.env.local` with:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

3) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

Required:

- `GEMINI_API_KEY` - your Gemini API key

Optional:

- `GEMINI_MODEL` - defaults to `gemini-2.5-flash`

## API Endpoint

`POST /api/questions`

Request body:

```json
{
	"jobTitle": "Customer Success Manager"
}
```

Response body:

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

- `400` if `jobTitle` is missing or too short
- `500` if the server is misconfigured
- `502` if Gemini returns empty or malformed JSON

## How It Works

1) The UI posts the job title to `/api/questions`.
2) The API validates input, builds a strict JSON prompt, and calls Gemini.
3) The response is parsed and normalized to exactly three questions.
4) The UI renders the results with clear empty, loading, and error states.

## Deployment (Vercel)

1) Push the repo to GitHub.
2) Import the project into Vercel.
3) Set environment variables in Vercel:
	 - `GEMINI_API_KEY` (sensitive)
	 - `GEMINI_MODEL` (optional)
4) Deploy.

## Troubleshooting

- `API_KEY_INVALID`: ensure the key is valid for the Generative Language API.
- `503 UNAVAILABLE`: the model is overloaded; retry or switch the model.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production server
npm run lint    # lint the codebase
```

## License

MIT
