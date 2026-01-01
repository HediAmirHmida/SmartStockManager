# 🚀 Deployment Guide - Vercel + Supabase

This guide will walk you through deploying your Smart Stock Manager to Vercel with Supabase as your cloud database.

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (sign up at [vercel.com](https://vercel.com))
3. ✅ Supabase account (sign up at [supabase.com](https://supabase.com))
4. ✅ Node.js and npm installed locally

---

## 🗄️ Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `smart-stock-manager` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be created

### 1.2 Get Your Database Connection Strings

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **"Connection string"** section
3. Copy the **"URI"** connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
4. Also copy the **"Direct connection"** string (for migrations)

### 1.3 Update Your Local .env File (Optional - for testing)

If you want to test with Supabase locally:

```env
# Supabase Connection (Production)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true"
```

**Note**: Replace `[YOUR-PASSWORD]` with your actual database password and `xxxxx` with your project reference.

---

## 🔄 Step 2: Run Database Migrations on Supabase

### 2.1 Update Prisma Schema (Already Done ✅)

The schema has been updated to use PostgreSQL. If you need to switch back to SQLite for local development, see the "Local Development" section below.

### 2.2 Push Schema to Supabase

Run this command to create all tables in your Supabase database:

```bash
npx prisma db push
```

Or create a migration:

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy
```

### 2.3 Verify Tables Created

1. Go to Supabase Dashboard → **Table Editor**
2. You should see: `User`, `Category`, `Item`, `Sale` tables

---

## 🔐 Step 3: Set Up GitHub Secrets

### 3.1 Get Vercel Credentials

1. Go to [vercel.com](https://vercel.com) → **Settings** → **Tokens**
2. Create a new token (name it "GitHub Actions")
3. Copy the token

### 3.2 Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VERCEL_TOKEN` | Your Vercel token | Vercel Settings → Tokens |
| `VERCEL_ORG_ID` | Your Vercel org ID | Vercel project settings URL |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | Vercel project settings URL |
| `DATABASE_URL` | Supabase connection string | Supabase Settings → Database |
| `DIRECT_URL` | Supabase direct connection | Supabase Settings → Database |

**To find Vercel IDs:**
- After connecting your project to Vercel, go to project settings
- The URL will be: `https://vercel.com/[org-id]/[project-id]/settings`
- Or check the `.vercel/project.json` file after running `vercel link`

---

## 🚀 Step 4: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended - Uses CI/CD)

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./` (default)
     - **Build Command**: `prisma generate && next build`
     - **Install Command**: `npm install`

2. **Add Environment Variables in Vercel:**
   - In project settings, go to **Environment Variables**
   - Add:
     - `DATABASE_URL` = Your Supabase connection string
     - `DIRECT_URL` = Your Supabase direct connection string
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

3. **Deploy:**
   - Push to `main` branch
   - GitHub Actions will automatically deploy via the workflow
   - Or click **"Deploy"** in Vercel dashboard

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
```

---

## ✅ Step 5: Verify Deployment

1. **Check Vercel Deployment:**
   - Go to your Vercel dashboard
   - Check the deployment logs for any errors

2. **Test Your App:**
   - Visit your deployed URL (e.g., `https://your-app.vercel.app`)
   - Try signing up a new user
   - Verify the user appears in Supabase Dashboard → **Table Editor** → **User** table

3. **Check Database:**
   - Go to Supabase Dashboard → **Table Editor**
   - Verify data is being created

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"

**Solution:**
- Check that `DATABASE_URL` and `DIRECT_URL` are correctly set in Vercel
- Verify your Supabase database is not paused
- Check Supabase project status

### Issue: "Migration failed"

**Solution:**
- Run `npx prisma migrate deploy` locally with Supabase connection
- Or use `npx prisma db push` to sync schema

### Issue: "Build failed"

**Solution:**
- Check that `prisma generate` runs before `next build`
- Verify all environment variables are set
- Check build logs in Vercel dashboard

---

## 💻 Local Development Options

### Option 1: Use Supabase for Local Dev (Recommended)

Use the same Supabase database for local development:

```env
# .env (local)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true"
```

### Option 2: Use SQLite for Local Dev

If you prefer SQLite locally:

1. **Create a separate schema file** or switch before running locally:

```prisma
// prisma/schema.prisma (for local)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Update .env:**
```env
DATABASE_URL="file:./dev.db"
```

3. **Before deploying, switch back to PostgreSQL:**
```prisma
// prisma/schema.prisma (for production)
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**Note**: This requires manual switching. Option 1 is easier!

---

## 📝 Environment Variables Summary

### Required for Production (Vercel):

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
```

### Required for GitHub Actions:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DATABASE_URL`
- `DIRECT_URL`

---

## 🎉 You're Done!

Your app should now be:
- ✅ Deployed on Vercel
- ✅ Connected to Supabase
- ✅ Users can sign up and login
- ✅ Data persists in the cloud

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/using-prisma-with-supabase)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🔄 Updating Your App

After making changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **GitHub Actions will automatically deploy** (if workflow is set up)

3. **Or deploy manually:**
   ```bash
   vercel --prod
   ```

---

**Need Help?** Check the troubleshooting section or review the error logs in Vercel/Supabase dashboards.

