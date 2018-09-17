FROM centos:7

ENV JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el7_5.x86_64/jre/

#INSTALANDO PACOTE BASICOS
RUN yum update -y \
	&& yum install -y wget \
	unzip \
	java-1.8.0-openjdk

#CRIANDO USUARIO E GRUPO GO
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go
	
#INSTALANDO O GRADLE 2.14
RUN wget https://services.gradle.org/distributions/gradle-2.14-all.zip \
	&& unzip -oq gradle-2.14-all.zip -d /opt/gradle \
	&& ln -sfn gradle-2.14 /opt/gradle/latest \
	&& ln -s /opt/gradle/latest/bin/gradle /usr/bin/gradle
	
USER go

WORKDIR /workspace_projeto

CMD ["gradle build"]