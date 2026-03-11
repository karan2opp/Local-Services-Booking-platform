# LocalPro — Local Services Booking Platform

> A full-stack MERN web application connecting customers with trusted local service professionals.

🌐 **Live Demo:** [https://local-services-booking-platform-1.onrender.com](https://local-services-booking-platform-1.onrender.com)

---

## Project Overview

LocalPro is a two-sided marketplace that solves a common problem — customers struggle to find reliable local service providers (plumbers, cleaners, electricians, salon workers etc.), and skilled professionals have no digital platform to showcase their work or manage bookings.

LocalPro bridges this gap by providing:
- A searchable directory of local services
- A verified provider onboarding system
- A complete booking lifecycle management system
- An admin panel to manage providers and categories

The platform supports **three user roles** — Customer, Service Provider, and Admin — each with their own dedicated interface and permissions.

---

## Features Implemented

### 👤 Customer
- Browse and search services by keyword, category, city, and area
- View detailed service pages with before/after portfolio images
- Book services with date, address, and notes
- View, track, and cancel bookings by status (pending, confirmed, inProgress, completed, cancelled)

### 🔧 Service Provider
- Register as a professional and submit for admin approval
- Create, update, and delete service listings with cover images
- Upload before/after portfolio images (up to 3 pairs per service)
- Accept, reject, and manage incoming booking requests
- View dashboard with active bookings and service listings
- Update business profile (phone, experience, address)

### 🛡️ Admin
- Review and approve or reject pending provider applications
- Manage service categories — create, update, and delete
- View all approved and rejected providers
- Dedicated admin dashboard with sidebar navigation

### ⚙️ General
- JWT authentication with httpOnly cookies
- Auth persistence using Zustand persist middleware
- Protected routes based on user role
- Responsive design for mobile and desktop
- Image compression before upload
- Real-time popup notifications for all actions

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/local-services-booking-platform.git
cd local-services-booking-platform
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
node index.js
```

Backend runs at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside the `Frontend` folder:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Create Admin Account

Dummy admin credentials:

email: admin@gmail.com
password: admin123 

---

## Deployment Link

| Service | URL |
|---------|-----|
| 🌐 Frontend | https://local-services-booking-platform-1.onrender.com |
| ⚙️ Backend API | https://local-services-booking-platform-dvga.onrender.com |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Zustand, React Router v6, Tailwind CSS, Vite |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT + httpOnly Cookies, bcrypt |
| File Storage | Cloudinary |
| Database | MongoDB Atlas |
| Deployment | Render |
