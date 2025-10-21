# Kanban Task Tracker & Reporting System

A comprehensive project management system built with Laravel 11, Inertia.js, and React. Features a drag-and-drop Kanban board, user management, role-based access control, and automated reporting with data visualization.

## 🚀 Features

### Core Functionality
- **Project Management** - Create, update, and delete projects
- **Task Management** - Full CRUD operations with drag-and-drop Kanban board
- **User Management** - Admin-controlled user administration
- **Role-Based Access** - Admin and member roles with appropriate permissions
- **Automated Reporting** - Daily report generation with visual charts
- **Real-time Updates** - Live task status updates

### Authentication & Security
- **Session-Based Authentication** - Secure login/logout system
- **User Registration** - Self-registration with email validation
- **Password Reset** - Email-based password recovery
- **Role-Based Middleware** - Admin-only access to sensitive features
- **CSRF Protection** - Built-in security measures

### User Interface
- **Responsive Design** - Mobile-friendly interface
- **Professional Sidebar** - Clean navigation with role-based menu items
- **Modal Forms** - User-friendly create/edit interfaces
- **Data Visualization** - Interactive charts and graphs
- **Drag & Drop** - Intuitive task management

### Data & Analytics
- **Visual Reports** - Bar charts, pie charts, and line graphs
- **Task Statistics** - Completion rates and project insights
- **User Activity** - Task assignments and progress tracking
- **Automated Scheduling** - Daily report generation

## 🛠 Tech Stack

### Backend
- **Laravel 11** - PHP framework
- **SQLite/MySQL** - Database
- **Eloquent ORM** - Database relationships
- **Queue Jobs** - Asynchronous processing
- **Laravel Scheduler** - Automated tasks

### Frontend
- **Inertia.js** - SPA framework
- **React 18** - UI components
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **@hello-pangea/dnd** - Drag and drop

### Testing
- **PHPUnit** - Backend testing
- **Feature Tests** - End-to-end testing
- **Factory Pattern** - Test data generation

## 📋 Requirements

- PHP 8.2+
- Node.js 18+
- Composer
- NPM/Yarn

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd kanban-assessment
```

### 2. Install Dependencies
```bash
# Backend dependencies
composer install

# Frontend dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database (SQLite for development)
touch database/database.sqlite
```

### 4. Database Setup
```bash
# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

### 5. Build Assets
```bash
# Build frontend assets
npm run build

# Or for development
npm run dev
```

### 6. Start Development Server
```bash
# Start Laravel server
php artisan serve

# In another terminal, start queue worker
php artisan queue:work

# In another terminal, start scheduler (for production)
php artisan schedule:work
```

## 👥 Default Users

The seeder creates these default users:

- **Admin User**
  - Email: `admin@example.com`
  - Password: `password`
  - Role: `admin`

- **Member User**
  - Email: `member@example.com`
  - Password: `password`
  - Role: `member`

## 🔧 Configuration

### Queue Configuration
```env
QUEUE_CONNECTION=database
```

### Scheduler Configuration
The scheduler is configured in `routes/console.php`:
```php
Schedule::command('reports:generate')->daily();
```

### Chart Configuration
Charts are configured in the `ReportController` and use Chart.js for visualization.

## 📊 Features Overview

### Dashboard
- Project overview with task statistics
- Quick access to all projects
- Generate reports button
- User activity summary

### Projects
- **Project List** - View all projects with statistics
- **Create Project** - Add new projects with name and description
- **Edit Project** - Update project details
- **Delete Project** - Remove projects (with confirmation)

### Tasks (Kanban Board)
- **Drag & Drop** - Move tasks between columns (Pending, In Progress, Done)
- **Create Tasks** - Add new tasks with assignment and due dates
- **Edit Tasks** - Update task details and assignments
- **Delete Tasks** - Remove tasks with confirmation
- **User Assignment** - Assign tasks to team members
- **Due Dates** - Set and track task deadlines

### Users (Admin Only)
- **User List** - View all users with roles and statistics
- **Create User** - Add new users with role assignment
- **Edit User** - Update user details and roles
- **Delete User** - Soft delete users (with restore option)
- **Role Management** - Admin and member role assignment

### Reports
- **Visual Charts** - Bar charts, pie charts, and line graphs
- **Task Statistics** - Completion rates and project insights
- **Automated Generation** - Daily report creation
- **Export Options** - Data visualization and insights

## 🧪 Testing

### Run All Tests
```bash
php artisan test
```

### Run Specific Test Suites
```bash
# Authentication tests
php artisan test --filter=AuthenticationTest

# Project management tests
php artisan test --filter=ProjectManagementTest

# Task management tests
php artisan test --filter=TaskManagementTest

# User management tests
php artisan test --filter=UserManagementTest

# Role-based access tests
php artisan test --filter=RoleBasedAccessTest

# Reports tests
php artisan test --filter=ReportsTest

# Integration tests
php artisan test --filter=IntegrationTest
```

### Test Coverage
- ✅ Authentication flow
- ✅ Project CRUD operations
- ✅ Task management and drag-drop
- ✅ User management and roles
- ✅ Role-based access control
- ✅ Report generation and charts
- ✅ Integration workflows

## 🔐 Security Features

### Authentication
- Session-based authentication
- Password hashing with bcrypt
- CSRF protection on all forms
- Secure password reset flow

### Authorization
- Role-based middleware
- Admin-only user management
- Protected routes and resources
- Proper access control

### Data Protection
- Soft deletes for users
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📈 Performance

### Optimization
- Database indexing
- Efficient queries with relationships
- Queue processing for heavy tasks
- Optimized asset building

### Scalability
- Modular architecture
- Service layer pattern
- Queue-based processing
- Caching strategies

## 🚀 Deployment

### Production Setup
1. Configure production database
2. Set up queue workers
3. Configure scheduler
4. Set up asset compilation
5. Configure environment variables

### Queue Workers
```bash
# Start queue workers
php artisan queue:work --daemon

# Monitor queue
php artisan queue:monitor
```

### Scheduler
```bash
# Add to crontab
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Assessment Completion

This project demonstrates:

- ✅ **Laravel 11** - Modern PHP framework usage
- ✅ **Inertia.js + React** - SPA architecture
- ✅ **Database Design** - Proper relationships and migrations
- ✅ **Service Pattern** - Clean architecture
- ✅ **Queue Jobs** - Asynchronous processing
- ✅ **Laravel Scheduler** - Automated tasks
- ✅ **Role-Based Access** - Security implementation
- ✅ **Data Visualization** - Chart.js integration
- ✅ **Testing** - Comprehensive test coverage
- ✅ **Professional UI** - Modern, responsive design

## 📞 Support

For questions or issues, please create an issue in the repository or contact the development team.

---

**Built with ❤️ using Laravel, Inertia.js, and React**