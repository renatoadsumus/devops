#docker run -d --rm --name mongo -p 27017:27017 -v /opt/mongo/data_db:/data/db mongodb

FROM centos:7

MAINTAINER gbsilva

# O pacote mongodb-org não existe nos repositórios padrão do CentOS. No entanto, o MongoDB mantém um repositório dedicado
# Adicionando o repositório ao servidor
COPY ./mongodb-org.repo /etc/yum.repos.d/

# Instalando o MongoDB
RUN yum update -y && yum install -y \
		mongodb-org

# Mapeando pasta para armazenar dados do MongoDB
VOLUME ["/data/db"]

WORKDIR /data

# Conf alterado na linha de "dbPath: /data/db" para que os dados sejam armazenados na /data/db"
COPY ./mongod.conf /etc

EXPOSE 27017

# Start do MongoDB
CMD ["mongod"]