# 🎟️ Event Buddy – Backend (NestJS)

This is the backend service for **Event Buddy**, an event booking system built for the Deepchain Labs Full-Stack Internship Round 1 assessment.

## 🚀 Tech Stack

- **NestJS** (TypeScript)
- **PostgreSQL** (via TypeORM)
- **JWT Authentication**
- **Class Validator + Pipes** for clean validation
- **Postman Tested** (admin/user flows)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nocillax/event-buddy-backend.git
cd event-buddy-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=eventbuddy
JWT_SECRET=supersecretkey
```

> 📝 Use `your_db_username` and `your_db_password` as per your local PostgreSQL setup.

### 4. Set up PostgreSQL

- Create a database named `eventbuddy`
- Tables will be auto-generated on app start (thanks to `synchronize: true`)

### 5. Run the app

```bash
npm run start:dev
```

---

## 📌 API Overview (Testable via Postman)

### 🔐 Auth

| Route             | Method | Description          |
|------------------|--------|----------------------|
| `/auth/signup`   | POST   | Register a user      |
| `/auth/login`    | POST   | Login & get JWT      |

### 📅 Events

| Route                | Method | Role    | Description              |
|---------------------|--------|---------|--------------------------|
| `/events`           | GET    | Public  | List all events          |
| `/events/:id`       | GET    | Public  | Event details            |
| `/events?upcoming=` | GET    | Public  | Filter past/upcoming     |
| `/events`           | POST   | Admin   | Create new event         |
| `/events/:id`       | PATCH  | Admin   | Edit event (partial)     |
| `/events/:id`       | DELETE | Admin   | Delete event             |

### 🎟 Bookings

| Route           | Method | Role  | Description                 |
|----------------|--------|-------|-----------------------------|
| `/bookings`    | POST   | User  | Book 1–4 seats              |
| `/bookings/me` | GET    | User  | View user’s booked events   |

---

## ✅ Validation & Security

- Full request validation using `class-validator`
- Forbidden unknown fields via `ValidationPipe`
- 400/403/404 errors with helpful messages
- Password never exposed in responses

---

## 🧪 Testing

Use [Postman](https://www.postman.com/) to test endpoints.

> ✅ Admin credentials should be manually assigned in DB via SQL:
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## 👨‍💻 Author

Built by [Your Name] as part of the Deepchain Labs Full-Stack Internship Round 1 submission.
