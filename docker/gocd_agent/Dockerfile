# docker run -d --name renatoadsumus_goagent renatoadsumus/goagent:latest


FROM renatoadsumus/python:35_latest

MAINTAINER gustavo.goncalves@infoglobo.com.br

ENV PY_AMBIENTE_EXECUCAO="PRD"

### CRIANDO USUARIO E GRUPO GO - TODOS DOCKERFILES E PUPPET QUE USAM GO PRECISAM MANTER O GUID E UID
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

#INSTALANDO O CURL, BAIXANDO O REPOSITÓRIO DO GOCD, INSTALANDO O JDK 1.8, INSTALANDO O GO-AGENT, GIT, SVN E DOCKER	
RUN yum install -y curl \
	&& curl https://download.gocd.org/gocd.repo -o /etc/yum.repos.d/gocd.repo \
	&& yum install -y java-1.8.0-openjdk \
	go-agent \
	&& yum install -y git \
    && yum install -y subversion \
	&& yum install -y docker \
	&& curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.2.4-x86_64.rpm \
	&& rpm -vi filebeat-6.2.4-x86_64.rpm \
	&& yum install -y initscripts \
	&& yum install -y sudo \
	gcc \
	make \
	openssl-devel \
	&& ln -s /usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el7_5.x86_64 /usr/lib/jvm/java8
	
#COPIANDO OS JARS UTILIZADOS NA VALIDACAO DE TESTES
COPY jars_analisadores/analisador-log-1.2.0.jar /opt
COPY jars_analisadores/validador-teste-performance-1.1.jar /opt

#INSTALANDO PACOTES NECESSARIOS
RUN yum -y update \
	&&  yum install -y epel-release \
	&& yum groupinstall -y 'development tools' \
	&& yum install -y zlib-dev openssl-devel sqlite-devel bzip2-devel xz-libs wget 
	
#COPIANDO O SH PARA O CONTAINER E ALTERANDO O DONO DO ARQUIVO
COPY start_goagent.sh /var/lib/go-agent/
RUN chown go:go /var/lib/go-agent/start_goagent.sh

#COPIANDO O SH PARA ADICIONAR SERVIDORES AOS KNOWN HOSTS E ALTERANDO O DONO DO ARQUIVO
COPY montar_known_hosts.sh /opt
RUN chown go:go /opt/montar_known_hosts.sh

#COPIANDO O YML PARA O CONTAINER E ALTERANDO O DONO DO ARQUIVO	
COPY filebeat.yml /etc/filebeat/

#INSTALANDO O GRADLE 2.14
#RUN wget https://services.gradle.org/distributions/gradle-2.14-all.zip \
#	&& unzip -oq gradle-2.14-all.zip -d /opt/gradle \
#	&& ln -sfn gradle-2.14 /opt/gradle/latest \
#	&& ln -s /opt/gradle/latest/bin/gradle /usr/bin/gradle

RUN chmod +x /var/lib/go-agent/start_goagent.sh	\
	&& sed -i s/127.0.0.1:8154/infodevops3:8154/g /etc/default/go-agent	\
	&& chmod +x /opt/montar_known_hosts.sh \
	&& mkdir /home/tfsservice/.ssh \
	&& chown go.go /home/tfsservice/.ssh \
	&& chmod 700 /home/tfsservice/.ssh \
	&& mkdir /opt/chaves_git \
	&& chown go.go /opt/chaves_git \
	&& chmod 700 /opt/chaves_git 
	
#ESSAS CHAVES ESTAO VERSIONADAS NO SVN
COPY id_rsa /home/tfsservice/.ssh
COPY id_rsa.pub /home/tfsservice/.ssh
COPY git /opt/chaves_git
COPY git.pub /opt/chaves_git
COPY ssh_config /home/go/.ssh/config

RUN chown -R go.go /home/tfsservice/.ssh/ \
	&& chmod 600 /home/tfsservice/.ssh/id_rsa \
	&& chmod 644 /home/tfsservice/.ssh/id_rsa.pub \
	&& chown -R go.go /opt/chaves_git \
	&& chmod 600 /opt/chaves_git/git \
	&& chmod 644 /opt/chaves_git/git.pub \
	&& chown go.go /home/go/.ssh/config \
	&& chmod 644 /home/go/.ssh/config \
	&& chown -R go.go /home/tfsservice/continuous_delivery_env \
	&& /etc/init.d/filebeat start \
	&& echo 'go      ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
	&& echo -e 'search ogmaster.local\nnameserver 172.17.34.136\nnameserver 172.17.32.98' > /etc/resolv.conf

USER go
	
#INICIANDO O GO-AGENT	
CMD ["/var/lib/go-agent/start_goagent.sh"]
