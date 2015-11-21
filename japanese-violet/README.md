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
$ npm start
```
## Docker-compose
You need Linux or OS X

```
$ docker-compose up -d
```

# Run test
## Npm
```
$ npm test
```

##Docker

```
$ docker-compose run server npm test
```

#Install Process

##Docker

Verify that you have wget installed, and get it if isn't installed 

    $ which wget
    $ sudo apt-get update
    $ sudo apt-get install wget
  
Get the Docker package    
    
    $ wget -qO- https://get.docker.com/ | sh
    
If the command fails, add the key directly 
    
    $ wget -qO- https://get.docker.com/gpg | sudo apt-key add -

If you would like to use Docker as a non-root user, you should now consider
adding your user to the "docker" group with something like:

    $ sudo usermod -aG docker <<user>>

try docker

    $ docker run hello-world

##NodeJS + npm 

    $ curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    
To compile and install native addons from npm you may also need to install build tools:
    
    $ sudo apt-get install -y build-essential    

##Canvas

### Installing dependencies

    $ sudo apt-get update 
    $ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

Important: ``libjpeg8-dev`` is required rather than just ``libjpeg-dev``

### Installing node-canvas

    $ sudo npm install canvas

or from source:

    $ npm install canvas
