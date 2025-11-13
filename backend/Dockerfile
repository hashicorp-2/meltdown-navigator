# Multi-stage build for Meltdown Navigator Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json backend/
COPY packages/agents/package*.json packages/agents/
COPY common/types/package.json common/types/

# Install dependencies
RUN npm ci --workspaces --include-workspace-root

# Copy source code
COPY backend ./backend
COPY packages ./packages
COPY common ./common

# Build
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/common ./common

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/index.js"]


