# Kube Cafe - Full-Stack Web Application

A modern, full-stack cafe web application with a client panel and secure admin panel, built with React.js, Node.js, Express.js, and MySQL.

## 🚀 Features

### Client Panel
- **Home Page**: Cafe branding with hero section and gallery
- **Dynamic Menu**: Tab-based filtering by category (Beverages, Food, Desserts, Drinks)
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Registration and login with JWT
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Gallery Section**: High-quality images showcasing cafe ambiance

### Admin Panel
- **Secure Login**: Admin authentication with JWT
- **Dashboard**: Overview with statistics (users, menu items, orders)
- **User Management**: View, manage, and delete users
- **Menu Management**: Full CRUD operations for menu items
- **Order Tracking**: View recent orders and their status

## 🛠 Tech Stack

### Frontend
- **React.js** with Vite
- **Bootstrap 5** for styling
- **React Router DOM** for navigation
- **Lucide React** for icons
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
KUBE-CAFE/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── component/        # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── pages/           # Page components
│   │   └── assets/          # Images and static files
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── config/              # Database configuration
│   ├── middleware/          # Authentication middleware
│   ├── routes/              # API routes
│   ├── database.sql         # Database schema
│   └── server.js            # Main server file
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   - Create a MySQL database named `kube_cafe`
   - Copy `config/config.env.example` to `config/config.env`
   - Update database credentials in `config/config.env`:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=kube_cafe
     ```
   - Generate JWT secrets (run in Node.js):
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Run the SQL script:
     ```bash
     mysql -u root -p < database.sql
     ```
   - Run the migration (adds role column):
     ```bash
     mysql -u root -p kube_cafe < migrations/add_role_column.sql
     ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## 🔐 Default Credentials

### Admin Login
- **Username:** `admin`
- **Password:** `password` (⚠️ Change this in production!)
- **Email:** `admin@kubecafe.com`

**To change admin password:**
```sql
-- Generate new hash using bcrypt (use online tool or Node.js)
UPDATE admins SET password = '$2a$10$NEW_HASHED_PASSWORD' WHERE username = 'admin';
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (validated)
- `POST /api/auth/login` - User login (validated)

### Admin (Protected with adminProtect)
- `POST /api/admin/login` - Admin login (validated)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users?page=1&limit=10` - Get paginated users
- `GET /api/admin/orders?page=1&limit=10` - Get paginated orders

### Menu (Public & Admin)
- `GET /api/menu` - Get all menu items (public, no auth)
- `GET /api/menu?page=1&limit=10` - Get paginated menu items (admin)
- `POST /api/menu` - Create menu item (admin, validated, requires image upload)
- `PUT /api/menu/:id` - Update menu item (admin, validated)
- `DELETE /api/menu/:id` - Delete menu item (admin)
- `GET /api/menu/categories` - Get all categories (public)

### Orders (Protected)
- `POST /api/orders` - Create order (user, validated)
- `GET /api/orders/my` - Get user's orders (user)
- `GET /api/orders` - Get all orders (admin, paginated)
- `PUT /api/orders/:id` - Update order status (admin, validated)

### Users (Admin Only)
- `GET /api/users` - Get all users (admin, paginated)

**Note:** All endpoints return standardized response format with `success`, `message`, and `data` fields.

## 🎨 Features in Detail

### Client Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dynamic Menu**: Real-time menu updates from database
- **Shopping Cart**: Persistent cart with localStorage
- **User Authentication**: Secure login/registration with JWT tokens
- **Gallery**: Beautiful image showcase of cafe ambiance

### Admin Features
- **Dashboard Analytics**: Real-time statistics and recent orders
- **User Management**: Complete user CRUD operations
- **Menu Management**: Add, edit, delete menu items with categories
- **Order Tracking**: Monitor order status and customer details
- **Secure Access**: Protected admin routes with JWT authentication

## 🔧 Environment Variables

### Backend Configuration

Create a `config.env` file in the `backend/config/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=kube_cafe
DB_PORT=3306

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_ADMIN_SECRET=your_super_secret_admin_jwt_key_here_min_32_chars

# Server Configuration
PORT=5000
NODE_ENV=development
```

**⚠️ Important:** 
- Never commit `config.env` to version control
- Use strong, random strings for JWT secrets (minimum 32 characters)
- In production, use environment variables or a secure secrets manager

### Frontend Configuration

The frontend uses Vite's proxy configuration in `vite.config.js`:
- API requests to `/api/*` are proxied to `http://localhost:5000`
- No additional configuration needed for development

---

## 🚀 Deployment Guide

### Prerequisites for Production
- Node.js 18+ installed on server
- MySQL 8.0+ database (local or cloud)
- Domain name (optional, for production)
- SSL certificate (for HTTPS)

### Backend Deployment

1. **Prepare Production Environment:**
   ```bash
   cd backend
   npm install --production
   ```

2. **Set Environment Variables:**
   - Create `config.env` with production values
   - Use strong JWT secrets
   - Set `NODE_ENV=production`

3. **Database Setup:**
   ```bash
   # On your production server
   mysql -u root -p < database.sql
   # Or import via phpMyAdmin/MySQL Workbench
   ```

4. **Run Database Migration (if needed):**
   ```bash
   mysql -u root -p kube_cafe < migrations/add_role_column.sql
   ```

5. **Start Production Server:**
   ```bash
   # Using PM2 (recommended)
   npm install -g pm2
   pm2 start server.js --name kube-cafe-api
   
   # Or using node directly
   npm start
   ```

6. **Configure Reverse Proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

1. **Build for Production:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   This creates an optimized `dist/` folder.

2. **Deploy Options:**

   **Option A: Vercel/Netlify (Recommended)**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   cd frontend
   vercel
   ```
   - Add environment variable: `VITE_API_URL=https://api.yourdomain.com`

   **Option B: Traditional Hosting**
   - Upload `dist/` folder contents to your web server
   - Configure web server to serve `index.html` for all routes
   - Update API URLs in code to point to production backend

3. **Update API Base URL:**
   - In production, update all `http://localhost:5000` references
   - Use environment variable: `VITE_API_URL`
   - Or update `vite.config.js` proxy target

### Production Checklist

- [ ] Database backups configured
- [ ] Environment variables set
- [ ] JWT secrets are strong and unique
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured for production domain
- [ ] File upload directory has proper permissions
- [ ] Error logging configured
- [ ] Monitoring set up (optional)

---

## 📋 Admin Login Flow

1. Navigate to `/admin/login`
2. Enter credentials:
   - **Username:** `admin`
   - **Password:** `password` (default)
3. Upon successful login, you'll be redirected to `/admin/dashboard`
4. Token is stored in localStorage as `adminToken`
5. All admin routes are protected and require valid token

**⚠️ Security Note:** Change the default admin password immediately in production!

---

## 🌐 API Base URL

### Development
- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173`
- **API Base:** `http://localhost:5000/api`

### Production
- Update `vite.config.js` proxy target
- Or use environment variable `VITE_API_URL`
- Ensure CORS allows your frontend domain

---

## 📝 API Response Format

All API responses follow a standardized format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

**Pagination Response:**
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🔍 API Endpoints with Pagination

### Admin Endpoints (Protected)
- `GET /api/admin/orders?page=1&limit=10` - Get paginated orders
- `GET /api/admin/users?page=1&limit=10` - Get paginated users
- `GET /api/menu?page=1&limit=10` - Get paginated menu items (admin)

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for Kube Cafe** 