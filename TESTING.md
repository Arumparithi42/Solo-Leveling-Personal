# Solo Leveling App — Setup & Testing Guide

## 1. Backend setup

```bash
cd backend
npm install
```

Edit `.env` and put in your real MongoDB Atlas URI (make sure the database
name in the URI is `SoloLevelingUsers`):

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/SoloLevelingUsers?retryWrites=true&w=majority
PORT=5000
```

Start it:

```bash
npm run dev     # requires devDependency nodemon, or:
npm start
```

On first run, since the `users` collection is empty, you should see:

```
MongoDB connected: <cluster-host>
Seeded default user into SoloLevelingUsers.users
Penalty cron jobs scheduled (daily 00:00, weekly Monday 00:00)
Server running on http://localhost:5000
```

Check `SoloLevelingUsers.users` in Atlas — there should be exactly one
document with the default quests, `penalty: 0`, empty `todoList`, etc.

## 2. Frontend setup

```bash
cd "Solo Leveling"
npm install
npm run dev
```

By default the frontend calls `http://localhost:5000/api`. If your backend
runs elsewhere, create `Solo Leveling/.env`:

```
VITE_API_URL=http://your-backend-host:5000/api
```

## 3. Postman testing

Import these requests (base URL `http://localhost:5000/api`):

| Method | URL | Body | Expected |
|---|---|---|---|
| GET | `/user` | — | Full user document |
| PUT | `/daily/:missionId` | — | Toggles that mission, returns updated user with recalculated `dailyprogress` |
| PUT | `/bonus/:missionId` | — | Toggles bonus mission; if `bonusprogress` newly hits 100, `penalty` drops by 1 |
| PUT | `/weekly/:missionId` | — | Toggles weekly mission, recalculates `weeklyprogress` |
| GET | `/todo` | — | Array of todos |
| POST | `/todo` | `{ "title": "Read a book", "description": "20 pages" }` | 201, returns updated todo array |
| PUT | `/todo/:id` | `{ "title": "New title", "description": "New desc" }` | Updated todo array |
| PUT | `/todo/toggle/:id` | — | Flips `completed` on that todo |
| DELETE | `/todo/:id` | — | Removes it, returns remaining array |
| GET | `/penalty` | — | `{ penalty, compensate }` |
| POST | `/compensate` | `{ "description": "Did 30 min extra study" }` | 200 if `penalty > 0`, decrements penalty by 1, logs entry; 400 if `penalty` is already 0 |

To get a `missionId`/todo `id`, call `GET /api/user` first and copy the
`_id` of the mission/todo subdocument you want to act on — Mongoose
auto-generates these.

### Things worth specifically verifying

1. **Progress is server-calculated**: toggle 3 of 4 daily missions and
   confirm `dailyprogress` comes back as `75`, not something you sent.
2. **Bonus unlock**: complete all 4 daily missions via Postman/UI — the
   frontend's Home page should now render `BonusDailyQuest` (it only shows
   when `dailyprogress === 100`).
3. **Penalty reduction**: complete all 4 bonus missions with `penalty`
   starting above 0 (compensate down first, or wait for a cron tick) and
   confirm `penalty` decreases by exactly 1 the moment `bonusprogress` hits
   100 — and does **not** decrease again if you keep toggling at 100%.
4. **Compensate guard**: call `POST /api/compensate` when `penalty` is 0 —
   should return 400, not go negative.
5. **Cron (manual test)**: temporarily change the cron expression in
   `backend/cron/penaltyCron.js` to something like `*/1 * * * *` (every
   minute) to watch the daily reset fire without waiting until midnight,
   then change it back afterward.

## 4. Frontend manual testing

1. Load `/` — you should see Daily Quest, Weekly Quest, and Penalty cards
   populated from the backend (not hardcoded).
2. Click "Done?" on a daily mission — the button should flip to
   "Completed ✅" and the progress percentage should update from the
   server's response.
3. Complete all 4 daily missions — Bonus Daily Quest should appear.
4. Go to `/todo` — add, edit, toggle, and delete a todo; refresh the page
   and confirm the list persists (it's coming from MongoDB, not local
   state).
5. If `penalty > 0`, the Penalty card shows a description input and
   "Compensate" button; submitting it should reduce the penalty count and
   clear the input. If `penalty` is 0, the input/button should be hidden.

## 5. Known environment note

This container's `npm install` for the frontend pulled down a `rolldown`
native binding that isn't compatible with this sandbox's architecture, so
`vite build` couldn't be run here to produce a final bundle. The code was
verified with ESLint (clean, no errors) and the backend was verified with
`node --check` on every file plus a real `npm install`. Run `npm run dev`
/ `npm run build` on your own machine to build and serve it normally.
