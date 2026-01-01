# 🚀 Deployment Steps - Vercel + GitHub Actions

## Step 1: Create Vercel Project

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository:**
   - Select your `smart-stock-manager` repository
   - Click "Import"
4. **Configure project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next` (default)
5. **DON'T deploy yet** - we need to add environment variables first
6. **Click "Cancel" or go back** - we'll deploy via GitHub Actions

---

## Step 2: Get Vercel Credentials

### 2.1 Get Vercel Token

1. Go to **Vercel Dashboard** → Click your profile → **Settings**
2. Go to **Tokens** tab
3. Click **"Create Token"**
4. Name it: `GitHub Actions`
5. **Copy the token** (you'll only see it once!)

### 2.2 Get Vercel Org ID and Project ID

**Option A: From Vercel Dashboard**
1. Go to your project in Vercel
2. Click **Settings** tab
3. Look at the URL: `https://vercel.com/[org-name]/[project-name]/settings`
   - The org name is your **ORG_ID** (or check Settings → General → Team ID)
   - The project name is your **PROJECT_ID** (or check Settings → General → Project ID)

**Option B: Using Vercel CLI** (if you have it installed)
```bash
vercel link
```
This creates a `.vercel/project.json` file with the IDs.

---

## Step 3: Add GitHub Secrets

1. **Go to your GitHub repository**
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions**
4. Click **"New repository secret"**
5. **Add these 5 secrets one by one:**

| Secret Name | Value | Notes |
|------------|-------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Step 2.1 | The token you created |
| `VERCEL_ORG_ID` | Your org/team ID | From Step 2.2 |
| `VERCEL_PROJECT_ID` | Your project ID | From Step 2.2 |
| `DATABASE_URL` | Your Supabase connection string | From your `.env` file |
| `DIRECT_URL` | Your Supabase direct connection | From your `.env` file |

**Important:** 
- Copy the exact connection strings from your `.env` file
- Make sure to include the password in the connection strings
- No quotes needed in GitHub secrets

---

## Step 4: Add Environment Variables in Vercel

1. **Go to your Vercel project dashboard**
2. Click **Settings** tab
3. Click **Environment Variables** (left sidebar)
4. **Add these variables for Production, Preview, and Development:**

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | Your Supabase connection string (same as GitHub secret) |
| `DIRECT_URL` | Your Supabase direct connection (same as GitHub secret) |

5. **Make sure to select all environments:** Production, Preview, Development
6. Click **"Save"**

---

## Step 5: Deploy!

### Option A: Automatic (Recommended)

1. **Commit and push to main branch:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Trigger on push to main
   - Build your project
   - Deploy to Vercel

3. **Check deployment:**
   - Go to **GitHub** → Your repo → **Actions** tab
   - Watch the workflow run
   - Go to **Vercel Dashboard** to see your deployment

### Option B: Manual Deploy (First Time)

If you want to test first:

1. **Go to Vercel Dashboard**
2. Click **Deployments** tab
3. Click **"Redeploy"** on the latest deployment
4. Or click **"Deploy"** button

---

## Step 6: Verify Deployment

1. **Check Vercel Dashboard:**
   - Go to your project
   - Check **Deployments** tab
   - Look for green "Ready" status

2. **Test your app:**
   - Visit your deployed URL (e.g., `https://your-app.vercel.app`)
   - Try signing up a new user
   - Check Supabase Dashboard → Table Editor → User table
   - You should see the new user! 🎉

3. **Check logs if there are errors:**
   - Vercel Dashboard → Deployments → Click on deployment → **Logs** tab

---

## ✅ Checklist

Before deploying, make sure:

- [ ] Vercel project created
- [ ] Vercel token created and copied
- [ ] Vercel Org ID found
- [ ] Vercel Project ID found
- [ ] All 5 GitHub secrets added
- [ ] Environment variables added in Vercel
- [ ] Code pushed to GitHub main branch
- [ ] GitHub Actions workflow runs successfully

---

## 🐛 Troubleshooting

### Error: "Vercel token invalid"
- Check that you copied the token correctly
- Make sure there are no extra spaces
- Create a new token if needed

### Error: "Build failed"
- Check Vercel deployment logs
- Make sure `DATABASE_URL` and `DIRECT_URL` are set in Vercel
- Verify Prisma schema is correct

### Error: "Database connection failed"
- Check that Supabase database is not paused
- Verify connection strings in Vercel environment variables
- Make sure passwords are correct in connection strings

### GitHub Actions not running
- Check that workflow file is in `.github/workflows/` folder
- Make sure you pushed to `main` branch
- Check GitHub Actions tab for any errors

---

## 🎉 Success!

Once deployed, your app will:
- ✅ Auto-deploy on every push to main
- ✅ Be accessible at `https://your-app.vercel.app`
- ✅ Connect to Supabase database
- ✅ Allow users to sign up and login

---

**Need help?** Check the deployment logs in Vercel or GitHub Actions!


