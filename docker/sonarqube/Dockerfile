FROM openjdk:8

MAINTAINER DevOps <devops@infoglobo.com.br>

ENV http_proxy=http://infocgw.ogmaster.local:8080 \
    https_proxy=http://infocgw.ogmaster.local:8080 \
    SONAR_VERSION=6.7.1 \
    SONARQUBE_HOME=/opt/sonarqube \
    # Database configuration
    # Defaults to using H2
    SONARQUBE_JDBC_USERNAME=sonar \
    SONARQUBE_JDBC_PASSWORD=sonar \
    SONARQUBE_JDBC_URL=

# Http port
EXPOSE 9000


COPY *.cer /etc/ssl/certs/java/

RUN groupadd -g 993 go \
    && useradd -m -u 997 -g go go \
    && chown -R go.go /usr/lib/jvm/ \
    && chown -R go.go /opt \
    && set -x \
    && cd /etc/ssl/certs/java/ \
    && keytool -import -noprompt -trustcacerts -alias ldap -file INFOSSS_NEW.cer -keystore cacerts -storepass changeit

USER go

RUN cd /opt \
    && curl -k -o sonarqube.zip -fSL https://sonarsource.bintray.com/Distribution/sonarqube/sonarqube-$SONAR_VERSION.zip \
    && curl -k -o sonarqube.zip.asc -fSL https://sonarsource.bintray.com/Distribution/sonarqube/sonarqube-$SONAR_VERSION.zip.asc \
    && unzip sonarqube.zip \
    && mv sonarqube-$SONAR_VERSION sonarqube \
    && rm sonarqube.zip* \
    && rm -rf $SONARQUBE_HOME/bin/* \
    && echo "xRzQdyMwnWIiH6FddcGQ0g==" >> /opt/sonarqube/conf/sonar-secret.txt

COPY sonar.properties $SONARQUBE_HOME/conf/

COPY sonar-ldap-plugin-2.1.0.507.jar $SONARQUBE_HOME/extensions/plugins/

COPY run.sh $SONARQUBE_HOME/bin/

WORKDIR $SONARQUBE_HOME
ENTRYPOINT ["./bin/run.sh"]
