# docker run -d --name nexus -v /opt/maven/repository_nexus/:/sonatype-work/nexus3 -p 8081:8081 -p 8380:8380 infodevops1:8380/nexus:3.4
# docker run -it --entrypoint=/bin/bash -v /opt/maven/repository_nexus/:/sonatype-work/nexus3 -p 8081:8081 nexus:3.4
FROM ubuntu:16.04

ARG NEXUS_VERSION=3.4.0-02
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
ENV JAVA_OPTS="-XX:PermSize=2048m -XX:MaxPermSize=2048m -Xms1024m -Xmx2048m"

### CONFIGURANDO TIMEZONE DO CONTAINER
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \


RUN apt-get update -y \
	&& apt-get install -y openjdk-8-jdk \
	&& apt-get install wget -y \
	&& apt-get install tar -y	
	
RUN wget https://download.sonatype.com/nexus/3/nexus-${NEXUS_VERSION}-unix.tar.gz \
	&& tar xzvf nexus-*.tar.gz \
	&& mv nexus-${NEXUS_VERSION} nexus \	
	&& rm nexus-${NEXUS_VERSION}-unix.tar.gz \
### EDITANDO ARQUIVO DO CONTAINER PARA RUN AS USER NEXUS
	&& sed 's/#//' -i /nexus/bin/nexus.rc \
	&& sed 's/""/"nexus"/' -i /nexus/bin/nexus.rc

RUN groupadd nexus \
	&& useradd -g nexus nexus \
	&& chown -R nexus:nexus /nexus \
	&& chown -R nexus:nexus /sonatype-work
	
EXPOSE 8081

USER nexus

CMD ["/nexus/bin/nexus", "run"]