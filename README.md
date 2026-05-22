# Interview Question Generator

A simple AI-powered web application that generates three thoughtful interview questions for any job title.

The app was built for a technical screen assignment. It accepts a job title, sends it to an AI API, and returns three role-specific questions that can help recruiters, hiring managers, or interviewers prepare better conversations with candidates.

## Live Links

- Live App: https://interview-question-generator-green.vercel.app/
- GitHub Repository: https://github.com/donmaleek/interview-question-generator
- Loom Walkthrough: https://www.loom.com/share/9220269f8a5041b8afd53891e816de8b

## What the App Does

The application allows a user to:

1. Enter a job title, for example, `Customer Success Manager`
2. Submit the role through a clean web interface
3. Call an AI API securely through a server-side route
4. Receive exactly three thoughtful interview questions specific to that role
5. See loading, success, and error states clearly

The goal was to keep the app focused, functional, readable, and easy to understand.

## Main Features

- Clean and readable user interface
- Job title input with simple validation
- Loading state while the AI request is running
- Clear error handling for invalid input or failed API responses
- Server-side Gemini API integration
- Structured JSON response handling
- Defensive parsing and validation before displaying results
- Separation between frontend UI logic and backend API logic
- No personal information used in prompts or code

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Google Gemini API
- `@google/genai`
- Vercel for deployment

## AI Provider and Model

This project uses Google Gemini through the `@google/genai` SDK.

Default model:

```bash
gemini-2.5-flash
```

I chose Gemini because it is fast, easy to integrate, and offers a generous free tier. For this assignment, the task is lightweight text generation, so a fast Gemini model is a good fit. The app does not need heavy reasoning or long-form output. It only needs clear, structured, role-specific interview questions.

## Prompt Design

The API route sends a focused prompt to Gemini asking it to return exactly three interview questions for the job title provided by the user.

The prompt is designed to:

- Stay generic and avoid personal information
- Focus only on the job title
- Produce practical interview questions
- Return structured JSON only
- Make the response easier to parse and validate

Example job title:

```text
Customer Success Manager
```

Example expected output:

```json
{
  "questions": [
    "Tell me about a time you helped a customer achieve a measurable outcome using a product or service.",
    "How would you handle a frustrated customer who is considering cancelling their subscription?",
    "What metrics would you track to understand whether your customer success strategy is working?"
  ]
}
```

## How It Works

1. The user enters a job title in the input field.
2. The frontend validates that the input is not empty.
3. The frontend sends a `POST` request to `/api/questions`.
4. The API route validates the request body.
5. The API route builds a structured prompt for Gemini.
6. Gemini returns a JSON response.
7. The server parses and validates the response.
8. The UI displays exactly three interview questions.
9. If something goes wrong, the user sees a clear error message.

## API Endpoint

### `POST /api/questions`

Request body:

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

Possible error responses:

- `400`: The job title is missing or too short
- `500`: The server is missing required configuration
- `502`: Gemini returned an empty or malformed response

## Environment Variables

Create a `.env.local` file in the root of the project.

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Required:

- `GEMINI_API_KEY`: Your Gemini API key

Optional:

- `GEMINI_MODEL`: The Gemini model to use. If not provided, the app defaults to `gemini-2.5-flash`.

## Getting Started Locally

Clone the repository:

```bash
git clone https://github.com/donmaleek/interview-question-generator.git
cd interview-question-generator
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.local.example .env.local
```

If `.env.local.example` is not available, create `.env.local` manually:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server.

```bash
npm run lint
```

Runs linting for the codebase.

## Deployment

The app is deployed on Vercel.

Deployment steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variable in Vercel:
   - `GEMINI_API_KEY`
4. Optionally add:
   - `GEMINI_MODEL`
5. Deploy the project.

Important: The Gemini API key should only be stored as an environment variable. It should never be committed to GitHub or exposed in frontend code.

## Security and Privacy

This project follows simple security and privacy practices:

- The API key is stored server-side only
- No personal information is required from users
- The prompt only uses generic job titles
- Private resumes, phone numbers, names, and personal data are not included
- The frontend does not expose the Gemini API key
- The API response is validated before being shown in the UI

## Error Handling

The app includes basic error handling for:

- Empty or invalid job titles
- Missing API key configuration
- Empty AI responses
- Malformed JSON responses
- Temporary API failures

Common issues:

### `API_KEY_INVALID`

Check that your Gemini API key is correct and enabled for the Generative Language API.

### `503 UNAVAILABLE`

The model may be temporarily overloaded. Retry the request or switch to another supported Gemini model.

### Empty or malformed response

The app validates that Gemini returns three usable questions. If the response is not valid, the API returns an error instead of showing broken output.

## What I Would Improve With More Time

If I had more time, I would improve the app by adding:

- Question difficulty levels, such as junior, mid-level, and senior
- Question categories, such as behavioral, technical, and situational
- Copy-to-clipboard functionality
- Recent search history
- More polished animations and UI transitions
- Automated tests for the API route and response validation
- Rate limiting to protect the API from abuse

## Building Philosophy

My approach to building is to start with the user problem first, then create the simplest working version that solves it clearly. I prefer clean code, readable structure, and practical decisions over unnecessary complexity.

For this project, I focused on:

- Making the app functional
- Keeping the UI simple
- Protecting the API key
- Returning structured AI output
- Handling errors clearly
- Writing code another developer can understand

## License

MIT
