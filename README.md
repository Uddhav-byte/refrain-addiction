# Refrain — Adaptive Addiction Recovery & Habit Transformation Platform

Refrain is a production-grade, full-stack application designed to aid in addiction recovery and habit transformation. It utilizes behavioral assessments, progress tracking, and a supportive community feature to help users build healthier habits.

## Features
- **Dynamic Behavioral Assessment Engine:** Multi-step onboarding quiz measuring addiction triggers, emotional states, and relapse risk. Generates personalized daily insights based on a Behavioral Signal Vector.
- **Real-Time Peer Support System:** Live, encrypted chat rooms with WebSockets. Features an emergency "Urge Surfing" tool with live community check-ins.
- **Analytics & Progress Tracker:** Relapse prevention dashboard featuring streak tracking, milestone badges, trigger heatmaps, and craving intensity logs.
- **Beautiful & Intuitive UI:** Built with React, Tailwind CSS, Shadcn UI, and Framer Motion, offering smooth transitions, micro-interactions, and a serene dark/light mode toggle.

## Tech Stack
### Frontend
- React 18+ (Vite)
- TypeScript
- Tailwind CSS
- Shadcn UI (Custom configured)
- Framer Motion
- Recharts

### Backend
- Python 3.11+
- FastAPI (Async)
- Pydantic v2
- MongoDB (Motor async driver)
- WebSockets

### Infrastructure
- Docker & Docker Compose

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Docker & Docker Compose

### Running with Docker Compose
The easiest way to start the entire stack is with Docker Compose.
```bash
docker-compose up --build
```
This will start MongoDB, the FastAPI backend (available at `http://localhost:8000`), and the React frontend (available at `http://localhost`).

### Manual Setup
#### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - macOS/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and adjust the variables. Ensure you have a running MongoDB instance.
6. Start the FastAPI server: `uvicorn app.main:app --reload`

#### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Project Structure
The repository is split into two main directories:
- `backend/`: FastAPI application containing core configurations, models, schemas, routers, services, and repositories following a clean architecture pattern.
- `frontend/`: React Vite application featuring custom Shadcn UI components, specialized hooks, Framer Motion animations, and routing logic.

## Security
- Authentication is handled via JWT tokens (Access and Refresh tokens).
- Passwords are encrypted using bcrypt.
- Rate limiting is configured using slowapi.
- CORS middleware is enabled to restrict unauthorized origins.

## License
MIT License
