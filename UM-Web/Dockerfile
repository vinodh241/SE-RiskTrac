# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

# 👇 This will now work because stage 1 is named "build"
COPY --from=build /app/dist/<your-app-name> /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
