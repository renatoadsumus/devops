#!/bin/bash

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm -v $PWD/$PROJETO:/codigo_da_aplicacao -v /opt/repositories/maven:/home/tfsservice/.m2/repository/ renatoadsumus/maven:j7_latest /bin/bash -c "mvn clean org.jacoco:jacoco-maven-plugin:prepare-agent install -Pcoverage-per-test && mvn sonar:sonar"
