# 🚀 Kube Cafe - Deployment Guide

## Quick Setup Summary

### 1. Backend Setup
```bash
cd backend
npm install
# Copy config.env.example to config.env and update values
cp config/config.env.example config/config.env
# Setup database
mysql -u root -p < database.sql
mysql -u root -p kube_cafe < migrations/add_role_column.sql
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Login: http://localhost:5173/admin/login

---

## 📋 Complete Setup Instructions

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ MySQL 8.0+ installed and running
- ✅ npm or yarn package manager

### Step-by-Step Setup

#### Step 1: Clone/Download Project
```bash
# If using git
git clone <repository-url>
cd KUBE-CAFE

# Or extract the project folder
```

#### Step 2: Backend Configuration

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Copy example file
   cp config/config.env.example config/config.env
   
   # Edit config.env with your values
   # Use a text editor to update:
   # - DB_PASSWORD (your MySQL password)
   # - JWT_SECRET (generate a random 32+ char string)
   # - JWT_ADMIN_SECRET (generate another random 32+ char string)
   ```

4. **Generate JWT Secrets:**
   ```bash
   # Run this twice to get two different secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Setup Database:**
   ```bash
   # Create database and tables
   mysql -u root -p < database.sql
   
   # Run migration to add role column
   mysql -u root -p kube_cafe < migrations/add_role_column.sql
   ```

6. **Start Backend:**
   ```bash
   npm run dev
   # Server should start on http://localhost:5000
   ```

#### Step 3: Frontend Configuration

1. **Navigate to frontend:**
   ```bash
   cd frontend
   # (from project root)
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend:**
   ```bash
   npm run dev
   # Frontend should start on http://localhost:5173
   ```

#### Step 4: Verify Setup

1. **Test Backend:**
   - Open: http://localhost:5000/api/menu
   - Should return menu items JSON

2. **Test Frontend:**
   - Open: http://localhost:5173
   - Should show home page

3. **Test Admin Login:**
   - Navigate to: http://localhost:5173/admin/login
   - Username: `admin`
   - Password: `password`
   - Should redirect to dashboard

---

## 🔐 Admin Login Flow

1. Go to `/admin/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `password`
3. Click "Login"
4. You'll be redirected to `/admin/dashboard`
5. Token stored in localStorage as `adminToken`

**⚠️ Security:** Change default password in production!

---

## 🌐 API Base URLs

### Development
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`
- **API Base:** `http://localhost:5000/api`

### Production
Update these in:
- `vite.config.js` (proxy target)
- Environment variables
- Frontend API calls

---

## 📝 Environment Variables Reference

### Backend (`backend/config/config.env`)

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kube_cafe
DB_PORT=3306

# JWT Secrets (32+ characters recommended)
JWT_SECRET=generate_random_string_here
JWT_ADMIN_SECRET=generate_another_random_string_here

# Server
PORT=5000
NODE_ENV=development
```

### Frontend
- No `.env` file needed for development
- Vite proxy handles API routing
- For production, set `VITE_API_URL` if needed

---

## 🚀 Production Deployment

### Backend Deployment (Node.js Server)

1. **Prepare Server:**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   
   # Navigate to backend
   cd backend
   npm install --production
   ```

2. **Configure Production Environment:**
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=your_production_db_host
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   DB_NAME=kube_cafe
   JWT_SECRET=strong_production_secret
   JWT_ADMIN_SECRET=strong_production_admin_secret
   ```

3. **Start with PM2:**
   ```bash
   pm2 start server.js --name kube-cafe-api
   pm2 save
   pm2 startup
   ```

### Frontend Deployment (Static Hosting)

1. **Build for Production:**
   ```bash
   cd frontend
   npm run build
   # Creates optimized dist/ folder
   ```

2. **Deploy Options:**

   **Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

   **Netlify:**
   - Drag and drop `dist/` folder
   - Or connect GitHub repo

   **Traditional Hosting:**
   - Upload `dist/` contents to web server
   - Configure server to serve `index.html` for all routes

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] Frontend loads correctly
- [ ] Menu items display on home page
- [ ] Admin login works
- [ ] Can create menu items in admin panel
- [ ] Can view orders in admin panel
- [ ] Images upload and display correctly
- [ ] API responses use standardized format
- [ ] Validation works on forms
- [ ] Pagination works in admin lists

---

## 🆘 Troubleshooting

### Backend Issues

**Database Connection Failed:**
- Check MySQL is running
- Verify credentials in `config.env`
- Ensure database `kube_cafe` exists

**Port Already in Use:**
- Change `PORT` in `config.env`
- Or kill process using port 5000

**JWT Errors:**
- Ensure JWT secrets are set in `config.env`
- Secrets must match between restarts

### Frontend Issues

**API Requests Fail:**
- Check backend is running
- Verify proxy in `vite.config.js`
- Check CORS settings

**Images Not Displaying:**
- Verify `/uploads` directory exists
- Check file permissions
- Ensure backend serves static files

---

**Need Help?** Check the main README.md for more details.

