# Stage 1: Build Angular UI
FROM node:18.18.0 AS build
WORKDIR /web
# Copy only Angular project folder
RUN npm install -g @angular/cli
COPY static/ package*.json ./
RUN npm install
COPY *.js .
# Copy Angular project files
COPY . .
RUN ng build --base-href https://serisktrac.secureyes.net/orm/




# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
RUN apk add --no-cache bash
RUN rm -rf /usr/share/nginx/html/*
# Copy Angular dist output to nginx
COPY --from=build /web/dist/orm /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
