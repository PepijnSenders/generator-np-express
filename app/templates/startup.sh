#!/bin/bash

NODEMON=$(npm -g list | grep 'nodemon')

if [ -z NODEMON ]; then
    npm install -g nodemon
fi

NODE_ENV=$1 nodemon app/index.js