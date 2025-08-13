# FROM node:16.10.0
# WORKDIR /opt/server
# COPY *.json .
# COPY *.js .
# RUN npm install 
# ADD static /opt/server/
# CMD ["node", "app-server.js"]


# FROM node:18
# WORKDIR /opt/server
# # Copy package files first (for better caching)
# COPY package*.json ./
# RUN npm install 
# COPY  *.js ./

# CMD ["node", "app-server.js"]

FROM node:18

WORKDIR /opt/server

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "app-server.js"]





