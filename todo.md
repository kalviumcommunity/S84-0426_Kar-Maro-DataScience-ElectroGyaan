# 🚀 AI Energy Analytics Platform - Sprint Task Board

**Team Members:**
*   🎨 **Rohit:** Frontend Specialist (React, UI/UX)
*   ⚙️ **Mannat:** Backend & ML Engine (Node.js, Python, Data Science)
*   🧠 **Kartikay:** Full-Stack Lead & Integration (Frontend, Backend, ML, DevOps)

---

## 🎨 ROHIT'S TASKS (20 PRs - Frontend UI & Logic)
*Focus: Building a responsive, interactive dashboard and implementing the meme alert.*

- [ ] **PR 1:** Initialize Vite/React project, clean boilerplate, setup folder structure.
- [ ] **PR 2:** Install and configure Tailwind CSS and verify it's working.
- [ ] **PR 3:** Create Base Layout component (Navbar + Main Content Area).
- [ ] **PR 4:** Create `Dashboard.jsx` skeleton with CSS Grid/Flexbox layout.
- [ ] **PR 5:** Setup Axios client instance (`apiClient.js`) with base URL.
- [ ] **PR 6:** Build static `KPICards.jsx` (Current Usage, Status, Total).
- [ ] **PR 7:** Install Recharts and create static `RealTimeChart.jsx` with dummy data.
- [ ] **PR 8:** Build static `AnomalyFeed.jsx` (Sidebar list UI).
- [ ] **PR 9:** Build static `PredictionWidget.jsx` UI (AI forecast card).
- [ ] **PR 10:** Create `MemeAlertModal.jsx` skeleton layout and Tailwind overlay.
- [ ] **PR 11:** Add `meme.jpg` and `alert.mp3` to `/public` and link them in the modal.
- [ ] **PR 12:** Implement Dashboard State Management (`useState` for energy data).
- [ ] **PR 13:** Implement API polling (`useEffect` with `setInterval` every 5 sec).
- [ ] **PR 14:** Connect `RealTimeChart` to real fetched state data.
- [ ] **PR 15:** Connect `AnomalyFeed` to real fetched state data (filter anomalies).
- [ ] **PR 16:** Connect `PredictionWidget` to backend `/predict` endpoint.
- [ ] **PR 17:** Add logic to draw red dots on Recharts when `isAnomaly` is true.
- [ ] **PR 18:** Implement Meme Audio Trigger (detect new anomaly -> play sound -> show modal).
- [ ] **PR 19:** Add Loading Spinners (while waiting for initial API fetch).
- [ ] **PR 20:** Mobile responsiveness polish (stack grids on small screens).

---

## ⚙️ MANNAT'S TASKS (20 PRs - Backend DB & ML Core)
*Focus: Building the databases, APIs, and the AI models.*

- [ ] **PR 21:** Initialize Node.js/Express project and install dependencies.
- [ ] **PR 22:** Setup basic Express server and `GET /health` route.
- [ ] **PR 23:** Setup MongoDB connection logic (`config/db.js`).
- [ ] **PR 24:** Create Mongoose Schema (`models/EnergyData.js`).
- [ ] **PR 25:** Implement Express `GET /api/energy/history` route.
- [ ] **PR 26:** Setup Python Anaconda environment and `requirements.txt`.
- [ ] **PR 27:** Initialize FastAPI server (`main.py`) with basic ping route.
- [ ] **PR 28:** Write script to generate dummy 30-day historical CSV for training.
- [ ] **PR 29:** Setup Jupyter Notebook and load CSV using Pandas.
- [ ] **PR 30:** Implement Cyclical Feature Engineering (hour/day sin/cos) in Jupyter.
- [ ] **PR 31:** Train Isolation Forest model in Jupyter and export `iso_model.pkl`.
- [ ] **PR 32:** Train Linear Regression model in Jupyter and export `lr_model.pkl`.
- [ ] **PR 33:** Create Pydantic schemas (`schemas.py`) for FastAPI input validation.
- [ ] **PR 34:** Implement FastAPI `POST /api/ml/anomaly` endpoint (loads model + predicts).
- [ ] **PR 35:** Implement FastAPI `POST /api/ml/predict` endpoint (loads model + predicts).
- [ ] **PR 36:** Connect Node.js backend to FastAPI for anomaly check via Axios.
- [ ] **PR 37:** Implement full `POST /api/energy/ingest` in Express (calls ML -> saves to DB).
- [ ] **PR 38:** Implement Express `GET /api/energy/predict` (calls FastAPI -> returns to frontend).
- [ ] **PR 39:** Add error handling middleware in Express for failed ML calls.
- [ ] **PR 40:** Add global exception handlers in FastAPI for bad data payloads.

---

## 🧠 KARTIKAY'S TASKS (20 PRs - Full Stack, Integration & DevOps)
*Focus: Setting up architecture, building the simulator, code review, and deployment.*

- [ ] **PR 41:** Setup GitHub repository, `.gitignore`, branches, and README scaffolding.
- [ ] **PR 42:** Implement `simulator.js` (Basic script logging random numbers every 5s).
- [ ] **PR 43:** Upgrade Simulator: Add Axios to POST data to the Node.js ingest route.
- [ ] **PR 44:** Upgrade Simulator: Add realistic cyclical time patterns (morning/night curves).
- [ ] **PR 45:** Upgrade Simulator: Inject 5% probability of generating anomaly spikes.
- [ ] **PR 46:** CORS Configuration (Allow Frontend -> Backend -> ML Service).
- [ ] **PR 47:** Setup `.env` files for all 3 environments (Frontend, Node, Python).
- [ ] **PR 48:** End-to-End Test 1: Simulator to DB pipeline (Fix any data type bugs).
- [ ] **PR 49:** Code Review & fix: Implement timeout handling in Node.js if ML service sleeps.
- [ ] **PR 50:** Code Review & fix: Optimize Mongoose indexes for faster chart rendering.
- [ ] **PR 51:** Add automated DB cleanup (cron job or script to delete records > 7 days old).
- [ ] **PR 52:** Write Postman Workspace/Collection for the team to test APIs.
- [ ] **PR 53:** Code Review & fix: Resolve React `useEffect` memory leaks/cleanup functions.
- [ ] **PR 54:** Full-Stack Integration Test: Ensure meme triggers correctly with simulator data.
- [ ] **PR 55:** Prepare ML Service Deployment: Render YAML & Gunicorn configuration.
- [ ] **PR 56:** Prepare Backend Deployment: Render Web Service configuration.
- [ ] **PR 57:** Prepare Frontend Deployment: Vercel configuration & build commands.
- [ ] **PR 58:** Update all deployed environment variables (API Keys, MongoDB URIs).
- [ ] **PR 59:** Production Bug Fixes (Fixing mixed content or cross-origin errors in prod).
- [ ] **PR 60:** Finalize `README.md` with system architecture, setup steps, and team credits.

---

### 🛡️ GIT WORKFLOW RULES FOR THE TEAM
1. **Never push to `main` directly.**
2. Make a new branch for your task: `git checkout -b feature/rohit-kpicards` or `bugfix/mannat-db-error`.
3. When done, commit and push: `git commit -m "Added KPI Cards"` -> `git push origin feature/rohit-kpicards`.
4. Go to GitHub and open a **Pull Request (PR)**.
5. **Kartikay** will review the PR. Once approved, merge it into `main`.