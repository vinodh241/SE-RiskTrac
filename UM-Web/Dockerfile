# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /app

# Copy package.json & package-lock.json
COPY static/package*.json ./

RUN npm install

# Copy all project files (angular.json, tsconfig.json, src/, etc.)
COPY . .

RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/user-management /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
