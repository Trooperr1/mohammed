# Restaurant Management System - Setup Guide

This guide will walk you through setting up the restaurant management system step by step.

## Step 1: System Requirements

Before you begin, ensure you have:

- **Node.js**: Version 14.0.0 or higher
  - Check version: `node --version`
  - Download from: https://nodejs.org/

- **npm**: Usually comes with Node.js
  - Check version: `npm --version`

- **Operating System**: Windows, macOS, or Linux

- **Browser**: Modern browser (Chrome, Firefox, Safari, or Edge)

## Step 2: Project Setup

### 2.1 Navigate to Project Directory

```bash
cd restaurant-management-system
```

### 2.2 Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- sqlite3 (database)
- ws (WebSocket support)
- cors (cross-origin resource sharing)
- uuid (unique ID generation)
- body-parser (request parsing)

### 2.3 Initialize Database

```bash
npm run init-db
```

Expected output:
```
✓ Initialized 15 tables
✓ Initialized menu items
✅ Database initialization complete!
```

This creates:
- `restaurant.db` file in the backend directory
- 15 restaurant tables (numbered 1-15)
- 18 sample menu items across 4 categories

### 2.4 Start Backend Server

```bash
npm start
```

Expected output:
```
🚀 Restaurant Management System Backend
📡 Server running on http://localhost:3001
🔌 WebSocket server ready
💾 Database: SQLite (local)
```

Keep this terminal window open. The backend server is now running.

### 2.5 Install Frontend Dependencies

Open a **new terminal window** and run:

```bash
cd restaurant-management-system/frontend
npm install
```

This will install:
- react (UI framework)
- react-router-dom (navigation)
- axios (HTTP client)
- i18next (internationalization)
- react-to-print (printing support)

### 2.6 Start Frontend Application

```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view restaurant-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The application will automatically open in your default browser.

## Step 3: First-Time Configuration

### 3.1 Test the System

1. **Access Cashier Interface**:
   - Go to: `http://localhost:3000`
   - You should see 15 tables displayed
   - All tables should show "Available" status

2. **Access Kitchen Display**:
   - Go to: `http://localhost:3000/kitchen`
   - Should show "No orders at the moment"

3. **Access Admin Panel**:
   - Go to: `http://localhost:3000/admin`
   - Should show menu items in the table

### 3.2 Create a Test Order

1. Go to Cashier interface
2. Click on Table 1 (should be green/available)
3. Click on a category tab (e.g., "Pizza")
4. Click on menu items to add them
5. Adjust quantities using +/- buttons
6. Click "💵 Cash" or "💳 Card" to complete
7. Receipt will appear - you can print it

### 3.3 Verify Kitchen Display

1. Go to Kitchen display
2. You should see the test order appear
3. Click "🔥 Mark as Preparing"
4. Then click "✅ Mark as Ready"

### 3.4 Test Language Switching

1. Click "ع" button in top navigation for Arabic
2. Click "کو" button for Kurdish
3. Click "EN" button to return to English

## Step 4: Local Network Setup (Optional)

To use the system on multiple devices on your local network:

### 4.1 Find Your Local IP Address

**Windows**:
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux**:
```bash
ifconfig
# or
ip addr show
```
Look for inet address (e.g., 192.168.1.100)

### 4.2 Configure Frontend for Network Access

1. Stop the frontend (Ctrl+C in frontend terminal)

2. Create `frontend/.env` file:
   ```env
   REACT_APP_API_URL=http://YOUR_IP:3001/api
   REACT_APP_WS_URL=ws://YOUR_IP:3001
   ```
   Replace `YOUR_IP` with your actual IP address.

3. Restart frontend:
   ```bash
   npm start
   ```

### 4.3 Access from Other Devices

- **Cashier Tablet**: `http://YOUR_IP:3000/`
- **Kitchen Display**: `http://YOUR_IP:3000/kitchen`
- **Admin Computer**: `http://YOUR_IP:3000/admin`

Make sure all devices are on the same WiFi network.

## Step 5: Production Deployment (Optional)

For permanent installation:

### 5.1 Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`

### 5.2 Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 5.3 Start Backend with PM2

```bash
cd backend
pm2 start server.js --name restaurant-backend
pm2 save
pm2 startup
```

Follow the on-screen instructions to enable startup on boot.

### 5.4 Serve Frontend (Option 1: Simple Server)

```bash
npm install -g serve
cd frontend
serve -s build -p 3000
```

### 5.5 Serve Frontend (Option 2: PM2)

Create `frontend/server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
```

Then:
```bash
npm install express
pm2 start server.js --name restaurant-frontend
pm2 save
```

## Step 6: Customization

### 6.1 Change Restaurant Name

Edit `frontend/src/components/Receipt.js`:
```javascript
<h1>🍕 Your Restaurant Name</h1>
<p>Your Address</p>
<p>Your City, Country</p>
<p>Tel: Your Phone</p>
```

### 6.2 Add Menu Items

1. Go to Admin panel
2. Click "Add Menu Item"
3. Fill in details in all three languages
4. Set price and category
5. Click "Save"

### 6.3 Modify Table Count

Edit `backend/scripts/init-database.js`:
```javascript
// Change 15 to your desired number
for (let i = 1; i <= 15; i++) {
```

Then reinitialize:
```bash
cd backend
rm restaurant.db
npm run init-db
```

## Step 7: Backup and Maintenance

### 7.1 Backup Database

```bash
# Linux/Mac
cp backend/restaurant.db backend/restaurant.db.backup

# Windows
copy backend\restaurant.db backend\restaurant.db.backup
```

### 7.2 Schedule Regular Backups

**Linux/Mac** (using cron):
```bash
crontab -e
# Add this line for daily backup at 2 AM:
0 2 * * * cp /path/to/backend/restaurant.db /path/to/backups/restaurant_$(date +\%Y\%m\%d).db
```

**Windows** (using Task Scheduler):
Create a batch file and schedule it using Task Scheduler.

### 7.3 View Logs

With PM2:
```bash
pm2 logs restaurant-backend
pm2 logs restaurant-frontend
```

## Troubleshooting

### Port Already in Use

**Backend (Port 3001)**:
- Change PORT in `backend/.env`
- Update REACT_APP_API_URL in `frontend/.env`

**Frontend (Port 3000)**:
- The development server will automatically try 3001, 3002, etc.

### Cannot Connect to Database

```bash
cd backend
rm restaurant.db
npm run init-db
```

### Frontend Can't Reach Backend

1. Check backend is running: `curl http://localhost:3001/api/health`
2. Check firewall settings
3. Verify .env configuration

### Print Not Working

1. Use Chrome or Edge browser (best print support)
2. Check printer is set up in system
3. Try "Print to PDF" first to test

## Next Steps

- Customize menu items for your restaurant
- Set up dedicated tablets/computers for each role
- Configure automatic startup on boot
- Set up regular database backups
- Train staff on system usage

## Getting Help

If you encounter issues:

1. Check the error message in browser console (F12)
2. Check backend terminal for errors
3. Review this guide's troubleshooting section
4. Check Node.js and npm versions

---

**Congratulations!** Your restaurant management system is now set up and ready to use. 🎉
