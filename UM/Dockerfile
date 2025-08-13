# FROM node:16.10.0
# WORKDIR /opt/server
# COPY *.json .
# COPY *.js .
# RUN npm install 
# ADD static /opt/server/
# CMD ["node", "app-server.js"]


FROM node:18

WORKDIR /opt/server

# Copy package files first (for better caching)
COPY server/package*.json ./

RUN npm install

# Copy the rest of the server code
COPY server/ ./

CMD ["node", "app-server.js"]

