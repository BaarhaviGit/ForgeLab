# ForgeLab - Engineering Simulation Sandbox

ForgeLab is a lightweight engineering simulation sandbox designed to help teams visually experiment with system architectures. Users can choose predefined architecture templates, tweak configurations (CPU, replicas, cache, etc.), run load simulations, and inject failures (like a database crash or a traffic spike) to observe the effects on latency, throughput, error rates, and costs.

This project was built for a 1-week hackathon. It is structured to be lean, functional, and easy for a 3-person team to collaborate on.

## Project Structure

The repository is divided into two main parts:

- `frontend/`: A Next.js application using Tailwind CSS, Recharts for metrics, and TypeScript.
- `backend/`: A Node.js + Express API built with TypeScript that handles the simulation logic.

## Prerequisites

- Node.js (v18 or newer recommended)
- npm

## Getting Started

1. **Install dependencies for all projects:**
   Run the following from the root directory to install root, frontend, and backend dependencies:
   ```bash
   npm run install:all
   ```

2. **Run both applications concurrently:**
   Start the Next.js frontend and Express backend at the same time:
   ```bash
   npm run dev
   ```

3. **View the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

## Team Work Division

To make the most of the 1-week hackathon, the 3 developers can divide the work as follows:

1. **Frontend & UI Developer (Next.js & Tailwind)**
   - **Focus:** Build out the UI in `frontend/app/` and `frontend/components/`.
   - **Tasks:**
     - Make the UI look modern and premium (use dark modes, smooth gradients, animations).
     - Wire up the sliders and toggles in `ConfigPanel.tsx`.
     - Polish the dashboard and integrate `MetricsChart.tsx` using Recharts to show before/after comparisons.
     - Connect frontend state to `lib/api.ts` to call the backend.

2. **Backend API & Integration Developer (Express)**
   - **Focus:** Set up endpoints and handle data flow in `backend/src/routes/` and `backend/src/index.ts`.
   - **Tasks:**
     - Ensure the `simulate.ts` and `templates.ts` routes correctly parse requests and return standardized JSON responses.
     - Handle CORS and error states.
     - Set up `data/templates.json` with 3-4 sensible default architectures (e.g., Basic, Load Balanced, Cached).

3. **Simulation Logic Developer (TypeScript engine)**
   - **Focus:** Implement the core simulation math and failure logic in `backend/src/simulation/`.
   - **Tasks:**
     - Build formula-based models in `engine.ts` to calculate latency, throughput, error rate, and cost based on `ArchitectureConfig`.
     - Implement failure injection in `failures.ts` (e.g., temporarily mutating configuration to simulate a DB crash or traffic spike).
     - Write contextual AI-style explanation strings in `explanations.ts`.
