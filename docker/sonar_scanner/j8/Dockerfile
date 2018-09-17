# EXEMPLO DE RUN
#
# docker run --rm -v $PWD:/codigo_da_aplicacao infodevops1:8380/sonar-scanner:j8_latest => SCANNER SONAR
#

FROM centos:7

ENV SONAR_SCANNER_HOME /opt/sonar-scanner-2.8
ENV PATH $PATH:$SONAR_SCANNER_HOME/bin
ENV JAVA_HOME /usr/lib/jvm/java-1.8.0
ENV PATH $PATH:$JAVA_HOME/bin
ENV TZ=America/Sao_Paulo

### CONFIGURANDO TIMEZONE DO CONTAINER E INSTALANDO JAVA7 E UNZIP
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
	&& yum update -y \
	&& yum install -y \
	java-1.8.0-openjdk-devel \
	unzip
	
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

### ADICIONANDO O SCANNER DO SONARQUBE
ADD https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-2.8.zip /opt

RUN unzip /opt/sonar-scanner-2.8.zip -d /opt \
	&& rm /opt/sonar-scanner-2.8.zip \
	&& echo -e "\nsonar.host.url=http://infosonar.ogmaster.local:9000" >> $SONAR_SCANNER_HOME/conf/sonar-scanner.properties \
	&& groupadd -g 4000 suporte && useradd -m -u 4011 -g suporte tfsservice
	
USER go

WORKDIR codigo_da_aplicacao 

CMD ["sonar-scanner"]