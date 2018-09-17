# export XML_PROJETO=xml_testes/OrdemVenda-soapui-project.xml
# export TEST_SUIT=SmokeTests
# export ENDPOINT_TESTES=http://apidsv
#
# docker run --rm -v $(pwd):/pasta_projeto infodevops1:18079/soapui:4.5.2 /pasta_projeto/$XML_PROJETO -s "$TEST_SUIT" -j -f /pasta_projeto -r -e $ENDPOINT_TESTES

FROM centos:7

ENV SOAPUI_VERSION 4.5.2

RUN yum install -y java-1.8.0-openjdk-devel \
    && curl http://smartbearsoftware.com/distrib/soapui/${SOAPUI_VERSION}/soapui-${SOAPUI_VERSION}-linux-bin.tar.gz -o soapui.tar.gz \
    && tar -xzf soapui.tar.gz -C /opt/ \
    && rm *.tar.gz \
    #&& /opt/SoapUI-${SOAPUI_VERSION}/bin/soapui.sh \
    && ln -s /opt/soapui-${SOAPUI_VERSION} /opt/soapui \
    && groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go 
	#&& chown -R go.go /workspace_projeto
	#&& chown -R go.go /opt/soapui/bin

USER go

#RUN chown -R go.go /opt/soapui/bin

ENV PATH ${PATH}:/opt/soapui/bin

WORKDIR /opt/soapui/bin

ENTRYPOINT ["testrunner.sh"]
