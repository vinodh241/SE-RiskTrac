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

# 1️⃣ Set working directory
WORKDIR /opt/server

# 2️⃣ Copy package files first (so npm install runs correctly)
COPY package*.json ./

# 3️⃣ Install dependencies
RUN npm install

# 4️⃣ Copy the rest of the application
COPY . .

# 5️⃣ Start app
CMD ["node", "app-server.js"]



