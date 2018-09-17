FROM centos:7

### CRIANDO USUARIO E GRUPO GO - TODOS DOCKERFILES E PUPPET QUE USAM GO PRECISAM MANTER O GUID E UID
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

RUN yum update -y 

RUN yum install epel-release -y

RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash

RUN yum install -y nodejs
RUN yum install gcc-c++ make -y 

RUN mkdir /codigo_fonte

WORKDIR /codigo_fonte

USER go

#CMD ["npm","run","deps"]

CMD npm run deps && npm run build

