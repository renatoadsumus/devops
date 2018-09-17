FROM centos:7

MAINTAINER Equipe Devops <equipe-devops@infoglobo.com.br>

RUN chmod -R 755 /opt

COPY jre-6u26-linux-x64.bin /opt

RUN chmod +x /opt/jre-6u26-linux-x64.bin \
    && cd /opt \
    && ./jre-6u26-linux-x64.bin

ENV PATH=$PATH:/opt/jre1.6.0_26/bin
ENV JAVA_HOME=/opt/jre1.6.0_26/
