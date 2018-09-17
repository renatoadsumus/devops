# EXEMPLO DE RUN
#
# docker run --name nome_container --rm -v $PWD:/workspace_projeto -v /opt/scripts_cd:/scripts_cd infodevops1:8380/python:35_latest /bin/bash -c "<comando>" => SCRIPTS CONTINUOUS DELIVERY
# docker run --name nome_container --rm -v $PWD:/workspace_projeto infodevops1:8380/python:27_latest /bin/bash -c "<comando>" => SCRIPTS DEPLOY AUTOMATIZADO
#
#

FROM centos:7

#ENV PYTHONPATH=/workspace_projeto
ENV TZ=America/Sao_Paulo

# PARA GERAR O CONTAINER DO PYTHON 2.7.10 (SCRIPTS DEPLOY AUTOMATIZADO), DESCOMENTAR A LINHA ABAIXO E COMENTAR A DO PYTHON 3.5.2
#ADD https://www.python.org/ftp/python/2.7.10/Python-2.7.10.tgz /opt

# PARA GERAR O CONTAINER DO PYTHON 3.5.2 (SCRIPTS CONTINUOUS DELIVERY), DESCOMENTAR A LINHA ABAIXO E COMENTAR A LINHA DO PYTHON 2.7.10
ADD https://www.python.org/ftp/python/3.5.2/Python-3.5.2.tgz /opt

#COPY 27/requirements.txt /opt
COPY 35/requirements.txt /opt

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && yum update -y \
	&& yum install -y \
	gcc \
	make \
	openssl-devel

#WORKDIR /opt/Python-2.7.10
WORKDIR /opt/Python-3.5.2

#RUN ./configure \
#    && make altinstall \
#	&& curl https://bootstrap.pypa.io/get-pip.py | python2.7 - \
#	&& python2.7 -m pip install --upgrade pip \
#	&& python2.7 -m pip install -r /opt/requirements.txt

RUN ./configure \
	&& make altinstall \
	&& python3.5 -m pip install --upgrade pip \
	&& python3.5 -m pip install -r /opt/requirements.txt \
	&& python3.5 -m pip install virtualenv

#INSTALANDO A VIRTUAL ENV - DESCOMENTAR SOMENTE PARA VERSAO 35
RUN mkdir /home/tfsservice/ \
	&& virtualenv /home/tfsservice/continuous_delivery_env \
	&& source /home/tfsservice/continuous_delivery_env/bin/activate \
    && pip install -r /opt/requirements.txt \
	&& echo -e '\nWORKING_DIRECTORY=/var/lib/go-agent/pipelines/${GO_PIPELINE_NAME}\n' >> /home/tfsservice/continuous_delivery_env/bin/activate \
	&& echo -e 'export WORKING_DIRECTORY\n' >> /home/tfsservice/continuous_delivery_env/bin/activate \
	&& echo -e '\nDIRETORIO_PROJETO=${WORKING_DIRECTORY}/${NOME_PROJETO}\n' >> /home/tfsservice/continuous_delivery_env/bin/activate \
	&& echo -e 'export DIRETORIO_PROJETO\n' >> /home/tfsservice/continuous_delivery_env/bin/activate \
	&& echo -e '\nPYTHONPATH=/opt/scripts_cd/\n' >> /home/tfsservice/continuous_delivery_env/bin/activate \
	&& echo -e 'export PYTHONPATH\n' >> /home/tfsservice/continuous_delivery_env/bin/activate
	
WORKDIR /workspace_projeto

#CMD ["python2.7","-V"]
CMD ["python3.5","-V"]	
