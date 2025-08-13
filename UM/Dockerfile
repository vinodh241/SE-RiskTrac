FROM node:16.10.0
WORKDIR /opt/api
COPY *.json .
RUN npm install -i -y
COPY *.js .
ADD static /opt/server/
CMD ["node", "app-server.js"]








