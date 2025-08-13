FROM node:16.10.0

WORKDIR /opt/api
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app-server.js"]