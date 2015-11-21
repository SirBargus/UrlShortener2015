# URLshortener
URLshortener by Web Engineering written in Node.js @Unizar


Tecnologias
1. MongoDB
2. Docker
3. Express
3. Node.js

# Run server
## NPM
```
$> npm start
```
## Docker-compose
You need Linux or OS X

```
$> docker-compose up -d
```

# Run test
## Npm
```
$> npm test
```

##Docker

```
$> docker-compose run server npm test
```

#Install Process


##Canvas

### Installing dependencies

    $ sudo apt-get update 
    $ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

Important: ``libjpeg8-dev`` is required rather than just ``libjpeg-dev``

### Installing node-canvas

    $ sudo npm install canvas

or from source:

    $ npm install canvas
