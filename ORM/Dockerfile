FROM node:16.10.0
WORKDIR /opt/api
COPY static/package*.json ./
RUN npm install
COPY static/ ./
COPY . .
COPY *.js .
CMD ["node", "app-server.js"]