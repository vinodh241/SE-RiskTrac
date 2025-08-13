# FROM node:16.10.0
# WORKDIR /opt/api
# COPY *.json .
# RUN npm install 
# COPY *.js .
# ADD static /opt/server/
# CMD ["node", "app-server.js"]


FROM node:16.10.0 # or the version you need
WORKDIR /opt/api
COPY package.json package-lock.json ./
RUN npm ci
COPY *.js .
ADD static /opt/server/








