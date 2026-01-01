# How to Update Node.js and npm on Windows

## Current Status
- **Node.js**: v20.4.0 (outdated - from July 2023)
- **npm**: 9.7.2 (outdated)

## Recommended Solution: Download Latest Node.js LTS

### Step 1: Download Node.js
1. Visit: https://nodejs.org/
2. Download the **LTS (Long-Term Support)** version (currently Node.js 22.x or latest 20.x)
3. Run the installer
4. Follow the installation wizard (it will automatically update npm too)

### Step 2: Verify Installation
After installation, open a **new** PowerShell/Command Prompt window and run:
```bash
node -v
npm -v
```

You should see:
- Node.js: v22.x.x or v20.x.x (latest)
- npm: v10.x.x (latest)

### Step 3: Install Project Dependencies
Once updated, navigate to your project directory and run:
```bash
npm install
```

### Step 4: Run the Project
```bash
npm run dev
```

## Alternative: Using nvm-windows (For Managing Multiple Node Versions)

If you want to manage multiple Node.js versions in the future:

1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install the `nvm-setup.exe` file
3. After installation, open a new terminal and run:
   ```bash
   nvm install lts
   nvm use lts
   ```

## Troubleshooting

If you still get errors after updating:
1. Make sure you close and reopen your terminal after installing Node.js
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`, then run `npm install` again



