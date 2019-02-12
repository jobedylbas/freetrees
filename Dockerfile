FROM node:latest

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install
RUN npm update --save

COPY . /usr/src/app

EXPOSE 3000