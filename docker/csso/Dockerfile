FROM renatoadsumus/nodejs:6.11.5

#CRIANDO USUARIO E GRUPO GO
RUN groupadd -g 2000 go \
	&& useradd -m -u 2001 -g go go

#INSTALANDO O CSSO
RUN npm install -g csso-cli \
	&& ln -s /usr/local/n/versions/node/7.0.0/lib/node_modules/csso-cli/bin/csso /usr/local/bin/csso
	
COPY minificador_css.sh /home/go/

RUN chmod +x /home/go/minificador_css.sh \
	&& chown go:go /home/go/minificador_css.sh
	
USER go

WORKDIR /diretorio_css

CMD ["/home/go/minificador_css.sh"]
