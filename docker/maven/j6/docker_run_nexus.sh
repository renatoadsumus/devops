#!/bin/bash

# ENVIA BIBLIOTECA GERADA PARA O NEXUS

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm -v $PWD/$PROJETO:/codigo_da_aplicacao -v /opt/repositories/maven:/home/tfsservice/.m2/repository/ renatoadsumus/maven:j6_latest mvn deploy

