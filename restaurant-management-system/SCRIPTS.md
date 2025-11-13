# Convenience Scripts Guide

This root package.json provides helpful scripts to manage the entire restaurant system.

## 🚀 Super Quick Start (One Command!)

If you haven't installed dependencies yet:

```bash
npm run setup
```

This will:
1. Install all backend dependencies
2. Install all frontend dependencies
3. Initialize the database with sample data

## 📜 Available Scripts

### Setup & Installation

```bash
# Install dependencies for both backend and frontend
npm run install-all

# Complete setup (install + initialize database)
npm run setup
```

### Database Management

```bash
# Initialize database with 15 tables and sample menu items
npm run init-db

# Verify database contents
npm run verify-db
```

### Running the Application

```bash
# Run backend only
npm run start-backend

# Run frontend only
npm run start-frontend

# Run BOTH backend and frontend simultaneously (recommended!)
npm run dev
```

## 💡 Recommended Workflow

### First Time Setup

```bash
# 1. One command to set everything up
npm install
npm run setup

# 2. Start both servers
npm run dev
```

Then open your browser to:
- Cashier: http://localhost:3000/
- Kitchen: http://localhost:3000/kitchen
- Admin: http://localhost:3000/admin

### Daily Usage

```bash
# Just start both servers
npm run dev
```

Press `Ctrl+C` to stop both servers.

## 🔧 Manual Control

If you prefer to run servers separately (for debugging):

**Terminal 1 - Backend:**
```bash
npm run start-backend
```

**Terminal 2 - Frontend:**
```bash
npm run start-frontend
```

## 📊 Database Commands

```bash
# Reset database and reload sample data
cd backend
rm restaurant.db
npm run init-db
cd ..

# Or use root command
npm run init-db
```

## 🛠️ Dependencies

The root package.json uses `concurrently` to run both servers simultaneously. Install it with:

```bash
npm install
```

This only installs development dependencies for the root scripts. Backend and frontend dependencies are installed separately with `npm run install-all` or `npm run setup`.

## 📝 Notes

- The `dev` script runs both servers and shows output from both in the same terminal
- Backend runs on port 3001
- Frontend runs on port 3000
- Press `Ctrl+C` to stop all servers

Enjoy your restaurant management system! 🍕🥙🍖
