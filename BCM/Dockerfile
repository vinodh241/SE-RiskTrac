FROM node:18.10.0
WORKDIR /opt/api
COPY static/ package*.json ./
RUN npm install
COPY *.js .
COPY . .
CMD ["node", "app-server.js"]