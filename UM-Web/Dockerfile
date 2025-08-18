FROM node:18.10.0
WORKDIR /opt/web
COPY static/ package*.json ./
RUN npm install
COPY *.js .
COPY . .

# Build Angular app
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular dist to nginx html folder
COPY --from=build /app/dist/<your-app-name> /usr/share/nginx/html

# Copy your custom nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000

CMD ["nginx", "-g", "daemon off;"]
