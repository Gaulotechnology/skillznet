# SkillzLink

SkillzLink is a platform designed to connect people with local service professionals across Zimbabwe. Built with a Laravel backend and a React (TypeScript, Vite) frontend, it features role-based authentication, dynamic form building, advanced provider searching, and more.

## Architecture

This repository is split into two primary folders:

- `/skillzlink-backend` - The Laravel API that drives the platform.
- `/skillzlink-frontend` - The React SPA that provides the user interface.

## Prerequisites

- **PHP** >= 8.2 (for backend)
- **Composer** (for backend dependencies)
- **Node.js** >= 18 (for frontend)
- **MySQL/PostgreSQL/SQLite** (Database)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd skillzlink-backend
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Generate an application key:
   ```bash
   php artisan key:generate
   ```
5. Configure your `.env` file with your database credentials (e.g. SQLite, MySQL, or PostgreSQL). By default, a SQLite database is recommended for local development.

6. Run the migrations and seed the database to generate the demo data:
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Note: This creates demo accounts (Admin, Provider, Seeker) and populates the platform with dummy professionals.*

7. Start the Laravel development server:
   ```bash
   php artisan serve
   # Server usually runs at http://localhost:8000
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd skillzlink-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file (if applicable):
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `VITE_API_BASE_URL` points to your running backend (e.g., `http://localhost:8000/api` or `http://localhost:18080/api` depending on your setup).*

4. Start the Vite development server:
   ```bash
   npm run dev
   # App will run at http://localhost:5173
   ```

## Demo Credentials

You can log in to the application at `/login` using these pre-seeded demo accounts. The login uses OTP validation (in development mode, you can type any 6-digit code or look at the response payload to proceed).

- **Admin Account**: `+263771111111`
- **Provider Account**: `+263772222222`
- **Customer (Seeker) Account**: `+263773333333`

## Features

- **Dynamic Form Builder**: Admins can dynamically add or remove registration fields.
- **Role-based Dashboards**: Distinct experiences for Admins, Providers, and Seekers.
- **Provider Search Engine**: Geolocation-based searching, allowing users to find professionals within specific radii of Zimbabwean cities.
- **API Logs Tracking**: Admins can monitor incoming and outgoing requests.
- **Theme Settings Control**: Change platform colors dynamically from the Admin dashboard.

## License

All rights reserved. 
