#!/bin/sh -x

rm -fr /var/lib/jenkins/identity.key.enc
#REMOVENDO ESTE ARQUIVO PARA CONTORNAR PROBLEMA DE AUTENTICAÇÃO LDAP
#ESTE ARQUIVO É RECRIADO AUTOMATICAMENTE PELO JENKINS NO START

chown -R jenkins:jenkins /var/lib/jenkins/

chmod 666 /var/run/docker.sock

/etc/init.d/jenkins start

tail -f /dev/null
