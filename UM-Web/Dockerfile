# Stage 1: Build Angular UI
FROM node:18 AS build

WORKDIR /web

# Copy only Angular project folder
COPY static/ package*.json ./
RUN npm install
COPY *.js .
# Copy Angular project files
COPY . .

RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
RUN apk add --no-cache bash
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular dist output to nginx
COPY --from=build /web/dist/user-management /usr/share/nginx/html

# Copy nginx.conf (assuming it's next to Dockerfile, not inside user-management/)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000
RUN ng s --port 4300
CMD ["nginx", "-g", "daemon off;"]
