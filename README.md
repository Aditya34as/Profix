<div align="center">

# 🔧 Pro Fix India

### _Trusted Home Services Marketplace_

A full-stack **MERN** application that connects customers with verified local service professionals — AC repair, plumbing, geyser installation, electrical work, and more.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

[Live Demo](https://profix-front.onrender.com) · [Report Bug](https://github.com/Aditya34as/Profix/issues) · [Request Feature](https://github.com/Aditya34as/Profix/issues)

</div>

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Seed Admin User](#seed-admin-user)
  - [Running Locally](#running-locally)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [SEO Strategy](#-seo-strategy)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🏠 About the Project

**Pro Fix India** is a production-grade, location-aware home services marketplace built with the MERN stack. The platform enables three distinct user roles — **Customers**, **Business Owners**, and **Admins** — each with dedicated dashboards and workflows.

Customers discover nearby service providers through geolocation-based search, view shop profiles, read reviews, and submit service requests. Business owners register their shops, manage leads, upload galleries, and track customer inquiries. Admins oversee the entire marketplace through a dedicated panel with shop approval workflows and platform analytics.

---

## ✨ Key Features

### For Customers
- 🔍 **Geolocation-Based Service Discovery** — Find nearby service providers using MongoDB `2dsphere` geospatial queries
- 📋 **Service Categories** — Browse AC repair, plumbing, geyser/water heater, electrical, carpentry, painting, cleaning, and pest control
- 🏪 **Shop Profiles** — View detailed provider profiles with galleries, reviews, ratings, and contact information
- ⭐ **Reviews & Ratings** — Submit and read reviews with a 5-star rating system
- 📞 **Direct Contact** — One-tap Call Now and WhatsApp integration with business phone numbers
- 📝 **Lead Submission** — Request service through a contact form that generates tracked leads
- 🔄 **Compare Shops** — Side-by-side comparison of multiple service providers

### For Business Owners
- 📊 **Business Dashboard** — Manage shop profile, view incoming leads, and track business performance
- 🖼️ **Gallery Management** — Upload profile and gallery images via Multer-powered file handling
- 📍 **Location Pin** — Set precise business location with auto-detect via reverse geocoding (OpenStreetMap Nominatim)
- 📈 **Lead Tracking** — View and manage customer service requests with status tracking (new → contacted → completed)
- ⚙️ **Shop Settings** — Update services, opening hours, description, and contact details
- 🗑️ **Delete Shop** — Full shop removal capability for business owners

### For Admins
- 🛡️ **Admin Panel** — Centralized dashboard for platform management
- ✅ **Shop Approval Workflow** — Review and approve/reject new business registrations
- 👥 **User Management** — Oversee registered customers and business accounts
- 📊 **Platform Analytics** — Monitor total shops, active users, and lead metrics

### Platform-Wide
- 🔐 **JWT Authentication** — Secure token-based authentication with bcrypt password hashing
- 🎭 **Role-Based Access Control (RBAC)** — Three-tier role system (Customer, Business, Admin) with route guards
- 📱 **Fully Responsive** — Mobile-first design that works across all devices
- ⚡ **Code Splitting** — Lazy-loaded pages with React Suspense for optimal performance
- 🎨 **Premium UI** — GSAP animations, glassmorphism effects, and curated design system
- 🔔 **Toast Notifications** — Real-time user feedback via Sonner toast library
- 🌐 **Production-Grade SEO** — Comprehensive SEO optimization (see [SEO Strategy](#-seo-strategy))

---

## 🛠️ Tech Stack

| Layer          | Technology                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Frontend**   | React 18, React Router 6, Vite 5, GSAP, Lucide React, React Helmet Async, Sonner               |
| **Backend**    | Node.js, Express 5, Mongoose ODM, Multer (file uploads)                                        |
| **Database**   | MongoDB Atlas with 2dsphere geospatial indexing and text search indexes                         |
| **Auth**       | JSON Web Tokens (JWT), bcryptjs (password hashing)                                              |
| **Geocoding**  | OpenStreetMap Nominatim (reverse geocoding proxy)                                               |
| **Analytics**  | Google Analytics 4 (gtag.js)                                                                    |
| **Deployment** | Render (frontend static site + backend web service)                                             |
| **SEO**        | JSON-LD structured data, Open Graph, Twitter Cards, sitemap.xml, robots.txt, canonical URLs     |
| **Typography** | Google Fonts — Inter, Public Sans                                                               |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│  React 18 + React Router 6 + Vite 5                             │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────────┐  │
│  │AuthPage │ │Home/Find │ │ Dashboard │ │   Admin Panel      │  │
│  │(Guest)  │ │Services  │ │ (Business)│ │   (Admin Only)     │  │
│  └─────────┘ └──────────┘ └───────────┘ └────────────────────┘  │
│       │            │             │                │              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  AuthContext (JWT storage, role detection, route guards) │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────▼───────────────────────────────────────┐
│                     Express 5 API Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ /api/auth    │  │ /api/shops   │  │ /api/users           │   │
│  │ register     │  │ CRUD + geo   │  │ profile, admin ops   │   │
│  │ login        │  │ leads        │  │                      │   │
│  └──────────────┘  │ reviews      │  └──────────────────────┘   │
│                    │ approve      │                              │
│  Middleware:       └──────────────┘                              │
│  ├── protect (JWT for shops)                                    │
│  ├── protectUser (JWT for customers/admins)                     │
│  ├── requireAdmin (admin-only enforcement)                      │
│  └── upload (Multer file handling)                              │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    MongoDB Atlas                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                │
│  │ Users  │  │ Shops  │  │ Leads  │  │Reviews │                │
│  │        │  │2dsphere│  │        │  │        │                │
│  │customer│  │  index │  │  ref → │  │ ref →  │                │
│  │ admin  │  │  text  │  │  Shop  │  │  Shop  │                │
│  └────────┘  │ index  │  └────────┘  └────────┘                │
│              └────────┘                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
pro-fix-mern/
│
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification, RBAC guards
│   │   └── upload.js              # Multer configuration for file uploads
│   ├── models/
│   │   ├── User.js                # Customer & Admin user schema
│   │   ├── Shop.js                # Business listing schema (geospatial)
│   │   ├── Lead.js                # Service request / lead schema
│   │   └── Review.js              # Shop review & rating schema
│   ├── routes/
│   │   ├── authRoutes.js          # Registration, login, token refresh
│   │   ├── shopRoutes.js          # Shop CRUD, search, leads, reviews
│   │   └── userRoutes.js          # User profile, admin operations
│   ├── seed-admin.js              # Idempotent admin user provisioning
│   ├── server.js                  # Express app entry point
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── sitemap.xml            # SEO sitemap
│   │   ├── robots.txt             # Search engine directives
│   │   ├── manifest.json          # PWA manifest
│   │   ├── _redirects             # SPA rewrite rules (Render/Netlify)
│   │   ├── _headers               # Security & caching headers
│   │   └── *.png / *.svg          # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive navigation with role awareness
│   │   │   ├── Footer.jsx         # Site footer with contact & social links
│   │   │   ├── SEO.jsx            # Dynamic meta tags & JSON-LD schemas
│   │   │   ├── ShopCard.jsx       # Service provider card component
│   │   │   ├── CompareModal.jsx   # Shop comparison modal
│   │   │   ├── ContactForm.jsx    # Lead submission form
│   │   │   ├── LocationPicker.jsx # Geolocation / address picker
│   │   │   ├── NearbyShops.jsx    # Proximity-based shop list
│   │   │   ├── Stars.jsx          # Star rating display
│   │   │   ├── WhatsAppFloat.jsx  # Floating WhatsApp CTA button
│   │   │   ├── AnnouncementBar.jsx# Top announcement banner
│   │   │   ├── ScrollReset.jsx    # Route-change scroll reset
│   │   │   └── ScrollToTop.jsx    # Scroll-to-top button
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state & API helpers
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx       # Unified sign-in / sign-up page
│   │   │   ├── Home.jsx           # Landing page for customers
│   │   │   ├── FindServices.jsx   # Service discovery with geo search
│   │   │   ├── ACRepair.jsx       # AC repair service page
│   │   │   ├── Plumbing.jsx       # Plumbing service page
│   │   │   ├── Geyser.jsx         # Geyser / water heater service page
│   │   │   ├── ShopProfile.jsx    # Individual shop detail page
│   │   │   ├── ShopDashboard.jsx  # Business owner dashboard
│   │   │   ├── AdminPanel.jsx     # Admin management panel
│   │   │   ├── RegisterShop.jsx   # Business registration flow
│   │   │   ├── LoginShop.jsx      # Business login (legacy)
│   │   │   ├── UserLogin.jsx      # Customer login (legacy)
│   │   │   ├── UserRegister.jsx   # Customer registration (legacy)
│   │   │   └── NotFound.jsx       # 404 page
│   │   ├── App.jsx                # Root component with route guards
│   │   ├── App.css                # App-level styles
│   │   ├── index.css              # Design system & global styles
│   │   └── main.jsx               # React DOM entry point
│   ├── index.html                 # HTML template with SEO meta tags
│   ├── vite.config.js             # Vite build configuration
│   ├── .env.example               # Frontend env template
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (ships with Node.js)
- **MongoDB Atlas** account or local MongoDB instance — [Create Free Cluster](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aditya34as/Profix.git
cd Profix

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create `.env` files from the provided templates:

**Backend** (`backend/.env`):
```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/profix?retryWrites=true&w=majority

# Server port
PORT=5000

# JWT secret — use a strong, random string in production
JWT_SECRET=your_jwt_secret_key_here

# Admin key for legacy shop approval
ADMIN_KEY=your_admin_key_here

# Admin seed credentials (for initial admin user)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

**Frontend** (`frontend/.env`):
```env
# Backend API base URL (no trailing slash)
VITE_API_URL=http://localhost:5000
```

### Seed Admin User

Provision the first admin user (idempotent — safe to run multiple times):

```bash
cd backend
node seed-admin.js
```

> The admin can then sign in via the `/auth` page using the **Customer** flow with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` credentials. The system automatically detects the admin role and redirects to the Admin Panel.

### Running Locally

Open **two terminal windows**:

```bash
# Terminal 1 — Start the backend
cd backend
npm run dev
# ✅ Server runs on http://localhost:5000

# Terminal 2 — Start the frontend
cd frontend
npm run dev
# ✅ App runs on http://localhost:5173
```

Open your browser and navigate to **http://localhost:5173**.

---

## 📡 API Reference

### Authentication

| Method | Endpoint                    | Description                  | Auth     |
| ------ | --------------------------- | ---------------------------- | -------- |
| POST   | `/api/auth/register`        | Register a new customer      | Public   |
| POST   | `/api/auth/login`           | Login (customer / admin)     | Public   |
| POST   | `/api/auth/shop/register`   | Register a new business      | Public   |
| POST   | `/api/auth/shop/login`      | Login (business owner)       | Public   |

### Shops

| Method | Endpoint                         | Description                        | Auth           |
| ------ | -------------------------------- | ---------------------------------- | -------------- |
| GET    | `/api/shops`                     | List all approved shops            | Public         |
| GET    | `/api/shops/:id`                 | Get shop details                   | Public         |
| GET    | `/api/shops/nearby`              | Geospatial nearby search           | Public         |
| PUT    | `/api/shops/:id`                 | Update shop profile                | Shop Owner     |
| DELETE | `/api/shops/:id`                 | Delete shop                        | Shop Owner     |
| POST   | `/api/shops/:id/reviews`         | Submit a review                    | Authenticated  |
| GET    | `/api/shops/:id/reviews`         | Get shop reviews                   | Public         |
| PATCH  | `/api/shops/:id/approve`         | Approve / reject a shop            | Admin          |

### Leads

| Method | Endpoint                    | Description                   | Auth           |
| ------ | --------------------------- | ----------------------------- | -------------- |
| POST   | `/api/contact`              | Submit a service request lead | Public         |
| GET    | `/api/shops/:id/leads`      | Get leads for a shop          | Shop Owner     |

### Users

| Method | Endpoint                    | Description                   | Auth           |
| ------ | --------------------------- | ----------------------------- | -------------- |
| GET    | `/api/users/profile`        | Get current user profile      | Authenticated  |
| GET    | `/api/users/admin/stats`    | Platform analytics            | Admin          |

### Utility

| Method | Endpoint                    | Description                   | Auth     |
| ------ | --------------------------- | ----------------------------- | -------- |
| GET    | `/api/geocode/reverse`      | Reverse geocode (lat, lon)    | Public   |
| GET    | `/api/health`               | Server health check           | Public   |

---

## 🔐 Role-Based Access Control

The platform implements a three-tier RBAC system with both server-side middleware and client-side route guards:

```
┌─────────────┬────────────────────────────────────────────────────┐
│    Role     │                  Access Level                     │
├─────────────┼────────────────────────────────────────────────────┤
│  Customer   │ Browse services, find shops, submit leads,        │
│             │ write reviews, view shop profiles                 │
├─────────────┼────────────────────────────────────────────────────┤
│  Business   │ Manage shop profile, view/manage leads,           │
│  Owner      │ upload images, update services & hours             │
├─────────────┼────────────────────────────────────────────────────┤
│  Admin      │ Approve/reject shops, manage users,               │
│             │ view platform analytics, all customer permissions  │
└─────────────┴────────────────────────────────────────────────────┘
```

**Server-Side Middleware:**
- `protect` — Verifies JWT for business owner routes
- `protectUser` — Verifies JWT and loads user from database
- `requireAdmin` — Enforces `role === 'admin'` (used after `protectUser`)

**Client-Side Route Guards:**
- `<GuestOnly>` — Auth page (redirects logged-in users to their dashboard)
- `<RequireAuth>` — Protected routes (redirects to `/auth` if unauthenticated)
- `<CustomerOnly>` — Customer-exclusive pages
- `<ShopOnly>` — Business owner-exclusive pages
- `<RoleRedirect>` — Intelligent landing redirect based on user role

---

## 🌐 SEO Strategy

The application implements **16+ SEO optimization techniques** for maximum search engine visibility:

| #  | Technique                    | Implementation                                               |
| -- | ---------------------------- | ------------------------------------------------------------ |
| 1  | Dynamic Meta Tags            | `react-helmet-async` injects per-page title, description     |
| 2  | Canonical URLs               | `<link rel="canonical">` on every page                       |
| 3  | Open Graph Tags              | Full OG metadata for Facebook/LinkedIn sharing               |
| 4  | Twitter Cards                | `summary_large_image` cards for Twitter/X                    |
| 5  | JSON-LD Structured Data      | LocalBusiness, Organization, WebSite, BreadcrumbList schemas  |
| 6  | XML Sitemap                  | `public/sitemap.xml` with all crawlable routes               |
| 7  | Robots.txt                   | Search engine directives in `public/robots.txt`              |
| 8  | Hreflang Tags                | `en-IN` and `x-default` for regional targeting               |
| 9  | Geo Meta Tags                | `geo.region`, `geo.position`, `ICBM` for local SEO          |
| 10 | PWA Manifest                 | `manifest.json` for installability signals                   |
| 11 | Noscript Fallback            | HTML content for non-JS crawlers                             |
| 12 | Semantic HTML                | Proper heading hierarchy and HTML5 elements                  |
| 13 | Image Optimization           | OG images with explicit dimensions                           |
| 14 | DNS Prefetch                 | Preconnect to Google Fonts for faster loading                |
| 15 | Google Analytics 4           | gtag.js integration for traffic analytics                    |
| 16 | SPA Rewrite Rules            | `_redirects` for proper SPA routing on static hosts          |

---

## ☁️ Deployment

The application is deployed on **Render** as two services:

### Backend (Web Service)
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. **Root Directory:** `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add all environment variables from `backend/.env.example`

### Frontend (Static Site)
1. Create a new **Static Site** on [Render](https://render.com)
2. Connect the same repository
3. **Root Directory:** `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`
6. Add `VITE_API_URL` pointing to your backend URL
7. The `_redirects` file in `public/` handles SPA routing automatically

---

## 📸 Screenshots

> _Visit the [Live Demo](https://profix-front.onrender.com) to explore the full application._

---

## 🗺️ Future Roadmap

- [ ] Online payment integration (Razorpay / Stripe)
- [ ] Real-time service tracking with live status updates
- [ ] Push notifications for leads and booking confirmations
- [ ] Multi-language support (Hindi, regional languages)
- [ ] In-app chat between customers and service providers
- [ ] Service scheduling and calendar management
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard for businesses
- [ ] Subscription plans for premium business listings

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

> Please ensure your code follows the existing project conventions and includes appropriate comments.

---

## 👤 Author

**Aditya Singh Chauhan**

- GitHub: [@Aditya34as](https://github.com/Aditya34as)

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

⭐ **Star this repo** if you found it useful!

Built with ❤️ using the MERN Stack

</div>
