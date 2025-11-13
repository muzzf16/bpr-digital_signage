# QWEN.md - BPR Digital Signage System

## Project Overview

The BPR Digital Signage System is a modern, centralized, and secure digital information display application developed for Bank Perkreditan Rakyat (BPR). The system enables real-time display of promotional products, savings/deposit interest rates, and economic information on branch TV screens. It includes both a digital signage player for TV displays and an admin interface for content management.

## Conversation Context

Date: Kamis, 13 November 2025
OS: Windows (win32)
Project Directory: D:\bpr-signage

### Core Features
- **Promotional Content**: Display promotional media and bank branding
- **Interest Rate Information**: Real-time savings and deposit rates connected to CMS
- **Economic Data**: Official exchange rates from Bank Indonesia (SOAP), BCA Exchange rates, gold prices from GoldAPI, and IHSG from Yahoo Finance
- **News Feed**: Economic news from various sources (CNBC, Kontan, Antara)
- **Remote Management**: Centralized content updates from headquarters
- **Offline Mode**: PWA with local data storage for branch TV systems
- **High Security**: JWT and TLS-protected access
- **Admin Dashboard**: Comprehensive management interface with modules for content, rates, news, economic data, devices, and announcements

### Architecture
- **Frontend**: React PWA with Vite and Tailwind CSS
- **Backend**: Node.js with Express
- **External APIs**: Bank Indonesia SOAP, BCA Exchange Rates, GoldAPI, Yahoo Finance, RSS feeds
- **Authentication**: JWT and API Key per device
- **Database**: SQLite for user management and audit trails
- **Deployment**: Docker, Nginx, Vercel

## Project Structure
```
bpr-digital_signage/
├── backend/
│   ├── src/
│   │   ├── data/          # Mock data
│   │   ├── db/            # Database utilities
│   │   ├── hooks/         # Application hooks
│   │   ├── models/        # Database models
│   │   ├── repositories/  # Database repositories
│   │   ├── routes/        # API routes
│   │   ├── services/      # External service integrations
│   │   └── utils/         # Utility functions
│   ├── .env              # Environment variables
│   ├── .env.example      # Template for environment variables
│   ├── Dockerfile        # Containerization config
│   ├── package.json      # Backend dependencies
│   └── setup-admin.js    # Admin user setup script
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── admin/        # Admin-specific components
│   │   ├── components/   # React components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # React hooks
│   │   ├── player/       # Player-specific components
│   │   ├── styles/       # CSS styles
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main application component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
└── ...
```

## Building and Running

### Prerequisites
- Node.js 18+ (for both frontend and backend)
- npm package manager

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables by copying `.env.example` to `.env`:
```bash
cp .env.example .env
```
4. Configure environment variables as needed (API keys, endpoints, etc.)
5. Set up the admin user by running the setup script (requires ADMIN_PASSWORD in .env or uses default):
```bash
node setup-admin.js
```
6. Run in development mode:
```bash
npm run dev
```
7. Or build and run in production:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run in development mode (with proxy to backend):
```bash
npm run dev
```
4. Or build for production:
```bash
npm run build
```

### Quick Start
1. Install backend dependencies and start the backend:
```bash
cd backend && npm install && node setup-admin.js && npm run dev
```
2. In a new terminal, install frontend dependencies and start the frontend:
```bash
cd frontend && npm install && npm run dev
```
3. Access the player interface at: http://localhost:5173/?device=demo-tv-01
4. Access the admin login at: http://localhost:5173/login

## API Endpoints

### Backend Endpoints
- `GET /api/devices/:deviceId/playlist` - Get content playlist for a specific device
- `GET /api/rates/active` - Get active interest rates
- `GET /api/rates/:productId` - Get specific interest rate by product ID
- `GET /api/economic` - Get economic data (exchange rates, gold, stock index, news)
- `POST /api/auth/login` - Authenticate admin user and get JWT token
- `GET /` - Health check

### API Key Requirement
Most endpoints require an API key either in the header (`X-API-Key`) or as a query parameter (`api_key`), except for authentication routes which use JWTs after login.

## Development Conventions

### Frontend
- **Code Style**: Standard React with functional components and hooks
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Vite for fast development and production builds
- **State Management**: React Context API for shared state (e.g., economic data)
- **Routing**: React Router DOM for navigation with protected routes

### Backend
- **API Design**: RESTful API endpoints
- **Error Handling**: Comprehensive error handling with fallback mechanisms
- **Caching**: Node-cache with configurable TTL for external API data
- **Environment Variables**: Use dotenv for configuration management
- **Authentication**: JWT-based with authenticateJWT middleware

### Data Flow
- **Playlist Data**: Retrieved from Strapi CMS with fallback to mock data
- **Interest Rates**: Retrieved from Strapi CMS with fallback to mock data
- **Economic Data**: Retrieved from multiple sources in order of preference (BI SOAP → BCA API → ExchangeRate.host → Mock)
- **News Feed**: Retrieved from RSS feeds with caching

## Security Considerations
- API endpoints are protected with API keys
- Admin routes require JWT authentication
- Transport Layer Security (TLS) is recommended
- Rate limiting should be implemented in production
- External API keys should be kept secure and rotated regularly
- Passwords are hashed using bcrypt

## Environment Variables
Important environment variables include:
- `PORT`: Backend server port (default: 4000)
- `API_KEY`: Authentication key for device API endpoints
- `JWT_SECRET`: Secret key for JWT token signing
- `ADMIN_PASSWORD`: Password for the default admin user
- `STRAPI_API_URL`: URL for Strapi CMS
- `STRAPI_API_TOKEN`: Authentication token for Strapi API
- API keys for external services (GoldAPI, etc.)
- Refresh intervals for cached data

## Admin Dashboard Access
- Admin login is available at `/login` route
- Default credentials: username `admin`, password set by `ADMIN_PASSWORD` environment variable (or `supersecretpassword` if not set)
- After successful login, admin users can access the dashboard at `/admin/*` routes
- The admin dashboard provides modules for managing content, rates, news, economic data, devices, and announcements

## Deployment
The system can be deployed using:
- **Docker**: Backend includes a Dockerfile for containerization
- **Vercel**: Frontend is configured for Vercel deployment
- **Traditional hosting**: Standard Node.js hosting for the backend