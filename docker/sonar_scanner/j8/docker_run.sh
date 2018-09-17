#!/bin/bash

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm -v $PWD:/codigo_da_aplicacao renatoadsumus/sonar-scanner:j8_latest
