# Stage 1: Production Runtime using Lightweight Node 24 Alpine
FROM node:24-alpine

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 5000

# Docker healthcheck querying the stateless health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Run as non-root user for security
USER node

# Start the high-throughput server
CMD ["node", "src/server.js"]
