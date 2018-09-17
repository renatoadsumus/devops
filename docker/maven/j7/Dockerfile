FROM centos:7

ENV MAVEN_VERSAO=3.5.0
ENV JAVA_VERSAO=1.7.0
ENV JAVA_HOME /usr/lib/jvm/java-${JAVA_VERSAO}
ENV M2_HOME /opt/apache-maven-${MAVEN_VERSAO}
ENV PATH=$PATH:${M2_HOME}/bin/
ENV TZ=America/Sao_Paulo

RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
	&& yum install java-${JAVA_VERSAO}-openjdk-devel -y \
	&& curl http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSAO}/binaries/apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
		-o apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& tar xzf apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& rm apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& mv apache-maven-${MAVEN_VERSAO} /opt \
	&& groupadd -g 4000 suporte \
	&& useradd -m -u 4011 -g suporte tfsservice

### COPIA OS SETTINGS COM A CONFIGURACAO DO DOCKER NEXUS DA INFOGLOBO
COPY settings.xml /opt/apache-maven-${MAVEN_VERSAO}/conf/settings.xml

WORKDIR codigo_da_aplicacao

USER go

CMD ["mvn", "clean"]