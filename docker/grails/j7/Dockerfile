# EXEMPLO DE RUN
#
# export PASTA_PROJETO = "pasta_do_projeto"
# docker run --rm -v $PWD:/workspace_projeto -e "PASTA_PROJETO=$PASTA_PROJETO" infodevops1:8380/grails:j7_latest <comando>
#

FROM centos:7

ENV GRAILS_HOME /opt/grails-2.3.11
ENV PATH $PATH:$GRAILS_HOME/bin
ENV JAVA_HOME /usr/lib/jvm/java-1.7.0
ENV PATH $PATH:$JAVA_HOME/bin
ENV TZ=America/Sao_Paulo
ENV PASTA_PROJETO = $PASTA_PROJETO

### CONFIGURANDO TIMEZONE DO CONTAINER E INSTALANDO JAVA7 E UNZIP
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
	&& yum update -y \
	&& yum install -y \
	java-1.7.0-openjdk-devel \
	unzip

### PROCESSO DE INSTALACAO DO GRAILS 2.3.11 E CONFIGURACAO DE AMBIENTE
ADD http://dist.springframework.org.s3.amazonaws.com/release/GRAILS/grails-2.3.11.zip /opt

RUN unzip /opt/grails-2.3.11.zip -d /opt \
	&& rm /opt/grails-2.3.11.zip \
	&& groupadd -g 4000 suporte && useradd -m -u 4011 -g suporte tfsservice
	
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go
	
COPY settings.groovy /opt/grails-2.3.11/conf/
	
USER go

WORKDIR workspace_projeto

### grails:j7-package ###
#CMD ["/bin/bash","-c","cd $PASTA_PROJETO && grails clean && grails war --verbose"]

### grails:j7-nexus ### 
#CMD ["/bin/bash","-c","cd $PASTA_PROJETO && grails clean && grails compile && grails maven-deploy"]

### grails:j7-testes ###
#CMD ["/bin/bash","-c","cd $PASTA_PROJETO && grails -Dgrails.work.dir=target test-app --non-interactive --plain-output --stacktrace"]

#CMD ["grails", "clean"]