# Local Development Setup Guide

## ✅ Database Setup Complete!

Your project is now configured to use **SQLite** for local development instead of the paused Supabase database.

### What Changed:
1. ✅ Prisma schema updated to use SQLite
2. ✅ Local database file created at `prisma/dev.db`
3. ✅ All tables created (User, Category, Item, Sale)
4. ✅ Migrations applied successfully

### Running the Project:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Visit `http://localhost:3000`

3. **Test Signup:**
   - Go to the signup page
   - Create a new user account
   - You should now be able to sign up and login successfully!

### Database Location:
- **Local SQLite DB**: `prisma/dev.db` (created automatically)
- This file contains all your local data

### Switching Back to PostgreSQL/Supabase (for production):

If you want to use Supabase again in the future:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

2. Update your `.env` file with Supabase credentials:
   ```
   DATABASE_URL="your-supabase-connection-string"
   DIRECT_URL="your-supabase-direct-connection-string"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Useful Commands:

- **View database in Prisma Studio:**
  ```bash
  npx prisma studio
  ```

- **Reset database (delete all data):**
  ```bash
  npx prisma migrate reset
  ```

- **Create a new migration:**
  ```bash
  npx prisma migrate dev --name migration_name
  ```

### Notes:
- The SQLite database is file-based and stored locally
- All data persists between server restarts
- Perfect for local development and testing
- No external database connection needed!

