# Financial Management (Angular 16)

Financial Management is a modern Angular web app for personal finance tracking. Manage multiple cards and a wallet, add income/expense transactions by category, and visualize trends on an analytics dashboard with Expense, Income, and Net views. The app features month/year filters, optional inclusion of wallet data in charts, and a smooth UI powered by Angular Material, Bootstrap, Swiper, and Toastr. Sensitive card fields are handled with client‑side CryptoJS decryption. Built with Angular CLI and ready for deployment to GitHub Pages.

> Design inspiration: [Figma community file](https://www.figma.com/community/file/1496029882992276524)

## Features

- Dashboard analytics with ApexCharts (Expense, Income, Net; 5‑day buckets per month)
- Manage multiple cards and view recent transactions per card
- Optional wallet data inclusion in analytics
- Category‑based income/expense entry via dialog
- Month/year filtering with dynamic month list up to current month
- Auth flow with login redirect and reset‑password UI
- Toastr notifications and responsive layout

## Tech Stack

- Angular 16, Angular Material, Bootstrap
- Charts: ng‑apexcharts (ApexCharts); Highcharts available
- Utilities: RxJS, CryptoJS, ngx‑toastr, Swiper, ng‑bootstrap

## Getting Started

Prerequisites: Node.js 18+, npm, Angular CLI (`npm i -g @angular/cli`).

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm start
   ```
   Visit `http://localhost:4200/`.

## Scripts

- `npm start` — Run locally with live reload
- `npm run json:serve` — Start mock API from `user.json` on `http://localhost:3000`
- `npm run build` — Production build to `dist/`
- `npm run build:prod` — Build with GitHub Pages base‑href
- `npm run build:git` — Publish `dist/financial-management` to GitHub Pages

## Mock API (json-server)

Serve the `user.json` as a REST API for local development:

```bash
npm run json:serve
```

- Base URL: `http://localhost:3000`
- Endpoints are inferred from keys inside `user.json` (e.g., `/users`, `/cards`, etc.).
- You can combine this with the Angular dev server by running both commands in separate terminals.

### Detailed steps

1) Install dependencies (includes `json-server` as a devDependency):
```bash
npm install
```

2) Start the mock API from `user.json` on port 3000:
```bash
npm run json:serve
```

3) In a second terminal, start the Angular app:
```bash
npm start
```

4) Example requests (assuming `user.json` contains these collections):
```bash
# List users
curl http://localhost:3000/users

# Get a single user
curl http://localhost:3000/users/1

# Filter by field (e.g., userId)
curl "http://localhost:3000/transactions?userId=1"

# Create a new record
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Groceries"}'
```

5) Useful query params supported by json-server:
- `_page` and `_limit` for pagination (e.g., `? _page=1&_limit=10`)
- `q` for full-text search (e.g., `?q=wallet`)
- Sort: `_sort` and `_order` (e.g., `?_sort=time&_order=desc`)

6) Change the port (optional):
```bash
npx json-server --watch user.json --port 4000
```

Notes:
- Changes via POST/PUT/PATCH/DELETE persist to `user.json`.
- CORS is enabled by default; no extra configuration needed for local usage.
- If you prefer a single command to run both servers, consider adding `concurrently` and a combined script.

## Deploy to GitHub Pages

1. Build with base href:
   ```bash
   npm run build:prod
   ```
2. Publish the built app:
   ```bash
   npm run build:git
   ```

## Notes

- Card numbers and CVV are decrypted on the client using CryptoJS after retrieval.
- Demo data/endpoints can be adapted via services in `src/app/services/` and interfaces in `src/app/interface/`.
