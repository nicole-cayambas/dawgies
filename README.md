# 🐕 Breed Likes Dashboard

A modern Laravel + Inertia.js single-page application for discovering and liking dog breeds. Features user authentication, a personalized dashboard, and sample data.

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Node.js & npm
- MySQL

### Installation

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Run the development server
npm run dev

# In another terminal, start Laravel
php artisan serve

# Make sure to run 
php artisan queue:work 
# for asynchronous caching so data loads faster
```

### Initial Setup

1. **Register an account** via the web interface at `http://localhost:8000`
2. **Seed sample data**
    ```bash
    php artisan db:seed
    ```
    Creates 20 test users for exploration

## ✨ Features

- 🐾 Browse breeds with images and descriptions
- 👍 Like/unlike breeds with real-time updates
- 🔐 User authentication (registration/login)
- 📊 Personalized dashboard
- 🌱 Sample user seeding for testing

## 🛠️ Tech Stack

- **Backend**: PHP 8.3 / Laravel 12
- **Frontend**: Inertia.js + React
- **Styling**: Tailwind CSS
- **Database**: Sqlite or MySQL, up to you 😉

## 📝 Additional Commands

```bash
php artisan migrate          # Run migrations
php artisan route:clear      # Clear route cache
php artisan config:clear     # Clear config cache
php artisan cache:clear      # Clear app cache
```
