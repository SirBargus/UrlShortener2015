FROM node

RUN apt-get -y update
RUN apt-get -y install libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ gcc make

ADD . /code
WORKDIR /code
RUN npm install

EXPOSE 8080
CMD node app.js
