# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Clean node_modules to remove unnecessary files
RUN find node_modules -type f -name "*.md" -delete && \
    find node_modules -type f -name "*.d.ts" -delete && \
    find node_modules -type f -name "*.map" -delete && \
    find node_modules -type d -name "test" -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -type d -name "docs" -exec rm -rf {} + 2>/dev/null || true

# Copy application code
COPY server.js ./
COPY public/ ./public/

# Runtime stage
FROM alpine:3.18

# Install only the Node.js runtime (smallest package available)
RUN apk add --no-cache nodejs

# Create app directory
WORKDIR /app

# Copy from builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/server.js /app/
COPY --from=builder /app/public /app/public

# Expose the port
EXPOSE 3589

# Start the application
CMD ["node", "server.js"]