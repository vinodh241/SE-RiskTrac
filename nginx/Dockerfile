FROM nginx:1.25-alpine

# Remove default nginx static assets and any default server config (avoids "hello from nginx" or welcome page)
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/conf.d/default.conf

# Copy nginx configuration (our config does not include conf.d, so root / goes to hostweb)
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions (nginx runs as root but drops privileges in nginx.conf)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Note: Nginx must run as root to bind to port 80, but drops privileges after binding
# This is handled by the nginx.conf user directive

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
