FROM centos

WORKDIR /bin/

ENV TSURU_VERSION=1.4.0

RUN curl -L https://github.com/tsuru/tsuru-client/releases/download/${TSURU_VERSION}/tsuru_${TSURU_VERSION}_linux_amd64.tar.gz -o tsuru_client.tar.gz && \
    tar xvf tsuru_client.tar.gz && \
    rm -f tsuru_client.tar.gz

WORKDIR /projeto/

#ENTRYPOINT "tsuru"
CMD "tsuru help"
