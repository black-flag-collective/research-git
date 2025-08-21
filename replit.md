# ArchiveShare - Collaborative Research Notes Platform

## Overview

ArchiveShare is a git-like version control system for researchers to collaboratively share notes and annotations about archival collections. The platform enables researchers to document their findings, create alternative interpretations through branching, and submit pull requests for community review. This reduces barriers to archival access by allowing researchers to build upon existing documentation and discover relevant materials before visiting archives in person.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React + TypeScript**: Single-page application using modern React patterns with strict TypeScript typing
- **Vite Build System**: Fast development server and optimized production builds
- **Routing**: Client-side routing using Wouter for lightweight navigation
- **State Management**: TanStack Query for server state management and caching, with React hooks for local state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Component Structure**: Modular component architecture with clear separation between pages, components, and UI primitives

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Authentication**: Passport.js with OpenID Connect (OIDC) integration for Replit authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: Resource-based endpoints following REST conventions with consistent error handling

### Data Architecture
- **Hierarchical Structure**: Archives → Collections → Boxes → Folders → Notes
- **Version Control System**: Git-like branching system allowing multiple interpretations of the same archival materials
- **Pull Request Workflow**: Community-driven content review system with approval processes
- **User Management**: Profile-based system tracking contributions and expertise areas

### Core Features
- **Markdown Editor**: WYSIWYG editor for creating and editing research notes
- **Branch Management**: Create alternative interpretations and frameworks for viewing archival content
- **Pull Request System**: Propose changes to existing notes with community review
- **Advanced Search**: Filter by archive, collection, branch, keyword, contributor, and date
- **Activity Tracking**: Real-time updates on pull requests, merges, and community activity

### Database Schema
- **Users**: Profile information, authentication data, contribution tracking
- **Archives**: Top-level institutional collections (e.g., National Archives)
- **Collections**: Named groups within archives (e.g., "InBae Yoon Papers")
- **Boxes/Folders**: Physical organization structure mirroring real archives
- **Branches**: Git-like branches for alternative interpretations
- **Notes**: Markdown content linked to specific folders and branches
- **Pull Requests**: Change proposals with status tracking and review system

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database for production deployment
- **Drizzle Kit**: Database migration and schema management tools

### Authentication
- **Replit OIDC**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware with strategy pattern support

### UI and Styling
- **Radix UI**: Accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library

### Development Tools
- **ESBuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Static type checking across frontend and backend
- **Vite Plugins**: Development enhancement including error overlays and hot reload

### Runtime Dependencies
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation
- **Date-fns**: Date manipulation utilities
- **Memoizee**: Function memoization for performance optimization