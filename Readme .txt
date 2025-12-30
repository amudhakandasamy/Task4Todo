
Task link:

https://docs.google.com/document/d/1P3B7NElqxZakNAaDfm0coN2UNt--6f5XoxzF3Qw_AZM/edit?usp=sharing


Deployed link:





Task description:

Big picture
- Single-page, client-side web app: `index.html` + `style.css` + `script.js`.
- State is persisted in browser `localStorage` under the key `transactions` (JSON array).
- Each transaction: { id: number (Date.now), type: 'income'|'expense', description: string, amount: number }.
- No build system or server: open `index.html` in a browser or use VS Code Live Server for quick iteration.

Where to look / important files
- `index.html` — DOM structure, form fields (`#type`, `#description`, `#amount`, `#entry-id`) and filters (radio inputs).  Add/remove UI elements here.
- `script.js` — All app logic (CRUD, rendering, summarization). Important functions:
  - `addOrUpdateTransaction(e)` — handles add and update flows (uses hidden `#entry-id`).
  - `editTransaction(id)` — loads transaction into form and sets button text to "Update Entry".
  - `deleteTransaction(id)` — removes transaction and re-renders.
  - `renderTransactions()` — reads filter radio state and rebuilds the entries list.
  - `updateSummary()` — recalculates totals and net balance.
  - `saveTransactions()` / `transactions` variable — single source of truth stored in localStorage.
- `style.css` — styling and responsive rules for layout.

Project-specific patterns & conventions
- Local persistence: Always read/write the same `transactions` key in `localStorage` — changing the key will orphan existing data.
- Editing flow: `entry-id` hidden input signals update vs create. When populated, `addOrUpdateTransaction` updates the matching id.
- IDs are numeric timestamps (Date.now()). Code searches by `transaction.id` using strict equality with number types.
- Currency: `formatCurrency` uses `Intl.NumberFormat('en-IN', { currency: 'INR' })` — keep formatting consistent when adding UI outputs.
- Validation: description required; amount must be > 0. The code displays an alert on invalid input.

Testing & debugging workflow
- Quick manual testing: open `index.html` and interact; use DevTools → Application → Local Storage to inspect `transactions`.
- Live reload: use the VS Code Live Server extension or `npx live-server` for faster iteration.
- Useful quick checks: log `transactions` in console in `addOrUpdateTransaction`, `deleteTransaction`, or `renderTransactions` to confirm state transitions.
