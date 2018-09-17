#!/bin/bash

# ENVIA BIBLIOTECA GERADA PARA O NEXUS

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm -v $PWD:/workspace_projeto -v /opt/repositories/grails/:/home/tfsservice/.grails -v /opt/repositories/maven/:/home/tfsservice/.m2 -e "PASTA_PROJETO=$PASTA_PROJETO" renatoadsumus/grails:j7_latest /bin/bash -c "cd $PASTA_PROJETO && grails clean && grails compile && grails maven-deploy --repository=infoglobo"
