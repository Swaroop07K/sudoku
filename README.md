
# Minimalist Sudoku AI

A sleek, modern Sudoku application built with React, TypeScript, and Tailwind CSS. It features a unique AI hint system powered by Google's Gemini 3 Flash model.

## Features

- **Responsive Minimalist UI**: Designed for both desktop and mobile.
- **Dynamic Puzzle Generation**: Three difficulty levels (Easy, Medium, Hard).
- **AI-Powered Hints**: Uses Gemini 3 to analyze the current board state and explain the logic for the next move.
- **Real-time Validation**: Errors are highlighted if you enter a number that doesn't match the solution.
- **Smart Highlighting**: Visual cues for selected cells and AI suggested moves.

## Getting Started

### Prerequisites

- Node.js 18+
- An API Key for Gemini (Google AI Studio)

### Installation

1. Clone the repository.
2. Set your `API_KEY` environment variable.
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

### Building with Docker

You can run this application using the provided Dockerfile.

```bash
# Build the image
docker build -t sudoku-ai .

# Run the container
docker run -p 8080:80 sudoku-ai
```

The app will be available at `http://localhost:8080`.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Support**: Gemini API (@google/genai)
