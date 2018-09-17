FROM centos:centos6
#http://dougbtv.com/nfvpe/2016/12/09/openshift-s2i-custom-builder/ - BOM Link 
#https://docs.openshift.org/latest/creating_images/s2i_testing.html
#https://www.mankier.com/1/oc-new-app - oc new-app --list
# https://blog.openshift.com/create-s2i-builder-image/
# Explicando como criar um serviço app-new-app - FUNCIONOU
#http://v1.uncontained.io/playbooks/app_dev/binary_deployment_howto.html
#https://access.redhat.com/documentation/en-us/red_hat_software_collections/2/html/using_red_hat_software_collections_container_images/sti
#ORIGIN
#http://blog.4linux.com.br/2017/06/criando-cluster-com-openshift/

ENV MAVEN_VERSAO=3.5.2
ENV JAVA_VERSAO=1.7.0
ENV JAVA_HOME /usr/lib/jvm/java-${JAVA_VERSAO}
ENV TZ=America/Sao_Paulo
ENV CATALINA_HOME /usr/share/tomcat6
ENV CATALINA_PID "${CATALINA_HOME}/bin/catalina.pid"
ENV CATALINA_OPTS="-server -Djava.awt.headless=true -Xms1024m -Xmx2048m -Dfile.encoding=UTF-8  -Duser.timezone=America/Sao_Paulo -Xss256k"
ENV M2_HOME /opt/apache-maven-${MAVEN_VERSAO}
ENV PATH=$PATH:${M2_HOME}/bin/:${JAVA_HOME}/bin/

LABEL io.k8s.description="Essa imagem é gerada para TOMCAT 6.0.41 e JAVA 1.7 e Java 1.6" \
      io.k8s.display-name="tomcat 6.0.48 e JAVA 1.7" \
      io.openshift.expose-services="8080:http" \
      io.openshift.tags="builder,tomcat"

RUN chmod -R 755 /opt
COPY jre-6u26-linux-x64.bin /opt
RUN chmod +x /opt/jre-6u26-linux-x64.bin \
    && cd /opt \
    && ./jre-6u26-linux-x64.bin	

### INSTALACAO DAS FERRAMENTAS USADAS PELO CONTAINER
RUN yum update -y && yum install -y \   
    unzip \
	java-${JAVA_VERSAO}-openjdk-devel -y \
	&& curl http://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSAO}/binaries/apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
		-o apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& tar xzf apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& rm apache-maven-${MAVEN_VERSAO}-bin.tar.gz \
	&& mv apache-maven-${MAVEN_VERSAO} /opt \	
    && curl https://archive.apache.org/dist/tomcat/tomcat-6/v6.0.41/bin/apache-tomcat-6.0.41.tar.gz -o apache-tomcat.tar.gz --insecure \
    && tar xvf apache-tomcat.tar.gz \
    && mv apache-tomcat-6.0.41 /usr/share/tomcat6 \
    && chmod -R 755 /usr/share/tomcat6 \
	&& ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
	
# TODO (optional): Copy the builder files into /opt/app-root
#COPY ./<builder_folder>/ /opt/app-root/

# Add the s2i scripts.
LABEL io.openshift.s2i.scripts-url=image:///usr/libexec/s2i
COPY ./s2i/bin/ /usr/libexec/s2i
COPY sqljdbc4.jar /usr/share/tomcat6/lib/
COPY lib.zip /usr/share/tomcat6/lib/
COPY *.xml /usr/share/tomcat6/conf/

# Setup privileges for both s2i code insertion, and openshift arbitrary user
RUN mkdir -p /opt/app-root/
RUN mkdir -p /var/log/tomcat.juridico/logs
RUN cd /usr/share/tomcat6/lib/ && unzip -o lib.zip 
COPY tomcat-users.xml /usr/share/tomcat6/conf/
#COPY settings.xml /opt/apache-maven-${MAVEN_VERSAO}/conf/settings.xml
#COPY settings.xml /opt/apache-maven-3.5.2/conf/settings.xml
WORKDIR /opt/app-root/
	
ENV APP_DIRS /opt/ /usr/ /var/log/ /tmp/
#ENV APP_DIRS /opt/ /usr/share/tomcat6/ /var/log/ /tmp/
RUN chown -R 1001:1001 $APP_DIRS
RUN chgrp -R 0 $APP_DIRS
RUN chmod -R g+rwx $APP_DIRS
RUN chown -R 1001:1001 /usr/libexec/
RUN chmod -R 755 /usr/libexec/

RUN yum -y install iputils

EXPOSE 8080

USER 1001

CMD [ "/usr/share/tomcat6/bin/catalina.sh", "run" ]