# 🎟️ DCL Event Buddy – Full Stack Application


Event Buddy is a full-stack event management platform allowing users to browse and book events, and giving admins full control over event listings. This repo contains both the **frontend (Next.js)** and **backend (NestJS + PostgreSQL)** services.

---

## 🚀 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeORM, PostgreSQL
- **Authentication:** JWT-based
- **Validation:** class-validator (server), custom client-side validation
- **API Testing:** Postman

---

## 📁 Project Structure

```
/DCL-Event-Buddy
│
├── frontend/    → Next.js client (port: 3001)
├── backend/     → NestJS API server (port: 3000)
└── README.md    → You're here
```

---

## ⚙️ Global Setup (Recommended)

Install dependencies for both frontend and backend with one command:

```bash
npm run install-all
```

You can run both the frontend and backend in one terminal using:

```bash
npm run start:all
```

This uses the `concurrently` package to start both dev servers.

If you haven't already installed it, run:

```bash
npm install --save-dev concurrently
```

> Alternatively, you can run each server separately.

---

## 🧩 Frontend Setup – Next.js (Port: 3001)

### 1. Navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start the frontend dev server

```bash
npm run dev
```

---

## 🛠 Backend Setup – NestJS (Port: 3000)

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=eventbuddy
JWT_SECRET=supersecretkey
```

### 4. Set up the database

- Ensure PostgreSQL is running
- Create a database named `eventbuddy`
- Tables will be auto-created on app start (`synchronize: true`)

### 5. Run the backend dev server

```bash
npm run start:dev
```

---

## 🌐 Frontend Routes Overview

| Route        | Access        | Description                      |
| ------------ | ------------- | -------------------------------- |
| `/`          | Public        | Homepage with events list        |
| `/event/:id` | Public        | Event details page               |
| `/signin`    | Public        | User sign in                     |
| `/signup`    | Public        | User registration                |
| `/dashboard` | Authenticated | User dashboard for booked events |
| `/admin`     | Admin Only    | Admin dashboard to manage events |

> 🔐 Authenticated routes require a valid JWT. Admin routes check for `role = 'admin'`.

---

### 🔑 How to Set Up an Admin User

By default, all users who register through `/auth/signup` are created with the role `user`. To promote someone to an admin (so they can access the admin dashboard and manage events), you need to manually update their role in the database.

#### ✅ Example:

After registering a user with the email `admin@example.com`, run the following SQL in your PostgreSQL database:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com';
```

> 💡 You can run this command using tools like **pgAdmin**, **DBeaver**, or directly in the terminal using `psql`.

Once updated, that user will have full admin privileges on login.

---

## 📌 API Overview

### 🔐 Auth Routes

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| POST   | /auth/signup | Register a user |
| POST   | /auth/login  | Login + JWT     |

### 📅 Events

| Method | Endpoint              | Role   | Description            |
| ------ | --------------------- | ------ | ---------------------- |
| GET    | /events               | Public | List all events        |
| GET    | /events/:id           | Public | Get event details      |
| GET    | /events?upcoming=true | Public | Filter upcoming events |
| POST   | /events               | Admin  | Create event           |
| PATCH  | /events/:id           | Admin  | Edit event             |
| DELETE | /events/:id           | Admin  | Delete event           |

### 🎟 Bookings

| Method | Endpoint     | Role | Description      |
| ------ | ------------ | ---- | ---------------- |
| POST   | /bookings    | User | Book 1–4 seats   |
| GET    | /bookings/me | User | View my bookings |

---

## ✅ Validation & Auth Notes

- Uses NestJS `ValidationPipe` for DTO validation
- JWT token required for user and admin actions
- Role-based guards protect sensitive routes
- Passwords are hashed & excluded from responses

---

## 👨‍💻 Author

NoCiLLaX
