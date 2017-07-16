FROM node:8-alpine

WORKDIR /app
ADD package.json /app/package.json
RUN npm install
ADD . /app

EXPOSE 3000
CMD /app/node_modules/.bin/fastify index.js
