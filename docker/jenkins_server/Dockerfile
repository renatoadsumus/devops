#docker run -d -p 8083:8080 -p 50000:50000 -p 40058:40058 -v $CAMINHO_DIRETORIO_JENKINS:/var/lib/jenkins -v /var/run/docker.sock:/var/run/docker.sock --name jenkins renatoadsumus/jenkins_server

FROM renatoadsumus/python:35_latest

ENV PY_AMBIENTE_EXECUCAO="PRD"

MAINTAINER devops@infoglobo.com.br

ENV TZ=America/Sao_Paulo

RUN groupadd -g 995 jenkins \
	&& useradd -m -u 997 -g jenkins jenkins

#CONFIGURANDO TIMEZONE, INSTALANDO O CURL, BAIXANDO O REPOSITÓRIO DO JENKINS, INSTALANDO O JDK 1.8, INSTALANDO O JENKINS-SERVER, GIT e SVN

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
        && yum install -y wget \
        && wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo \
        && rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key \
        && yum install -y java-1.8.0-openjdk \
        && yum install -y jenkins \
        && yum -y install initscripts \
        && yum install -y git \
        && yum install -y subversion \
		&& yum install -y docker \
        && yum install -y vim \
		&& yum install -y sudo \
		&& yum install -y samba-client \
        && yum clean all \
		&& mkdir /home/tfsservice/.ssh \
		&& chmod 700 /home/tfsservice/.ssh \
		&& mkdir /opt/chaves_git \
		&& chmod 700 /opt/chaves_git

COPY jenkins.sh /
RUN chmod +x /jenkins.sh \
	&& chown jenkins.jenkins /jenkins.sh
	
COPY id_rsa /home/tfsservice/.ssh/
COPY id_rsa.pub /home/tfsservice/.ssh/
COPY git /opt/chaves_git/
COPY git.pub /opt/chaves_git/
COPY ssh_config /home/jenkins/.ssh/config

RUN chown -R jenkins.jenkins /home/tfsservice/.ssh/ \
	&& chmod 600 /home/tfsservice/.ssh/id_rsa \
	&& chmod 644 /home/tfsservice/.ssh/id_rsa.pub \
	&& chown -R jenkins.jenkins /opt/chaves_git \
	&& chmod 600 /opt/chaves_git/git \
	&& chmod 644 /opt/chaves_git/git.pub \
	&& chown jenkins.jenkins /home/jenkins/.ssh/config \
	&& chmod 644 /home/jenkins/.ssh/config \
	&& chown -R jenkins.jenkins /home/tfsservice/continuous_delivery_env \
	&& echo 'jenkins      ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers \
	&& echo -e 'search ogmaster.local\nnameserver 172.17.34.136\nnameserver 172.17.32.98' > /etc/resolv.conf
	

EXPOSE 40058
EXPOSE 50000

#USER jenkins

CMD ["/jenkins.sh"]
