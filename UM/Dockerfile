FROM node:16.10.0
# WORKDIR /opt/api
# COPY --chown=node:node *.json . 
# RUN npm install 
WORKDIR /opt/api
RUN ls -la 
COPY package.json package-lock.json ./
RUN ls -la  # Debugging line to verify files
RUN npm install
COPY *.js .
ADD static /opt/server/
CMD ["node", "app-server.js"]









