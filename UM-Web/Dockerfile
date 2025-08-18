# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY static/package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

# Replace <your-app-name> with actual dist folder name
COPY --from=build /app/dist/<your-app-name> /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
