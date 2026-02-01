# Kube Cafe Backend API

A Node.js/Express.js backend API for the Kube Cafe web application.

## Features

- User authentication (register/login) with JWT
- Admin authentication and management
- Menu management (CRUD operations)
- User management
- Dashboard statistics
- MySQL database integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   - Create a MySQL database
   - Update the database credentials in `config.env`
   - Run the SQL script in `database.sql` to create tables and sample data

3. **Environment Variables:**
   - Copy `config.env` and update with your database credentials
   - Update JWT secrets if needed

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user by ID
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/menu` - Get all menu items (admin)
- `POST /api/admin/menu` - Add menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/categories` - Get menu categories

### Public Menu
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/category/:categoryId` - Get items by category
- `GET /api/menu/items/:id` - Get single menu item

## Default Admin Credentials

- Username: `admin`
- Password: `password`
- Email: `admin@kubecafe.com`

## Database Schema

The database includes tables for:
- Users
- Admins
- Menu Categories
- Menu Items
- Orders
- Order Items

See `database.sql` for the complete schema. 