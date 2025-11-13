# Multi-stage build for Meltdown Navigator Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json frontend/
COPY packages/agents/package*.json packages/agents/
COPY common/types/package.json common/types/

# Install dependencies
RUN npm ci --workspaces --include-workspace-root

# Copy source code
COPY frontend ./frontend
COPY packages ./packages
COPY common ./common

# Build
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --workspaces --include-workspace-root

# Copy built files
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/next.config.mjs ./next.config.mjs
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/common ./common

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["npm", "run", "start", "--workspace", "@meltdown/frontend"]


