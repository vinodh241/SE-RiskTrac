# FROM node:16.10.0
# WORKDIR /opt/server
# COPY package.json package-lock.json ./
# RUN npm install 
# COPY *.js .

# ADD static /opt/server/
# CMD ["node", "app-server.js"]



FROM node:16.10.0

WORKDIR /opt/server

# Copy package files from "server" folder
COPY package.json package-lock.json ./
COPY . .


RUN npm install

# Copy rest of the app from "server" folder
COPY server/ . 

EXPOSE 3000
CMD ["npm", "start"]





