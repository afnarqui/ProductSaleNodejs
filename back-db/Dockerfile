FROM node:latest

WORKDIR /app

COPY package.json /

RUN npm install

RUN npm install

COPY . /app

EXPOSE 8080
EXPOSE 3000 9229 8004
CMD [ "npm", "start" ]



