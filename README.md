# Inventory Management System — Frontend

React-based frontend for an enterprise-grade Inventory Management System. Communicates exclusively with the Django REST API middleware via JWT-authenticated requests.

## Technology Stack

- **Framework:** React 19
- **Routing:** React Router v7
- **HTTP Client:** Axios with JWT interceptors
- **Authentication:** JWT with automatic token refresh
- **Deployment:** Render (Static Site)

## Architecture

The frontend follows a modular component structure with clear separation of concerns:

- **src/api/** — Axios instance with request/response interceptors for JWT management
- **src/context/** — React Context for global authentication state
- **src/components/** — Reusable UI components (Navbar)
- **src/pages/** — Page-level components organised by feature

The frontend communicates **only** with the middleware REST API. No direct database access occurs from the client.

## Features

### Authentication
- User registration with form validation
- JWT login with secure token storage
- Automatic token refresh on expiry
- Protected routes redirecting unauthenticated users
- Profile viewing and editing
- Password change with current password verification

### Inventory Management
- Full CRUD for inventory items
- Search items by name, SKU, or description
- Filter by category and stock status
- Stock level updates (addition, removal, adjustment) with reason tracking
- Automatic status indicators (in stock, low stock, out of stock)

### Categories
- Full CRUD for item categories
- Item count display per category

### Dashboard
- Summary statistics (total items, quantity, value, alerts)
- Recent stock change activity feed

## Setup and Installation

### Prerequisites

- Node.js 18+
- npm

### Local Development

1. Clone the repository:
```bash
   git clone https://github.com/qaasimdhorat1/inventory-management-frontend.git
   cd inventory-management-frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Start the development server:
```bash
   npm start
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the project root to configure the API URL:
```
REACT_APP_API_URL=http://localhost:8000/api
```

For production, set this to your deployed middleware URL.

## CI/CD

A GitHub Actions pipeline runs automatically on every push to `main`:

1. **Install** — Installs all dependencies
2. **Build** — Verifies the production build compiles successfully

## Key Technical Decisions

- **Axios interceptors** handle JWT token attachment and automatic refresh transparently, so individual components don't need to manage authentication headers.
- **React Context** was chosen over Redux for auth state because the auth state is simple (user object + loading flag) and doesn't require the complexity of a state management library.
- **Inline styles** were used to keep components self-contained and avoid CSS class name conflicts, while maintaining readability within each component file.
- **Protected and Public route wrappers** ensure unauthenticated users cannot access the app and logged-in users are redirected away from login/register pages.