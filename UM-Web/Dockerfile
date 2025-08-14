FROM node:16.10.0
WORKDIR /opt/web
COPY static/ package*.json ./
RUN npm install
COPY *.js .
COPY . .
CMD ["ng", "build"]
