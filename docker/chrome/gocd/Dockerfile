# EXEMPLO DE RUN
# export WORKSPACE=$(pwd)
# export MVN_OPTS='-Dtest=BarreiraSmokeTestSuite -PSTGLinux'
# docker run --rm \
#            -v $WORKSPACE/teste_funcional:/codigo_teste_com_selenium_webdriver \
#            -v /opt/maven/repository:/root/.m2/repository/ \
#            -e "MVN_OPTS=$MVN_OPTS" \
#            chrome:$tag

FROM ubuntu:16.04

ENV DISPLAY=:10
ENV CHROMEDRIVER_VERSION=2.40

RUN apt-get update -y && apt-get install -y \
    maven \
    openjdk-8-jdk \
    unzip \
    wget \
    xvfb \
### NECESSARIO PARA CHROME
    gconf-service \
    libgconf-2-4 \
    fonts-liberation \
    xdg-utils \
    libgtk-3-0 \
    libxss1 \
    libappindicator1 \
    libindicator7 \
    lsb-release \
### DOWNLOAD GOOGLE CHROME
    && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome*.deb \
### DOWNLOAD CHROME DRIVER
    && wget http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip \
### LIMPANDO ARQUIVOS DESNECESSARIOS
    && rm chromedriver_linux64.zip \
    && rm google-chrome*.deb \
    && rm -rf /var/lib/apt/lists/*

### Esse google-chrome contem a linha --user-data-dir --no-sandbox
COPY google-chrome /opt/google/chrome/

### COPIA OS SETTINGS COM A CONFIGURACAO DO DOCKER NEXUS DA INFOGLOBO
COPY settings.xml /etc/maven/settings.xml

RUN chmod +x chromedriver /opt/google/chrome/google-chrome \
    && mkdir /opt/web-driver \
### COPIANDO O CHROME PARA A PASTA opt/web-driver
    && mv -f chromedriver /opt/web-driver/chromedriver \
    && groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go \
    && mkdir /codigo_teste_com_selenium_webdriver
	
RUN groupadd -g 4000 suporte && useradd -m -u 4011 -g suporte tfsservice

WORKDIR codigo_teste_com_selenium_webdriver

CMD ["/bin/bash","-c","Xvfb :10 -ac -screen 0 1366x768x24 & su tfsservice -c 'mvn clean test $MVN_OPTS'"]
