#!/bin/bash

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --name $1 --rm -v /opt/agents/pipelines/$2:/pasta_projeto renatoadsumus/soapui:4.5.2_latest /pasta_projeto/$XML_PROJETO -s "$TEST_SUIT" -j -f /pasta_projeto -r -e $ENDPOINT_TESTES
