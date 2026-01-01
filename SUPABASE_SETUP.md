# 🔌 Step-by-Step: Connect Local Project to Supabase

Let's connect your local project to Supabase step by step.

---

## 📋 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in (or create an account)

2. **Click "New Project"** (or the "+" button)

3. **Fill in the project details:**
   - **Project Name**: `smart-stock-manager` (or any name you like)
   - **Database Password**: Create a strong password ⚠️ **SAVE THIS PASSWORD!**
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for now

4. **Click "Create new project"**

5. **Wait 2-3 minutes** for Supabase to set up your project

---

## 🔑 Step 2: Get Your Connection Strings

1. **In your Supabase project dashboard**, click on **Settings** (gear icon) in the left sidebar

2. **Click "Database"** in the settings menu

3. **Scroll down to "Connection string"** section

4. **You'll see different connection options:**
   - **URI** - This is your `DATABASE_URL`
   - **Direct connection** - This is your `DIRECT_URL` (for migrations)

5. **Copy the connection strings:**
   - Click on the **"URI"** tab
   - Copy the connection string (it looks like: `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`)
   - Click on **"Direct connection"** tab
   - Copy that connection string too

   **Important**: Replace `[YOUR-PASSWORD]` in the connection string with the password you created!

---

## 📝 Step 3: Update Your Local .env File

1. **Open your `.env` file** in the project root (or create it if it doesn't exist)

2. **Replace the SQLite connection with Supabase:**

   ```env
   # Supabase Database Connection
   DATABASE_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
   DIRECT_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```

   **Replace:**
   - `[YOUR-PASSWORD]` with your actual database password
   - The connection strings with the ones you copied from Supabase

3. **Save the file**

---

## 🗄️ Step 4: Create Tables in Supabase

Now let's push your Prisma schema to Supabase to create all the tables.

1. **Open your terminal** in the project directory

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Push the schema to Supabase:**
   ```bash
   npx prisma db push
   ```

   This will create all your tables (User, Category, Item, Sale) in Supabase.

4. **You should see:**
   ```
   ✅ Your database is now in sync with your schema.
   ```

---

## ✅ Step 5: Verify Connection

1. **Check Supabase Dashboard:**
   - Go to **Table Editor** in your Supabase dashboard
   - You should see your tables: `User`, `Category`, `Item`, `Sale`

2. **Test your app locally:**
   ```bash
   npm run dev
   ```

3. **Try signing up:**
   - Go to `http://localhost:3000`
   - Navigate to signup page
   - Create a test user account

4. **Check if user was created:**
   - Go back to Supabase Dashboard → **Table Editor** → **User** table
   - You should see your new user! 🎉

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Solution:**
- Check that your Supabase project is not paused
- Verify the connection strings are correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
- Make sure your `.env` file is in the project root
- Restart your dev server after updating `.env`
- Check that there are no extra spaces in the connection string

### Error: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify the region you selected matches your location
- Try the direct connection string instead

### Tables not showing in Supabase

**Solution:**
- Make sure `npx prisma db push` completed successfully
- Check the Supabase dashboard → Table Editor
- Refresh the page

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Connection strings copied and added to `.env`
- [ ] `npx prisma generate` ran successfully
- [ ] `npx prisma db push` ran successfully
- [ ] Tables visible in Supabase Table Editor
- [ ] App runs locally (`npm run dev`)
- [ ] Can sign up a new user
- [ ] User appears in Supabase User table

---

## 📝 Quick Reference Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database in browser (optional)
npx prisma studio

# Start dev server
npm run dev
```

---

**Once everything works locally, we'll proceed to deployment! 🚀**

