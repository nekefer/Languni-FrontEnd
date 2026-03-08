# Languni Frontend

React frontend for Languni - a language learning app that helps people learn **English, Spanish, or French** through interactive YouTube videos and songs.

## Features

- Interactive video player with synchronized, clickable subtitles
- Vocabulary building with dictionary definitions and translations
- User onboarding (native language, learning language, level, topics)
- Trending videos and songs discovery
- Progress tracking

## Tech Stack

- React 19 + Vite
- TanStack Router (file-based routing)
- Zustand (state management)
- Axios (API calls)

## Requirements

- Node.js 18+
- npm or yarn
- Backend API running at `http://localhost:8000`

## Installation

1. **Clone and navigate to the frontend directory**
   ```bash
   cd Languni-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Sentry DSN (optional, for error tracking):
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_SENTRY_DSN=your-sentry-dsn-here
   VITE_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/          # API service modules
├── components/   # React components
├── contexts/     # React Context (AuthContext)
├── hooks/        # Custom hooks
├── routes/       # File-based routes (TanStack Router)
├── stores/       # Zustand stores
├── styles/       # CSS files
└── utils/        # Utility functions
```
