# Quick Start Guide

Get the restaurant management system running in 5 minutes!

## Prerequisites

- Node.js installed (v14+)
- Terminal/Command Prompt access

## ⚡ Super Quick Start (2 steps - FASTEST!)

```bash
# 1. Install dependencies and setup database
npm install && npm run setup

# 2. Start both servers
npm run dev
```

That's it! The app opens at `http://localhost:3000` 🎉

---

## 🚀 Quick Setup (5 steps - Manual Control)

### 1. Install Backend

```bash
cd backend
npm install
```

### 2. Setup Database

```bash
npm run init-db
```

### 3. Start Backend

```bash
npm start
```

Keep this terminal open!

### 4. Install & Start Frontend

Open a NEW terminal:

```bash
cd frontend
npm install
npm start
```

### 5. Open Browser

The app will automatically open at `http://localhost:3000`

## 🎯 Try It Out

1. **Cashier**: Click on Table 1 → Add some pizza → Complete order
2. **Kitchen**: Go to `/kitchen` → See the order → Mark as preparing/ready
3. **Admin**: Go to `/admin` → View menu and reports

## 📱 Access Points

- Cashier POS: `http://localhost:3000/`
- Kitchen Display: `http://localhost:3000/kitchen`
- Admin Panel: `http://localhost:3000/admin`

## 🌐 Languages

Click the language buttons in the top navigation:
- **EN** - English
- **ع** - Arabic
- **کو** - Kurdish

## 🖨️ Printing

After completing an order, a receipt will appear with a print button.

## 📞 Need Help?

See the full [README.md](README.md) or [SETUP.md](SETUP.md) for detailed instructions.

---

**That's it! You're ready to go!** 🎉
