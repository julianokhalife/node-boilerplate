#!/usr/bin/env bash

DOCKER_NAME=node-boilerplate

docker build -t ${DOCKER_NAME} .
docker run --name ${DOCKER_NAME} -p 5000:5000 -d ${DOCKER_NAME}
