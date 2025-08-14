# FROM node:16.10.0
# # WORKDIR /opt/api
# # COPY --chown=node:node *.json . 
# # RUN npm install 
# WORKDIR /opt/api
# COPY UM/package*.json ./
# RUN npm install
# COPY *.js .
# ADD static /opt/server/
# CMD ["node", "app-server.js"]

FROM node:16.10.0
WORKDIR /opt/api
COPY static/ package*.json ./
RUN npm install
COPY . .
COPY *.js .
CMD ["node", "app-server.js"]










