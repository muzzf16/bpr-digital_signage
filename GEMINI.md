# BPR Digital Signage

This document provides a comprehensive overview of the BPR Digital Signage project, intended to be used as a context for AI-driven development.

## Project Overview

The project is a full-stack web application designed for a "Bank Perkreditan Rakyat" (BPR) to serve as a digital signage system. It displays real-time information on screens within bank branches.

The application consists of two main parts:
-   A **React frontend** responsible for rendering the user interface, which includes promotional content, interest rates, and various economic indicators.
-   A **Node.js/Express backend** that serves as an API, aggregating data from multiple external sources.

### Key Features

-   **Frontend:**
    -   Built with React and Vite.
    -   Styled with Tailwind CSS.
    -   Progressive Web App (PWA) for offline capabilities.
    -   Displays data fetched from the backend.

-   **Backend:**
    -   Built with Node.js and Express.
    -   Integrates with various financial data providers:
        -   Bank Indonesia (BI) for currency rates (via SOAP).
        -   BCA for currency rates (via REST API).
        -   GoldAPI.io for gold prices.
        -   Yahoo Finance for the Jakarta Stock Exchange Composite Index (IHSG).
        -   RSS feeds from various news outlets (CNBC, Kontan, Antara) for economic news.
    -   Uses `node-cron` to schedule regular updates of the economic data.

## Building and Running

### Backend

To run the backend server:

1.  Navigate to the `backend` directory.
2.  Install dependencies: `npm install`
3.  Start the server: `npm start`

### Frontend

To run the frontend application:

1.  Navigate to the `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

To build the frontend for production:

1.  Navigate to the `frontend` directory.
2.  Run the build command: `npm run build`

## Development Conventions

-   **Code Style:** The project uses ESLint for linting and likely Prettier for code formatting (inferred from `develoment doc.md`).
-   **Version Control:** The preferred branching model is GitFlow.
-   **Commits:** The project uses the Conventional Commits specification.
