# ShopHub E-commerce Application

## Overview

ShopHub is a full-stack e-commerce web application built with a modern tech stack. It features a React frontend with TypeScript, an Express.js backend, and uses PostgreSQL with Drizzle ORM for data persistence. The application includes user authentication via Replit Auth, product catalog management, shopping cart functionality, and order processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OpenID Connect (OIDC) authentication
- **UI**: Shadcn/ui component library with Tailwind CSS
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application built with React 18
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **Components**: Shadcn/ui components for consistent UI
- **State Management**: TanStack Query for API state, React hooks for local state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Authentication Middleware**: Replit Auth integration with session management
- **Database Layer**: Drizzle ORM with connection pooling via Neon serverless
- **API Routes**: Organized route handlers for different resource types

### Database Schema
- **Users**: Stores user profile information from Replit Auth
- **Categories**: Product categorization system
- **Products**: Product catalog with pricing and images
- **Cart Items**: User shopping cart persistence
- **Orders & Order Items**: Order management and tracking
- **Sessions**: Session storage for authentication

## Data Flow

1. **Authentication**: Users authenticate via Replit OIDC, creating sessions stored in PostgreSQL
2. **Product Browsing**: Products are fetched from the database and displayed with category filtering
3. **Cart Management**: Cart items are persisted per user in the database
4. **Order Processing**: Orders are created with associated order items for purchase tracking
5. **State Synchronization**: TanStack Query manages API state with automatic caching and invalidation

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing

### Authentication & Session Management
- **openid-client**: OIDC authentication with Replit
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store
- **passport**: Authentication middleware

### UI & Styling
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: Uses Vite dev server with HMR and the Express server running concurrently
- **Production**: Static frontend assets are built and served by the Express server
- **Database**: Uses Neon serverless PostgreSQL with connection pooling
- **Environment Variables**: Requires `DATABASE_URL`, `SESSION_SECRET`, and Replit-specific variables
- **Build Process**: Vite builds the frontend, esbuild bundles the backend for Node.js

The application uses ESM modules throughout and is configured for modern JavaScript environments. The build process creates a production-ready bundle that can be deployed as a single Node.js application serving both the API and static assets.