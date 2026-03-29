# Inventory Management System — Frontend

React-based frontend for an enterprise-grade Inventory Management System. Communicates exclusively with the Django REST API middleware via JWT-authenticated requests.

## Live Deployment

- **Application:** [https://inventory-management-frontend-2-45qc.onrender.com](https://inventory-management-frontend-2-45qc.onrender.com)
- **API (Middleware):** [https://inventory-management-middleware-2.onrender.com](https://inventory-management-middleware-2.onrender.com)
- **Middleware Repository:** [https://github.com/qaasimdhorat1/inventory-management-middleware-2](https://github.com/qaasimdhorat1/inventory-management-middleware-2)

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 | Component-based UI library |
| Routing | React Router v6 | Client-side page navigation |
| HTTP Client | Axios | API communication with interceptors |
| Authentication | JWT | Secure token-based auth with auto-refresh |
| CI/CD | GitHub Actions | Automated build verification |
| Deployment | Render (Static Site) | Cloud hosting for static assets |

## Architecture

The frontend follows a **modular component architecture** with clear separation of concerns. It communicates **only** with the middleware REST API — no direct database access occurs from the client.
```
┌─────────────────────────────────────────────────────────┐
│                   React Application                      │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   App.js                          │   │
│  │          Routing + Auth Protection                │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                               │
│  ┌──────────┐  ┌────────┴────────┐  ┌───────────────┐  │
│  │ context/ │  │    pages/       │  │ components/   │  │
│  │          │  │                 │  │               │  │
│  │ AuthCtx  │  │  Dashboard     │  │  Navbar       │  │
│  │          │  │  Inventory     │  │  ProtectedRoute│ │
│  │          │  │  Categories    │  │  PublicRoute   │  │
│  │          │  │  Profile       │  │               │  │
│  │          │  │  Login         │  │               │  │
│  │          │  │  Register      │  │               │  │
│  └──────────┘  └────────────────┘  └───────────────┘  │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │                  api/axios.js                     │   │
│  │     Axios instance with JWT interceptors          │   │
│  │     Auto-attaches tokens to requests              │   │
│  │     Auto-refreshes expired access tokens          │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP/HTTPS (JSON)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Middleware REST API (Django)                 │
│        (Separate repository and deployment)              │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure
```
src/
├── api/
│   └── axios.js          # Axios instance with JWT request/response interceptors
├── components/
│   └── Navbar.js         # Navigation bar with auth-aware links
├── context/
│   └── AuthContext.js    # Global authentication state via React Context
├── pages/
│   ├── Login.js          # User login with JWT token storage
│   ├── Register.js       # User registration with form validation
│   ├── ResetPassword.js  # Password reset with identity verification
│   ├── Dashboard.js      # Summary statistics and recent activity
│   ├── Inventory.js      # Full inventory CRUD with search/filter
│   ├── Categories.js     # Category management with item counts
│   └── Profile.js        # Profile viewing/editing and password change
└── App.js                # Route definitions with protected/public wrappers
```

## Features

### Authentication
- User registration with client-side form validation
- JWT login with access and refresh token storage
- Automatic token refresh on 401 responses (transparent to the user)
- Protected routes that redirect unauthenticated users to login
- Public routes that redirect authenticated users to the dashboard
- Profile viewing and editing (username, email, first/last name)
- Password change with current password verification
- Password reset via identity verification (username + email)
- "Forgot password?" link on login page for easy access to reset flow

### Dashboard
- Summary statistics: total items, total quantity, total value, low-stock count, out-of-stock count, category count
- Recent stock change activity feed showing the latest inventory movements
- Real-time data fetched from the middleware API on page load

### Inventory Management
- Full CRUD for inventory items (create, view, edit, delete)
- Search items by name, SKU, or description
- Filter by category and stock status (in stock, low stock, out of stock)
- Sort by name, quantity, price, or date
- Stock level updates with change type (addition, removal, adjustment) and reason tracking
- Stock change history per item
- Visual status indicators with colour-coded badges
- Low-stock alerts displayed prominently

### Categories
- Full CRUD for item categories
- Item count displayed per category
- Categories scoped to the authenticated user

### Pagination
- Paginated inventory item and category lists (10 items per page)
- Previous/Next navigation with page count and total item display
- Automatic page reset when search or filter criteria change

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/qaasimdhorat1/inventory-management-frontend-2.git
cd inventory-management-frontend-2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```
REACT_APP_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

> **Note:** The middleware API must be running locally on port 8000 for the frontend to function. See the [middleware repository](https://github.com/qaasimdhorat1/inventory-management-middleware-2) for setup instructions.

### Production Deployment (Render)

The application is deployed on Render as a Static Site with the following configuration:

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `build` |
| Rewrite Rule | `/*` → `/index.html` (for React Router support) |

Environment variables configured on Render:

| Variable | Purpose |
|----------|---------|
| `REACT_APP_API_URL` | Middleware API base URL (build-time variable) |

## CI/CD

A GitHub Actions pipeline runs automatically on every push to `main`:

1. **Install** — Installs all dependencies via `npm install`
2. **Test** — Runs 5 frontend component tests via `npm test`
3. **Build** — Verifies the production build compiles successfully via `npm run build`

The pipeline configuration is located at `.github/workflows/ci.yml`.

## Security

- **JWT Token Management:** Access tokens stored in `localStorage` and automatically attached to every API request via Axios interceptors.
- **Automatic Token Refresh:** When a 401 response is received, the interceptor attempts to refresh the access token using the stored refresh token. If refresh fails, the user is logged out and redirected to the login page.
- **Protected Routes:** All application pages (Dashboard, Inventory, Categories, Profile) are wrapped in a `ProtectedRoute` component that redirects unauthenticated users to the login page.
- **Public Routes:** Login and Register pages are wrapped in a `PublicRoute` component that redirects already-authenticated users to the dashboard, preventing unnecessary re-authentication.
- **No Direct Database Access:** The frontend never communicates with the database — all data flows through the authenticated middleware API.

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Axios interceptors for JWT** | Handles token attachment and automatic refresh transparently. Individual components do not need to manage authentication headers or handle token expiry. |
| **React Context over Redux** | Auth state is simple (user object + loading flag) and does not require the complexity of a state management library. Context provides sufficient global state sharing. |
| **Inline styles** | Keeps components self-contained and avoids CSS class name conflicts. Each component file contains its own styling, improving readability and maintainability. |
| **Protected/Public route wrappers** | Centralises access control logic. `ProtectedRoute` ensures unauthenticated users cannot access the app; `PublicRoute` ensures logged-in users skip the login/register flow. |
| **Environment variable for API URL** | `REACT_APP_API_URL` allows seamless switching between local development (`localhost:8000`) and production (Render URL) without code changes. Set at build time by Render. |
| **Static Site deployment** | React apps compile to static HTML/CSS/JS files and do not require a server runtime. Deploying as a Static Site on Render is simpler, faster, and free-tier eligible. |
| **Pagination on list pages** | Inventory and category pages include Previous/Next controls that work with the API's paginated responses (10 items/page). Prevents unbounded data loading and ensures the UI remains performant at scale. |

## Repository Migration

This repository (`inventory-management-frontend-2`) is a migrated copy of the original private repository (`inventory-management-frontend`). The migration was necessary due to GitHub account verification issues that prevented the original private repositories from being made public for submission. All commit history has been fully preserved using Git bundle files to transfer the complete history from the original repository to this public one.

## Use of AI

AI tools (Claude by Anthropic) were used as a development aid during this assignment. AI assisted with code scaffolding, debugging, drafting documentation (Including this README), and deployment configuration. All AI-generated code was reviewed, understood, and adapted to fit the project requirements.