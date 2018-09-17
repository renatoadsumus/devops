#!/bin/bash

cp /opt/certificate/*.cer ./ || exit 1;

echo Build da imagem sonarqube;
echo
docker build -t sonarqube:latest . || exit 1;

rm ./*cer || exit 1;

echo docker-compose up;
echo 
docker-compose up -d || exit 1;

exit 0

