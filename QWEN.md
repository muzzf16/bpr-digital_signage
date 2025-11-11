# QWEN.md - BPR Digital Signage System

## Project Overview

The BPR Digital Signage System is a modern, centralized, and secure digital information display application developed for Bank Perkreditan Rakyat (BPR). The system enables real-time display of promotional products, savings/deposit interest rates, and economic information on branch TV screens.

## Conversation Context

Date: Selasa, 11 November 2025
OS: Windows (win32)
Project Directory: D:\bpr_signage
Active File: D:\bpr_signage\frontend\src\components\EconPanel.jsx

### Core Features
- **Promotional Content**: Display promotional media and bank branding
- **Interest Rate Information**: Real-time savings and deposit rates connected to CMS
- **Economic Data**: Official exchange rates from Bank Indonesia (SOAP), BCA Exchange rates, gold prices from GoldAPI, and IHSG from Yahoo Finance
- **News Feed**: Economic news from various sources (CNBC, Kontan, Antara)
- **Remote Management**: Centralized content updates from headquarters
- **Offline Mode**: PWA with local data storage for branch TV systems
- **High Security**: JWT and TLS-protected access

### Architecture
- **Frontend**: React PWA with Vite and Tailwind CSS
- **Backend**: Node.js with Express
- **External APIs**: Bank Indonesia SOAP, BCA Exchange Rates, GoldAPI, Yahoo Finance, RSS feeds
- **Authentication**: JWT and API Key per device
- **Deployment**: Docker, Nginx, Vercel

## Project Structure
```
bpr-digital_signage/
├── backend/
│   ├── src/
│   │   ├── data/          # Mock data
│   │   ├── routes/        # API routes
│   │   └── services/      # External service integrations
│   ├── .env              # Environment variables
│   ├── .env.example      # Template for environment variables
│   ├── Dockerfile        # Containerization config
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context providers
│   │   ├── App.jsx       # Main application component
│   │   ├── main.jsx      # Entry point
│   │   └── styles.css    # Global styles
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
5. Run in development mode:
```bash
npm run dev
```
6. Or build and run in production:
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
cd backend && npm install && npm run dev
```
2. In a new terminal, install frontend dependencies and start the frontend:
```bash
cd frontend && npm install && npm run dev
```
3. Open your browser to: http://localhost:5173/?device=demo-tv-01

## API Endpoints

### Backend Endpoints
- `GET /api/devices/:deviceId/playlist` - Get content playlist for a specific device
- `GET /api/rates/active` - Get active interest rates
- `GET /api/rates/:productId` - Get specific interest rate by product ID
- `GET /api/economic` - Get economic data (exchange rates, gold, stock index, news)
- `GET /` - Health check

### API Key Requirement
Most endpoints require an API key either in the header (`X-API-Key`) or as a query parameter (`api_key`).

## Development Conventions

### Frontend
- **Code Style**: Standard React with functional components and hooks
- **Styling**: Tailwind CSS for utility-first styling
- **Build Tool**: Vite for fast development and production builds
- **State Management**: React Context API for shared state (e.g., economic data)

### Backend
- **API Design**: RESTful API endpoints
- **Error Handling**: Comprehensive error handling with fallback mechanisms
- **Caching**: Node-cache with configurable TTL for external API data
- **Environment Variables**: Use dotenv for configuration management

### Data Flow
- **Playlist Data**: Retrieved from Strapi CMS with fallback to mock data
- **Interest Rates**: Retrieved from Strapi CMS with fallback to mock data
- **Economic Data**: Retrieved from multiple sources in order of preference (BI SOAP → BCA API → ExchangeRate.host → Mock)
- **News Feed**: Retrieved from RSS feeds with caching

## Security Considerations
- API endpoints are protected with API keys
- Transport Layer Security (TLS) is recommended
- Rate limiting should be implemented in production
- External API keys should be kept secure and rotated regularly

## Environment Variables
Important environment variables include:
- `PORT`: Backend server port (default: 4000)
- `API_KEY`: Authentication key for API endpoints
- `STRAPI_API_URL`: URL for Strapi CMS
- `STRAPI_API_TOKEN`: Authentication token for Strapi API
- API keys for external services (GoldAPI, etc.)
- Refresh intervals for cached data

## Deployment
The system can be deployed using:
- **Docker**: Backend includes a Dockerfile for containerization
- **Vercel**: Frontend is configured for Vercel deployment
- **Traditional hosting**: Standard Node.js hosting for the backend