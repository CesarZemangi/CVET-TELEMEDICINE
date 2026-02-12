---
description: Repository Information Overview
alwaysApply: true
---

# CVet Telemedicine Repository Information

## Repository Summary
CVet is a telemedicine platform designed for veterinary services, facilitating interactions between farmers and veterinarians. The repository is organized as a multi-project setup with a React-based frontend and a Node.js/Express backend.

## Repository Structure
- **Client/**: Frontend application built with React and Vite.
- **Server/**: Backend API built with Node.js, Express, and Sequelize ORM.
- **locales/**: Internationalization files for the application.
- **frondend/**: Deprecated or unused directory.

### Main Repository Components
- **Client (Frontend)**: Handles the user interface for farmers and veterinarians, including dashboards, consultations, and analytics.
- **Server (Backend)**: Manages authentication, database operations (MySQL), and business logic for cases, appointments, and notifications.

## Projects

### Client (Frontend)
**Configuration File**: [./Client/package.json](./Client/package.json)

#### Language & Runtime
**Language**: JavaScript (React)  
**Version**: Node.js (Runtime), React 19  
**Build System**: Vite 7  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `react`: ^19.2.0
- `react-router-dom`: ^7.12.0
- `axios`: ^1.13.3
- `chart.js`: ^4.5.1
- `framer-motion`: ^12.29.0
- `leaflet`: ^1.9.4
- `lucide-react`: ^0.562.0
- `tailwindcss`: ^4.1.18

**Development Dependencies**:
- `vite`: ^7.2.4
- `eslint`: ^9.39.1
- `postcss`: ^8.5.6
- `autoprefixer`: ^10.4.23

#### Build & Installation
```bash
# Navigate to Client directory
cd Client

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

#### Main Files & Resources
- **Entry Point**: [./Client/src/main.jsx](./Client/src/main.jsx)
- **Main App Component**: [./Client/src/App.jsx](./Client/src/App.jsx)
- **Vite Config**: [./Client/vite.config.js](./Client/vite.config.js)

### Server (Backend)
**Configuration File**: [./Server/package.json](./Server/package.json)

#### Language & Runtime
**Language**: Node.js (JavaScript)  
**Version**: Node.js (Runtime)  
**Build System**: Node.js  
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- `express`: ^5.2.1
- `sequelize`: ^6.37.7
- `mysql2`: ^3.16.2
- `jsonwebtoken`: ^9.0.3
- `bcryptjs`: ^3.0.3
- `dotenv`: ^17.2.3
- `cors`: ^2.8.6

#### Build & Installation
```bash
# Navigate to Server directory
cd Server

# Install dependencies
npm install

# Run development server
npm run dev

# Start production server
npm start
```

#### Main Files & Resources
- **Entry Point**: [./Server/server.js](./Server/server.js)
- **App Configuration**: [./Server/src/app.js](./Server/src/app.js)
- **Database Config**: [./Server/src/config/db.js](./Server/src/config/db.js)
- **Models**: [./Server/src/models/](./Server/src/models/)
- **Routes**: [./Server/src/routes/](./Server/src/routes/)

#### Validation
**Quality Checks**: ESLint is configured in the Client project.
**Database Synchronization**: Sequelize is configured to sync models with `alter: true` in development.
