#!/bin/bash

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm -v $PWD:/workspace_projeto -v /opt/repositories/grails/:/home/tfsservice/.grails -v /opt/repositories/maven/:/home/tfsservice/.m2 -e "PASTA_PROJETO=$PASTA_PROJETO" -w /workspace_projeto/$PASTA_PROJETO renatoadsumus/grails:j7_latest /bin/bash -c "grails -Dgrails.work.dir=target test-app --non-interactive --plain-output --stacktrace"
