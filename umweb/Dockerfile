# Stage 1: Build Angular UI
FROM node:18-alpine AS build

WORKDIR /web

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package files
COPY static/package*.json ./

# Install dependencies
RUN npm ci

# Copy Angular project files
COPY static/ ./

# Build Angular application
RUN ng build --configuration production --base-href https://serisktrac.secureyes.net/user-management/

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular dist output to nginx
COPY --from=build /web/dist/user-management /usr/share/nginx/html

# Copy nginx configuration for serving static files
# Use nginx-static.conf if you want to serve static files, or keep nginx.conf for proxy
COPY nginx-static.conf /etc/nginx/nginx.conf

# Install wget for health check
RUN apk add --no-cache wget

# Set proper permissions (nginx runs as root but drops privileges in nginx.conf)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Note: Nginx must run as root to bind to port 5000, but drops privileges after binding
# This is handled by the nginx.conf user directive

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
