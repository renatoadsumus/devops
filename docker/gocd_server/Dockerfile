# EXEMPLO DE RUN
#
# docker run -d -v /opt/gocd_server/db/:/var/lib/go-server/db/ -v /opt/gocd_server/artifacts/:/var/lib/go-server/artifacts/ -v /opt/gocd_server/cruise-config.xml:/etc/go/cruise-config.xml -p 8153:8153 -p 8154:8154 renatoadsumus/gocd_server:latest

FROM centos:7

MAINTAINER gustavo.goncalves@infoglobo.com.br

ENV TZ=America/Sao_Paulo

#CONFIGURANDO TIMEZONE, INSTALANDO O CURL, BAIXANDO O REPOSITÓRIO DO GOCD, INSTALANDO O JDK 1.8, INSTALANDO O GO-SERVER, GIT e SVN

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
	&& yum install -y curl \
	&& curl https://download.gocd.org/gocd.repo -o /etc/yum.repos.d/gocd.repo \
	&& yum install -y java-1.8.0-openjdk \
	go-server \
	&& yum install -y git \
    && yum install -y subversion \	
	&& git config --global user.name "devops-infoglobo" \
	&& git config --global user.email "devops@infoglobo.com.br" \
	&& echo -e 'search ogmaster.local\nnameserver 172.17.34.136\nnameserver 172.17.32.98' > /etc/resolv.conf

#COPIANDO A CHAVE PRIVADA PARA O CONTAINER E ALTERANDO O DONO DO ARQUIVO
COPY cipher /etc/go/cipher
COPY cipher.aes /etc/go/cipher.aes
RUN chown go:go /etc/go/cipher
RUN chown go:go /etc/go/cipher.aes

#COPIANDO O SH PARA DENTRO DO CONTAINER
COPY start_gocd.sh /var/lib/go-server/
RUN chown go:go /var/lib/go-server/start_gocd.sh

#COPIANDO O ARQUIVO ADMINS.PROPERTIES
COPY admins.properties /opt/
RUN chown go:go /opt/admins.properties

RUN chmod +x /var/lib/go-server/start_gocd.sh

#INICIANDO O GO-SERVER
CMD ./var/lib/go-server/start_gocd.sh
