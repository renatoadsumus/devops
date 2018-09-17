#!/bin/bash
#                                tsuru app-deploy -a <app-name> <directory>
#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --rm --name $1 -v $PWD/${PROJETO}:/projeto -e "TSURU_TOKEN=$TSURU_TOKEN" renatoadsumus/tsuru_client:latest /bin/bash -c "tsuru target-add default tsuru.globoi.com -s && tsuru app-deploy ${PROJETO} /projeto"