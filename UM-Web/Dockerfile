FROM nginx
RUN rm -rf /usr/share/nginx/html/index.html
RUN rm -rf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/default.conf
ADD nginx.conf /etc/nginx/nginx.conf
ADD static/ /usr/share/nginx/html/


FROM node:16.10.0
WORKDIR /opt/web
COPY static/ package*.json ./
RUN npm install
COPY *.js .
COPY . .
CMD ["ng" , "serve","--port", "4300"]
