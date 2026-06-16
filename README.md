# Apex Finance LLC — Loan Brokerage Web Application

A production-grade, full-stack loan brokerage web application built with React, Node.js, Express, and MongoDB.

## 🏗️ Tech Stack

**Frontend:** React.js, Tailwind CSS v4, React Router, Framer Motion, Chart.js, React Quill  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Multer, Nodemailer  

## 📁 Project Structure

```
/apex-finance
├── /client                 → React frontend (Vite)
│   ├── /src
│   │   ├── /components     → Reusable components
│   │   ├── /pages          → Public pages (Home, About, Loans, etc.)
│   │   └── /pages/admin    → Admin panel pages
│   └── index.html
├── /server                 → Node.js backend
│   ├── /config             → Database config
│   ├── /controllers        → Business logic
│   ├── /emails             → Email templates
│   ├── /middleware          → Auth, upload, rate limiting
│   ├── /models             → MongoDB schemas
│   ├── /routes             → API routes
│   ├── /uploads            → Uploaded documents
│   └── index.js            → Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free) or local MongoDB

### 1. Clone & Install

```bash
# Install server dependencies
cd apex-finance/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env` and update:
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — A strong secret key
- `SENDGRID_API_KEY` — Your SendGrid API key (optional for dev)

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates:
- **Admin user:** admin@apexfinancellc.com / admin123456
- **6 sample blog posts**

### 4. Start Development

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin Panel: http://localhost:5173/admin/login

## 🔑 Admin Credentials

```
Email: admin@apexfinancellc.com
Password: admin123456
```

⚠️ Change the password after first login!

## 📧 Email Configuration

Emails work in two modes:
1. **Development:** Emails are logged to console (no SendGrid needed)
2. **Production:** Set `SENDGRID_API_KEY` in `.env` for real email delivery

## 🔒 Security Features

- JWT authentication for admin routes
- Bcrypt password hashing (12 rounds)
- Rate limiting (3 applications/IP/day)
- File upload validation (PDF/JPG/PNG, 5MB max)
- MongoDB query sanitization
- Helmet security headers
- CORS configuration

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, stats, products, calculator, testimonials |
| About | `/about` | Company story, team, values, NMLS |
| Loans | `/loans` | 6 detailed loan product cards |
| Apply | `/apply` | 4-step application form |
| Calculator | `/calculator` | EMI calculator with amortization |
| Blog | `/blog` | Blog listing with categories |
| Blog Post | `/blog/:slug` | Single blog post |
| FAQ | `/faq` | Accordion Q&A with search |
| Contact | `/contact` | Contact form with Google Maps |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms & conditions |

## 🛠️ Admin Panel

| Page | Route |
|------|-------|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Applications | `/admin/applications` |
| Application Detail | `/admin/applications/:id` |
| Blog Management | `/admin/blog` |
| Blog Editor | `/admin/blog/new` |
| Settings | `/admin/settings` |

## 📝 License

© 2024 Apex Finance LLC. All rights reserved.  
NMLS# 123456 | Not a lender. We connect borrowers with lenders.
