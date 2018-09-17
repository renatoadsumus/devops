#!/bin/bash
#MVN_OPTS='-Dtest=MateriaComFotosSuite -PSTGLinux'

#docker run --name $JOB_NAME --rm -v $WORKSPACE/teste_funcional:/codigo_teste_com_selenium_webdriver -v /opt/maven/repository:/home/jenkins/.m2/repository -e "MVN_OPTS=$MVN_OPTS" renatoadsumus/chrome:61-32

#docker login -u admin -p 2lsDb19i infodevops1:8380

docker run --name $1 --rm -v $WORKSPACE/teste_funcional:/codigo_teste_com_selenium_webdriver -v /opt/maven/repository:/home/jenkins/.m2/repository -e "MVN_OPTS=$MVN_OPTS" renatoadsumus/chrome:66-37_latest
