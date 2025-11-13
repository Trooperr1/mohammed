# Restaurant Management System

A complete, production-ready restaurant management system for a 15-table restaurant serving Pizza, Doner, Kurdish, and Arabic food. This system works completely offline with local database storage.

## 🌟 Features

### Core Functionality
- **POS System**: Full point-of-sale system for taking orders and processing payments
- **Table Management**: Real-time status tracking for 15 tables
- **Kitchen Display**: Dedicated screen for kitchen staff to view and manage orders
- **Menu Management**: Easy-to-use admin interface for managing menu items
- **Order Management**: Create, edit, view, and complete orders
- **Receipt Printing**: Print professional receipts for customers
- **Sales Reports**: Daily sales analytics and insights

### Technical Features
- ✅ **Offline First**: Works completely offline with local SQLite database
- ✅ **Real-time Updates**: WebSocket integration for instant updates between cashier and kitchen
- ✅ **Multi-language**: Support for English, Arabic, and Kurdish
- ✅ **Responsive Design**: Works on tablets, computers, and touch screens
- ✅ **Print Support**: Receipt and kitchen order printing
- ✅ **Fast & Intuitive**: Optimized for busy restaurant environments

### User Roles

1. **Cashier**
   - Take new orders
   - Manage tables
   - Process payments (cash/card)
   - View active orders
   - Print receipts

2. **Kitchen**
   - View incoming orders
   - Mark orders as preparing
   - Mark orders as ready
   - Real-time order updates

3. **Admin**
   - Manage menu items
   - Add/edit/delete menu items
   - View daily sales reports
   - Track popular items
   - Analyze sales by category

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite3** for local database
- **WebSocket** for real-time updates
- **UUID** for unique order IDs

### Frontend
- **React 18** for UI
- **React Router** for navigation
- **i18next** for internationalization
- **Axios** for API calls
- **React-to-Print** for printing functionality

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🚀 Quick Start

### 1. Clone or Extract the Project

```bash
cd restaurant-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Initialize the Database

```bash
npm run init-db
```

This will create the SQLite database and populate it with:
- 15 tables (numbered 1-15)
- Sample menu items across all categories (Pizza, Doner, Kurdish Food, Arabic Food)

### 4. Start the Backend Server

```bash
npm start
```

The backend server will start on `http://localhost:3001`

### 5. Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### 6. Start the Frontend Application

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## 📖 Usage Guide

### Cashier Interface (`/`)

1. **Select a Table**: Click on an available (green) table
2. **Add Items**: Browse categories and click on menu items to add them
3. **Adjust Quantities**: Use +/- buttons to change item quantities
4. **Add Notes**: Optional notes for the kitchen
5. **Complete Order**: Choose payment method (Cash or Card)
6. **Print Receipt**: Automatically shows receipt for printing

### Kitchen Display (`/kitchen`)

1. **View Orders**: All pending and preparing orders are displayed
2. **Filter Orders**: Use tabs to filter by status
3. **Start Preparing**: Click "Mark as Preparing" for pending orders
4. **Mark Ready**: Click "Mark as Ready" when order is complete
5. **Urgent Orders**: Orders older than 15 minutes are highlighted in red

### Admin Dashboard (`/admin`)

#### Menu Management
1. **View Menu**: See all menu items with status
2. **Add Item**: Click "Add Menu Item" button
3. **Edit Item**: Click edit icon (✏️) on any item
4. **Toggle Availability**: Use red/green circle to enable/disable items
5. **Delete Item**: Click trash icon (🗑️) to remove items

#### Reports
1. **Select Date**: Choose date for daily report
2. **View Stats**: Total orders, revenue, average order
3. **Popular Items**: See best-selling items
4. **Category Breakdown**: Sales analysis by food category
5. **Payment Methods**: Cash vs Card statistics

## 🌐 Multi-Language Support

The system supports three languages:
- **English (EN)**: Default language
- **Arabic (ع)**: Right-to-left (RTL) support
- **Kurdish (کو)**: Right-to-left (RTL) support

Switch languages using the buttons in the top navigation bar.

## 🖨️ Printing

### Receipt Printing
1. Complete an order with a payment method
2. Receipt modal appears automatically
3. Click "Print" button
4. Configure printer in browser print dialog

### Kitchen Order Printing
- Use browser print function (Ctrl+P / Cmd+P) on kitchen screen
- Only order information will be printed (no interface elements)

## 📊 Database Schema

### Tables
- `tables`: Restaurant table information and status
- `menu_items`: Menu items with multi-language support
- `orders`: Order records with status tracking
- `order_items`: Detailed line items for each order
- `sales`: Aggregated sales data (for future use)

### Menu Categories
- **pizza**: Pizza items
- **doner**: Doner kebab items
- **kurdish**: Traditional Kurdish food
- **arabic**: Traditional Arabic food

## 🔧 Configuration

### Backend Configuration

Create `backend/.env` (optional):
```env
PORT=3001
```

### Frontend Configuration

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## 🏪 Deployment

### Local Network Deployment

1. **Find your local IP address**:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr show`

2. **Update frontend .env**:
   ```env
   REACT_APP_API_URL=http://YOUR_LOCAL_IP:3001/api
   REACT_APP_WS_URL=ws://YOUR_LOCAL_IP:3001
   ```

3. **Build frontend**:
   ```bash
   cd frontend
   npm run build
   ```

4. **Serve frontend build** (optional):
   ```bash
   npm install -g serve
   serve -s build -p 3000
   ```

5. **Access from other devices**:
   - Cashier: `http://YOUR_LOCAL_IP:3000/`
   - Kitchen: `http://YOUR_LOCAL_IP:3000/kitchen`
   - Admin: `http://YOUR_LOCAL_IP:3000/admin`

### Production Deployment

For a permanent installation:

1. Use **PM2** for backend process management:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name restaurant-backend
   pm2 save
   pm2 startup
   ```

2. Use **nginx** to serve frontend and proxy backend:
   - Serve frontend build from `/usr/share/nginx/html`
   - Proxy `/api` and WebSocket to backend

3. Set up **autostart** on system boot

## 🔒 Security Notes

For production use:
- Change default database location and secure it
- Add authentication for admin routes
- Use HTTPS for network deployments
- Implement user access control
- Regular database backups

## 📱 Device Recommendations

- **Cashier Station**: Tablet (10"+ recommended) or Desktop
- **Kitchen Display**: Large tablet or monitor (15"+ recommended)
- **Admin Station**: Desktop or laptop

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify Node.js version (14+)
- Check database file permissions

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check REACT_APP_API_URL in frontend/.env
- Disable firewall if testing on local network

### Database issues
- Delete `backend/restaurant.db` and run `npm run init-db` again
- Check write permissions in backend directory

### Print not working
- Ensure browser has print permissions
- Check printer is configured in system
- Use Chrome/Edge for best print support

## 📝 Sample Data

The system comes pre-populated with:
- 15 tables (all initially available)
- 18 menu items across 4 categories:
  - 4 Pizza items
  - 4 Doner items
  - 4 Kurdish food items
  - 4 Arabic food items

All menu items include names and descriptions in English, Arabic, and Kurdish.

## 🤝 Support

For issues, questions, or feature requests:
1. Check the troubleshooting section
2. Review the usage guide
3. Check console for error messages

## 📄 License

This project is provided as-is for restaurant management purposes.

## 🎉 Credits

Built with modern web technologies for fast, reliable restaurant operations.

---

**Version**: 1.0.0
**Last Updated**: 2025
**Status**: Production Ready ✅
