# Nexachain AI — MERN Stack Developer Technical Assessment

Investment and referral-based platform built with MongoDB, Express.js, React.js, and Node.js, per the assessment brief.

## Project Structure

```
nexachain-assessment/
├── backend/                          Node/Express API
│   ├── config/db.js                  MongoDB connection
│   ├── models/                       Task 1: User, Investment, ReferralIncome, ROIHistory
│   ├── controllers/                  Task 2: auth, investment, dashboard, referral, history
│   ├── routes/                       Route definitions (JWT-protected where required)
│   ├── middleware/authMiddleware.js  JWT auth guard
│   ├── services/                     Task 3 & 5: ROI logic, level-income logic, cron job
│   └── server.js                     App entry point
├── frontend/                         Task 4: React dashboard (Vite)
└── Nexachain_API.postman_collection.json
```

## Project Setup Steps

### Backend
```bash
cd backend
cp .env.example .env      # fill in your own values, see Environment Variables below
npm install
npm run dev                # nodemon, or `npm start` for plain node
```
Server runs on `http://localhost:5000` by default. On startup it connects to MongoDB and schedules the daily ROI cron job (Task 5).

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Dashboard runs on `http://localhost:5173` by default (Vite's default port).

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random string |
| `JWT_EXPIRES_IN` | Token expiry, e.g. `7d` |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## API Documentation

Full request/response samples are in [`Nexachain_API.postman_collection.json`](./Nexachain_API.postman_collection.json) — import it into Postman. `{{baseUrl}}` and `{{token}}` are collection variables; `{{token}}` auto-populates from the Register/Login response via a test script.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a user (accepts optional `referredByCode`) |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/investments` | Private | Create an investment |
| GET | `/api/investments` | Private | List the logged-in user's investments |
| GET | `/api/dashboard` | Private | Total investments, ROI earned, level income earned, wallet balance |
| GET | `/api/referrals/direct` | Private | Direct referrals only |
| GET | `/api/referrals/tree` | Private | Complete nested referral tree (single `$graphLookup` query) |
| GET | `/api/roi-history` | Private | ROI credit history for the logged-in user |
| GET | `/api/referral-income` | Private | Referral/level income history for the logged-in user |

All private routes require `Authorization: Bearer <token>`.

## Business Logic (Task 3)

- **Daily ROI**: `roiAmount = investmentAmount * dailyROIPercentage / 100`, credited once per investment per calendar day. The ROI history record is inserted first — the unique `(investment, date)` index on `ROIHistory` rejects it if today's ROI was already credited — and the wallet balance / `totalROIEarned` are only updated after that insert succeeds. This ordering avoids needing a multi-document transaction while still preventing double credits.
- **Level income**: after ROI is credited, the referral hierarchy is walked upward from the investing user via `referredBy`, crediting each eligible ancestor a percentage of that ROI amount, recorded in `ReferralIncome`, and added to their `walletBalance` + `totalLevelIncomeEarned`.
- **Duplicate prevention**: `ROIHistory` has a unique compound index on `(investment, date)`. A duplicate credit attempt for the same investment/day fails with a Mongo duplicate-key error and is caught and skipped — this is what makes Task 5's cron job idempotent even on accidental re-runs.

## Cron Job (Task 5)

`node-cron` runs `0 0 * * *` (12:00 AM daily), calling the same service function used by Task 3. Idempotency is enforced at the database layer (see above), not just in application logic, so it holds even under concurrent/duplicate execution.

To test without waiting for midnight, temporarily import and call `processDailyROIForAllActiveInvestments()` from `services/roiService.js` in a scratch script, or change the cron expression temporarily (e.g. `* * * * *` for every minute).

## Assumptions Made During Development

1. **Level-income percentages**: the brief specifies that level income must be calculated and distributed across the referral hierarchy but does not give exact percentages or how many levels deep to go. I assumed **3 levels** at **5% / 3% / 2%** of the ROI amount respectively (defined in `services/referralIncomeService.js`), and that only accounts with `accountStatus: "Active"` are eligible to receive it.
2. **ROI History / Referral Income History read endpoints**: Task 2 only explicitly lists Auth, Investment, Dashboard, and Referral APIs. Task 4 explicitly requires **ROI History** and **Referral Income History** tables in the dashboard, which need a data source. I added two minimal private GET endpoints (`/api/roi-history`, `/api/referral-income`) to satisfy that stated Task 4 requirement — nothing else was added beyond what the tables need.
3. **Password field**: "Password (encrypted)" was implemented as a bcrypt hash (industry standard for this use case), stored in the `password` field.
4. **Investment completion**: an investment's `status` is automatically flipped from `Active` to `Completed` once `endDate` has passed, checked during the daily cron run.
5. **Referral code generation**: an 8-character random hex code is generated at registration and checked for uniqueness before assignment, since the brief didn't specify a generation scheme.
6. **Currency**: all amounts are treated as INR (₹) for display purposes only; no currency field exists in the schema since none was specified.
7. **No multi-document transactions**: MongoDB single-document writes are already atomic, so instead of wrapping the ROI history insert and the wallet update in a transaction, I insert the history record first and only update the wallet if that succeeds. This keeps duplicate-prevention intact without the overhead of session-based transactions. Trade-off: if the wallet update fails right after the history insert succeeds (rare — e.g. a crash mid-request), the two could briefly be out of sync; a production system would likely want a transaction or a reconciliation job for that edge case.
