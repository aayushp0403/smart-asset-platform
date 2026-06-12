# Smart Asset Management & Resource Allocation Platform

A full-stack web application for a Cultural Council to manage shared resources — track inventory, handle booking requests, approve/reject loans, and monitor overdue returns.

https://github.com/user-attachments/assets/a47087cc-5881-47b2-b08c-47826f43b483

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React (Vite + SWC), Tailwind CSS v3  |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB (Mongoose ODM)               |
| Auth       | JWT (JSON Web Tokens) + bcryptjs     |
| Charts     | Recharts                             |
| Dev Tools  | VS Code, Git, GitHub, WSL Ubuntu     |

---

## Features

### User
- Register & Login with JWT auth
- Browse and search/filter available assets
- Submit booking requests with quantity, dates, and purpose
- View personal borrowing history with status tracking
- Visual chart summary of own bookings

### Admin
- Add, view, and delete assets from inventory
- Approve or reject pending booking requests
- Mark approved bookings as returned
- View overdue bookings with alert panel
- Analytics dashboard with:
  - Booking status pie chart
  - Asset availability bar chart
  - Live stat cards (total assets, pending, active, overdue)

---

## Project Structure

```text
smart-asset-platform/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── asset.controller.js
│   │   └── booking.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Asset.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── asset.routes.js
│   │   └── booking.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── BookingModal.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── UserHistory.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## Local Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017
- Git

### 1. Clone the repo

```bash
git clone https://github.com/aayushp0403/smart-asset-platform.git
cd smart-asset-platform
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/asset_management
JWT_SECRET=supersecretkey123
```

Start the backend:

```bash
node server.js
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Start MongoDB (if not running)

```bash
sudo systemctl start mongod
```

---

## API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login & get token |
| GET | /api/auth/me | User | Get current user |
| GET | /api/assets | User | Get all assets |
| POST | /api/assets | Admin | Add new asset |
| PUT | /api/assets/:id | Admin | Update asset |
| DELETE | /api/assets/:id | Admin | Delete asset |
| POST | /api/bookings | User | Create booking request |
| GET | /api/bookings/my | User | Get own bookings |
| GET | /api/bookings | Admin | Get all bookings |
| GET | /api/bookings/overdue | Admin | Get overdue bookings |
| PATCH | /api/bookings/:id/approve | Admin | Approve booking |
| PATCH | /api/bookings/:id/reject | Admin | Reject booking |
| PATCH | /api/bookings/:id/return | Admin | Mark as returned |

---

## Default Roles

Register with `role: admin` to access the Admin Dashboard.  
Register with `role: user` (default) for the User Dashboard.

---

## Author

**Aayush Patel** — [@aayushp0403](https://github.com/aayushp0403)
