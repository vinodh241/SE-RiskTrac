# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /web

# Copy only Angular project folder
COPY user-management/package*.json ./
RUN npm install

# Copy the rest of Angular workspace
COPY user-management/ .

RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

# Adjust dist path (replace with actual Angular app name)
COPY --from=build /app/dist/user-management /usr/share/nginx/html

COPY user-management/nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
