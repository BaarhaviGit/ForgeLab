# ForgeLab - Engineering Simulation Sandbox

**ForgeLab lets you break systems on purpose, so you learn to build ones that don't break in production.**

Right now, if you want to understand why a database becomes a bottleneck, or why adding a cache actually helps, you either:
1. Read a blog post about it (theory, no hands-on feel), or
2. Break something in production and learn the hard way (expensive, risky, terrifying).

ForgeLab gives you a third option: pick an architecture, run traffic through it, break it on purpose, watch exactly what happens, fix it, and immediately see the difference — all with zero real-world risk.

---

## 🚀 How it Helps People

* **Students learning system design:** Instead of memorizing "add a cache to reduce DB load", they watch it happen. Latency numbers move in front of them.
* **Interview Prep:** Interviewers ask "what would you do if this service got 10x traffic?" ForgeLab lets you actually simulate that instead of guessing out loud.
* **Engineers and DevOps:** Before committing to adding Redis or a read replica in a real production system, sanity-check the tradeoff (performance vs cost) in a sandbox first.
* **Educators:** A lab-style teaching tool. Run a live failure in front of a class and ask "so what should we add here?"

---

## 🛠️ The Working Loop (Build, Break, Fix, Compare)

1. **Pick a template** — a pre-built system architecture (e.g. Client → Load Balancer → API → Database).
2. **Configure it** — sliders/toggles for CPU, replicas, cache on/off, traffic load.
3. **Run the simulation** — our engine computes realistic latency, throughput, error rate, and cost based on that config.
4. **Break it** — inject a failure (DB crash, traffic spike) and watch the metrics degrade live.
5. **Fix it** — flip on caching, add a replica, re-run.
6. **Compare** — side-by-side before/after: *"Latency dropped from 420ms → 110ms, availability went from 95% → 99.9%, cost went up by $30."*

---

## 👥 Hackathon Team Split (3 Roles)

To build this in one week, the project is cleanly split into three vertical slices with clear handoff points.

### 🧑‍💻 Person A — Backend & Orchestration
**Owns:** `backend/src/index.ts`, `routes/`, project/config storage
* **Responsibilities:**
  * Set up Express server + CORS + routes.
  * `POST /simulate` — receives config, calls the simulation engine, returns metrics.
  * `POST /simulate/failure` — receives config + failure type, mutates config, returns degraded metrics.
  * `GET /templates` — returns the 3-4 predefined architectures.
  * Store/retrieve current project config.
* **Deliverable:** A working API that Person B can hit with `fetch()` and get real JSON back.
* *(Depends on Person C's `calculateMetrics()` function — can stub with fake numbers initially)*

### 🎨 Person B — Frontend
**Owns:** `frontend/` — everything the user sees and clicks
* **Responsibilities:**
  * Template picker page (4 cards, pick one).
  * Config panel — sliders/toggles for CPU, replicas, cache, traffic load.
  * "Run Simulation" button → calls Person A's `/simulate` endpoint.
  * Results dashboard — Recharts bar/line charts for latency, throughput, error rate, cost.
  * Failure buttons (DB Crash, Traffic Spike) → calls `/simulate/failure`.
  * Before/after comparison view (two metric sets side by side).
* **Deliverable:** Full clickable flow from template → configure → run → break → fix → compare.
* *(Depends on Person A's API being live — can build against mock JSON data first)*

### 🧮 Person C — Simulation Logic
**Owns:** `backend/src/simulation/` — the math brain of the whole product
* **Responsibilities:**
  * `engine.ts` — the core formulas:
    * `latency = baseLatency + (trafficLoad / capacity) * loadFactor`
    * `errorRate` rises sharply once load exceeds capacity.
    * `cost` scales with replicas/CPU/cache enabled.
    * `throughput` caps out based on capacity.
  * `failures.ts` — failure injection functions (e.g. DB crash = capacity → near 0, traffic spike = trafficLoad × 5).
  * `explanations.ts` — canned "AI-style" text per failure type.
  * Tune numbers so before/after actually looks dramatic and believable in the demo.
* **Deliverable:** Pure functions Person A can import and call directly — no server knowledge needed.
* *(Depends on Nobody. Can start immediately in isolation on Day 1)*

---

## ⚙️ Local Setup Instructions

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
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)
