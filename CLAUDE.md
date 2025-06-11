# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack calendar application built with React (frontend) and Hono (backend), deployed on Cloudflare Workers for edge computing.

## Development Commands

### Local Development
```bash
# Start development server with hot reload
bun run dev
```

### Build and Deploy
```bash
# Type checking and linting
bun run lint

# Full validation (TypeScript + build + deployment dry-run)
bun run check

# Build for production
bun run build

# Preview production build locally
bun run preview

# Deploy to Cloudflare Workers
bun run deploy
```

### Testing
No test framework is currently configured. When adding tests, consider installing vitest which integrates well with Vite.

## Architecture

### Project Structure
- `/src/react-app/` - React frontend application
  - `App.tsx` - Main application component
  - `main.tsx` - React entry point
- `/src/worker/` - Hono backend API
  - `index.ts` - API server entry point with Hono routes

### Key Technologies
- **Frontend**: React 19 with TypeScript, Vite build tool
- **Backend**: Hono web framework on Cloudflare Workers
- **Deployment**: Cloudflare Workers for global edge deployment

### API Integration
- Frontend fetches from backend via `/api/` endpoints
- Backend API is defined in `src/worker/index.ts` using Hono
- Both frontend and backend are served from the same Worker

### Configuration Files
- `vite.config.ts` - Vite build configuration with Cloudflare plugin
- `wrangler.json` - Cloudflare Workers deployment configuration
- `tsconfig.*.json` - Separate TypeScript configs for app, worker, and node environments

## Development Guidelines

### Adding New Features
1. API endpoints go in `src/worker/index.ts` using Hono's routing syntax
2. React components and pages go in `src/react-app/`
3. Use TypeScript for all new code
4. Run `bun run check` before committing to ensure type safety

### Cloudflare Workers Considerations
- The application runs on the edge, not in Node.js
- Use Web APIs instead of Node.js APIs
- Keep bundle size minimal for optimal edge performance
- Leverage Cloudflare's global network for low latency

### Frontend Notes
- We're using daisyui via CDN