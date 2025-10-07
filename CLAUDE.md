# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Production start**: `npm start`
- **Linting**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application for a nori (seaweed) nutrition evaluation system (NDS - 紫菜营养评价系统). The application is built with TypeScript and uses the App Router pattern.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with credentials provider
- **UI**: Radix UI components with Tailwind CSS
- **Deployment**: Docker with custom registry images

### Database Schema
The application manages nori nutrition evaluation data with these key entities:
- **nori**: Main entity representing seaweed samples with vendor, exhibition, and production information
- **indicator**: Detection indicators for various nutritional metrics with thresholds and units
- **detectResult**: Results of nutritional analysis linked to nori samples and indicators
- **category**: Grouping of indicators into logical categories
- **user**: System users with authentication
- **combo**: Predefined combinations of indicators for standardized testing

### Application Structure

#### Frontend (`src/app/`)
- **`/login`**: Authentication pages
- **`/main`**: Main application dashboard and functionality
- **`/compute`**: Calculation and analysis features
- **`/api`**: API routes for data operations

#### Services (`src/services/`)
- **`noriService.ts`**: Core business logic for nori sample management
- **`centerService.ts`**: Central data processing and analysis
- **`indicatorService.ts`**: Indicator management and calculations
- **`userService.ts`**: User authentication and management
- **`statisticsService.ts`**: Statistical analysis functions
- **`categories.ts`**: Category management

#### Components (`src/components/`)
- **`data-table.tsx`**: Primary data grid component for nori sample listing
- **`app-sidebar.tsx`**: Main navigation sidebar
- **`login-form.tsx`**: Authentication form
- **`site-header.tsx`**: Application header
- **`ui/`**: Reusable UI components based on Shadcn, 

### Authentication
Uses NextAuth.js with credentials provider and bcrypt for password hashing. User sessions are managed with JWT tokens.

### Database Configuration
Prisma schema uses PostgreSQL with UUID extension. Generated client outputs to `node_modules/generated/prisma`.

### Docker Deployment
Application uses Docker Compose with:
- PostgreSQL database service
- Application service with custom registry images
- Environment variables for database, authentication, and Elasticsearch configuration

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth.js secret key
- `AUTH_URL`: Authentication base URL
- `ELASTICSEARCH_*`: Elasticsearch configuration for logging

使用中文回答我的问题