# Hostelite Attendance

QR check-in for a hostel. Next.js, Prisma, PostgreSQL, and Vercel Blob for student photos.

## What you need

- A [GitHub](https://github.com/taiwomubarak/hostelite-attendance) repo (already pushed)
- A [Vercel](https://vercel.com) account (GitHub login is easiest)
- A PostgreSQL database (created from Vercel, which uses Neon)
- Vercel Blob for photos (the Vercel disk is not writable)

SQLite will not work on Vercel. Serverless deploys do not keep a local `.db` file.

## 1. Create the Vercel project

1. Open [vercel.com/new](https://vercel.com/new)
2. Import `taiwomubarak/hostelite-attendance`
3. Framework preset: Next.js
4. Do not click Deploy yet. Add storage and env vars first.

## 2. Create PostgreSQL

1. In the project, open Storage
2. Create a new Postgres store (Vercel Postgres / Neon)
3. Connect it to this project for Production, Preview, and Development
4. Vercel will inject `POSTGRES_URL` or `DATABASE_URL`. You still set the names this app expects.

Copy two connection strings from the database:

- Pooled connection (often labeled pooled, or has `pgbouncer=true`)
- Direct connection (unpooled), used by Prisma migrations

If you only see one URL, use that same value for both `DATABASE_URL` and `DIRECT_URL`.

## 3. Create Blob storage

1. In Storage, create a Blob store
2. Connect it to this project
3. Vercel injects `BLOB_READ_WRITE_TOKEN`

Photos then upload to Blob. Without this token, the app tries `public/uploads`, which does not persist on Vercel.

## 4. Set environment variables

In Vercel: Project Settings, Environment Variables. Apply them to Production and Preview.

| Name | Example | Notes |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://...@.../neondb?sslmode=require` | Pooled URL if you have one |
| `DIRECT_URL` | `postgresql://...@.../neondb?sslmode=require` | Direct URL. Same as `DATABASE_URL` if you only have one |
| `AUTH_SECRET` | 64 random characters | Required. Production refuses short or known placeholder values |
| `AUTH_URL` | `https://your-app.vercel.app` | Your live origin. Update again if you add a custom domain |
| `ADMIN_USERNAME` | `admin` | Login name |
| `ADMIN_PASSWORD` | 12+ character password | Used when you seed. Never `changeme` |
| `BLOB_READ_WRITE_TOKEN` | from Blob store | Auto-filled if Blob is connected |

Create `AUTH_SECRET` on your computer:

```powershell
$env:PATH = "C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;" + $env:PATH
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the printed hex string as `AUTH_SECRET`. Do not commit it.

After the first deploy, Vercel gives you a URL like `https://hostelite-attendance.vercel.app`. Put that exact origin in `AUTH_URL` (no trailing slash). Redeploy after you set it.

## 5. Deploy

1. Click Deploy
2. Build runs `prisma generate`, `prisma migrate deploy`, Less compile, then `next build`
3. The first successful deploy creates the `Admin`, `Student`, and `Attendance` tables

If migrate fails, `DATABASE_URL` or `DIRECT_URL` is wrong. Check sslmode=require and that the database is linked to Production.

## 6. Create the admin user

Vercel does not run seed by itself. From this project folder, point Prisma at the production database once.

```powershell
$env:PATH = "C:\Users\DELL\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;" + $env:PATH
cd "C:\Users\DELL\ID card"
$env:DATABASE_URL = "paste-production-DATABASE_URL"
$env:DIRECT_URL = "paste-production-DIRECT_URL"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "your-long-production-password"
$env:NODE_ENV = "production"
npx prisma db seed
```

Then open `https://your-app.vercel.app/login` with that username and password.

## 7. Local development against the same database

Copy `.env.example` to `.env`. Paste the Development connection strings from Vercel (or the same Neon database).

```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="same-random-secret-or-another-32-plus-chars"
AUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-local-password"
BLOB_READ_WRITE_TOKEN="optional-for-local-photos"
```

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. If `BLOB_READ_WRITE_TOKEN` is empty, photos save under `public/uploads` on your PC only.

## 8. After go-live

1. Log in at `/login`
2. Add students with photos
3. Print or show the on-screen ID card QR
4. Use `/` as the kiosk scan page
5. Keep `/login` off guest Wi-Fi if you can
6. Add a custom domain in Vercel, then update `AUTH_URL` to `https://that-domain` and redeploy

## Commands

| Command | Use |
| --- | --- |
| `npm run dev` | Local app |
| `npm run build` | Production build, including migrations |
| `npm run start` | Serve the production build |
| `npx prisma migrate deploy` | Apply migrations to the current `DATABASE_URL` |
| `npm run db:seed` | Create or update the admin user |

## Files that must never go to Git

- `.env`
- real `AUTH_SECRET` and `ADMIN_PASSWORD`
- `prisma/dev.db` (old local SQLite, unused on Vercel)
