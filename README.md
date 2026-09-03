# ENAA Leave

## Leave Management System

ENAA Leave is a web-based leave management system designed to simplify the process of requesting, tracking, and approving employee leave.

The application is built with a Laravel REST API backend and a React frontend.

---

## 📌 Features

### Authentication
- Employee login
- Logout
- Authenticated user retrieval
- Token-based authentication using Laravel Sanctum
- Role-based access control

### Leave Requests
- Create a leave request
- View leave requests
- View a specific leave request
- Cancel/delete a leave request
- Track request status
- Leave types management through the API

### Leave Approval Workflow
- Manager approval
- HR approval
- Reject leave requests
- Store approval information
- Track approval status and approver

### Leave Balances
- Leave balance per employee
- Leave balance by leave type
- Allocated days
- Used days
- Remaining days
- Year-based leave balances

---

## 🛠️ Technologies Used

### Backend
- PHP
- Laravel 11
- Laravel Sanctum
- Spatie Laravel Permission
- MySQL
- REST API

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide React
- FullCalendar

### Development Tools
- Git
- GitHub
- VS Code
- Postman
- WAMP

---

## 📁 Project Structure

```text
ENAA-Leave/
│
├── enaa-laravel-api/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   └── ...
│
└── enaa-leave-react/
    ├── public/
    ├── src/
    ├── package.json
    └── ...
```

---

# 🚀 Installation

## Backend — Laravel API

### 1. Clone the project

```bash
git clone <repository-url>
cd ENAA-Leave/enaa-laravel-api
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=enaa_leave
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate application key

```bash
php artisan key:generate
```

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Start the Laravel server

```bash
php artisan serve
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

# 💻 Frontend — React

Open another terminal:

```bash
cd ENAA-Leave/enaa-leave-react
```

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The frontend will be available at the URL provided by Vite, usually:

```text
http://localhost:5173
```

---

# 🔐 Authentication

The application uses **Laravel Sanctum** for API authentication.

The authentication flow is:

```text
React Frontend
      │
      │ POST /api/login
      ▼
Laravel API
      │
      │ Authentication
      ▼
Personal Access Token
      │
      ▼
React stores token
      │
      │ Authorization: Bearer <token>
      ▼
Protected API endpoints
```

After successful login, the API returns:

```json
{
    "message": "Login successful.",
    "token": "TOKEN",
    "user": {
        "id": 4,
        "name": "Sarah Employee",
        "email": "employee@enaa.local",
        "position": "Web Developer",
        "department": "Technical",
        "roles": [
            "employee"
        ]
    }
}
```

The frontend uses the returned token when accessing protected endpoints such as:

```text
GET /api/me
```

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Get authenticated user |

## Leave Requests

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leave-requests` | Get leave requests |
| POST | `/api/leave-requests` | Create a leave request |
| GET | `/api/leave-requests/{id}` | Get a specific request |
| DELETE | `/api/leave-requests/{id}` | Delete a request |

## Approval

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leave-requests/{id}/approve` | Approve a leave request |
| POST | `/api/leave-requests/{id}/reject` | Reject a leave request |

---

# 👥 Roles

The application supports different user roles through **Spatie Laravel Permission**.

### Employee

Employees can:

- Submit leave requests
- View their leave requests
- Track request status
- View their leave balances

### Manager

Managers can:

- Review employee leave requests
- Approve requests
- Reject requests

### HR

HR can:

- Review leave requests
- Approve requests
- Reject requests
- Participate in the approval workflow

---

# 📊 Leave Balance

Each employee can have a yearly balance for each leave type.

Example:

| Leave Type | Allocated | Used | Remaining |
|---|---:|---:|---:|
| Paid Leave | 22 | 3 | 19 |
| Sick Leave | 10 | 0 | 10 |
| Exceptional Leave | 3 | 0 | 3 |

The balance is updated when an approved leave request consumes leave days.

---

# 🔄 Leave Approval Workflow

The approval process follows a multi-level workflow.

```text
Employee
   │
   │ Submit leave request
   ▼
Manager
   │
   │ Approve / Reject
   ▼
HR
   │
   │ Approve / Reject
   ▼
Final Decision
```

A leave request can contain information about:

- Requester
- Leave type
- Start date
- End date
- Duration
- Reason
- Status
- Approvals
- Approvers
- Approval dates
- Rejection reason

---

# 🗄️ Database

The application uses MySQL.

Main entities include:

```text
users
departments
leave_types
leave_balances
leave_requests
leave_approvals
replacement_plans
holidays
personal_access_tokens
```

The database is managed using Laravel migrations.

---

# 🧪 API Testing

The API can be tested using tools such as:

- Postman
- Insomnia
- Browser
- React frontend

Example:

```http
POST http://127.0.0.1:8000/api/login
```

For protected requests:

```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

---

# 🎨 Frontend

The frontend provides a modern interface for managing employee leave.

Current interface includes:

- Login page
- Authentication handling
- User information
- Dashboard
- Responsive UI
- Tailwind CSS styling

---

# 🔧 Development

### Backend

```bash
cd enaa-laravel-api

php artisan serve
```

### Frontend

```bash
cd enaa-leave-react

npm run dev
```

---

# 📦 Build for Production

### Frontend

```bash
npm run build
```

The production files are generated in:

```text
dist/
```

### Backend

Laravel can be prepared for production using:

```bash
composer install --optimize-autoloader --no-dev
```

---

# 🐳 Docker

Docker configuration will be added for:

- Laravel API
- React frontend

The project will use separate containers for the backend and frontend.

---

# 📄 License

This project was developed as part of an ENAA development project.

© 2026 ENAA — Leave Management System
