#!/usr/bin/env bash

DOCKER_NAME=node-boilerplate
docker container stop $(docker container ls -q -f name=${DOCKER_NAME}) || true
docker container rm $(docker container ls -a -q -f name=${DOCKER_NAME}) || true
