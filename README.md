# Kanban Assessment

A Laravel + Inertia.js + React Kanban board application with automated reporting.

## Features

- ✅ Drag-and-drop Kanban board
- ✅ Project management
- ✅ Task assignment and status tracking
- ✅ Automated daily report generation
- ✅ Queue-based report processing
- ✅ Laravel Scheduler integration

## Setup

1. Clone the repository
2. Run `composer install`
3. Run `npm install`
4. Copy `.env.example` to `.env`
5. Run `php artisan key:generate`
6. Run `php artisan migrate --seed`
7. Run `npm run build`
8. Start the server: `php artisan serve`

## Testing

### Test Database Setup
- Tests use a separate SQLite database (`database/testing.sqlite`)
- Test environment is configured in `.env.testing`
- Tests run with `RefreshDatabase` trait for clean state

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

### Test Database
```bash
# Create test database
touch database/testing.sqlite

# Run migrations for testing
php artisan migrate --env=testing

# Seed test data
php artisan db:seed --class=TestDatabaseSeeder --env=testing
```

## Queue & Scheduler

- Queue worker: `php artisan queue:work`
- Test scheduler: `php artisan schedule:run`
- Generate reports: `php artisan reports:generate`

## Cron Setup

Add to crontab for production: