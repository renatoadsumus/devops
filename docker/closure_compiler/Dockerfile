#docker run --rm --name $1 -v /opt/agents/pipelines/$2:/diretorio_js renatoadsumus/closure_compiler:v20170423_latest NOME_CONTAINER NOME_PIPELINE/NOME_PROJETO

FROM centos:7

ENV CLOSURE_COMPILER_VERSION = 'v20170423'

### CRIANDO USUARIO E GRUPO GO - TODOS DOCKERFILES E PUPPET QUE USAM GO PRECISAM MANTER O GUID E UID
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

#INSTALANDO DEPENDÊNCIAS E OUTROS PACOTES
RUN yum update -y \
	&& yum install -y wget \
	unzip \
	java-1.8.0-openjdk

#INSTALANDO O CLOSURE COMPILER VERSAO v20170423
RUN wget http://dl.google.com/closure-compiler/compiler-20170423.zip \
	&& mkdir /opt/closure-compiler \
	&& unzip -oq compiler-20170423.zip -d /opt/closure-compiler/closure-compiler-v20170423 \
	&& mv /opt/closure-compiler/closure-compiler-v20170423/closure-compiler*.jar /opt/closure-compiler/closure-compiler-v20170423/closure-compiler.jar \
	&& ln -sfn /opt/closure-compiler/closure-compiler-v20170423 /opt/closure-compiler/latest \
	&& chown go:go /opt/closure-compiler/closure-compiler-v20170423/* \
	&& chown go:go /opt/closure-compiler/latest
	
COPY minificador_js.sh /home/go/

RUN chmod +x /home/go/minificador_js.sh \
	&& chown go:go /home/go/minificador_js.sh

USER go
	
WORKDIR /diretorio_js
	
CMD ["/home/go/minificador_js.sh"]
	