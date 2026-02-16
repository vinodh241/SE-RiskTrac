FROM node:16.10.0-alpine

# Set working directory
WORKDIR /opt/api

# Copy package files first for better layer caching
COPY static/package*.json ./

# Install dependencies as root
RUN npm install --production && \
    npm cache clean --force

# Copy application files
COPY static/ ./

# Create non-root user and set ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /opt/api

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 6001

# Health check (check if process is running)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:6001', (r) => {process.exit(r.statusCode ? 0 : 1)})" || exit 1

# Start application
CMD ["node", "app-server.js"]