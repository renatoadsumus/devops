#!/bin/bash
#MVN_OPTS='-Dtest=MateriaComFotosSuite -PSTGLinux'
docker run --rm --name $1 -v $PWD/teste_funcional:/codigo_teste_com_selenium_webdriver -v /opt/repositories/maven:/home/tfsservice/.m2/repository -e "MVN_OPTS=$MVN_OPTS" renatoadsumus/chrome_gocd:60-29

