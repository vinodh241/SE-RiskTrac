FROM node:16.10.0
WORKDIR /opt/server
COPY *.json .
COPY *.js .
RUN npm install -i
ADD static/ /opt/server/
CMD ["node", "app-server.js"]
