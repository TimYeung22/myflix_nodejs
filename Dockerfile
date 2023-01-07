FROM node:latest

RUN echo "Tryin to build my nodejs"

COPY . /var/www

WORKDIR /var/www

RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm","start"]
