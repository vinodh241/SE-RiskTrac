# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /app

# Copy dependency definitions first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files (angular.json, tsconfig.json, src/, etc.)
COPY . .

# Build Angular app for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

# Replace with your Angular dist folder name (check after ng build locally)
COPY --from=build /app/dist/user-management /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
