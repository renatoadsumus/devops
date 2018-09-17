module("ControlaAcesso.Cenarios.Paywall.Patrocinado", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.inexistente = resposta.falha.sap.inexistente();
		
		this.autorizado = resposta.sucesso.autorizado();
		
		Teste.ativarTodosEventos();
		
		Teste.limparCookie();
		
		this.Paywall.patrocinio = simularPatrocinioAtivado();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
		
		Teste.ativarTodosEventos();
		
		Teste.desativarContadorEmTodosEventos();
		
		this.Paywall.patrocinio = null;
	}
});

function simularPatrocinioAtivado() {
	
	var dataFimMocada = "July 08, 2022 23:59:59	";
	var dataInicioMocada = "June 06, 2014 22:00:00";
	
	return {dataInicio: dataInicioMocada, dataFim: dataFimMocada, diasDeCortesia: 30};
	
}

function simularPatrocinioAtivadoNoFuturo() {
	
	var dataFimMocada = "July 08, 2022 23:59:59	";
	var dataInicioMocada = "June 06, 2021 22:00:00";
	
	return {dataInicio: dataInicioMocada, dataFim: dataFimMocada, diasDeCortesia: 30};
	
}

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, se autentique na globo.com e o patrocinio esteja ativado.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true,
				Paywall : false
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : this.inexistente
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor nao é redirecionado para o site de ofertas.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	ok(teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio é chamada.");
	ok(teste.Paywall.chamouBarramento, "Então - Verifico que a função que o BARRAMENTO foi chamado.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado com uma data de expiração e ativação no futuro.", function() {
	var configPaywall = this.Paywall;
	
	configPaywall.patrocinio = simularPatrocinioAtivadoNoFuturo();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true,
				Paywall : false
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : this.inexistente
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.Paywall.redirecionado, "Então - O leitor É redirecionado para o site de ofertas.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar NÃO É CHAMADA.");
	ok(!teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio NÃO É CHAMADA.");
	ok(teste.Paywall.chamouBarramento, "Então - Verifico que a função que vai ao BARRAMENTO FOI EXECUTADA.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha recebido o patrocinio e continue navegando pelo site.", function() {
	
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true,
				Paywall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : this.inexistente
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio é chamada na primeira vez.");
	ok(!teste.Paywall.redirecionado, "Então - O leitor nao é redirecionado para o site de ofertas.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
	// Simula a navegação por outros registros
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 10, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
		
	ok(!teste.Paywall.redirecionado, "Então - O leitor nao é redirecionado para o site de ofertas QUANDO CONTINUA NAVEGANDO.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula QUANDO CONTINUA NAVEGANDO.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula QUANDO CONTINUA NAVEGANDO.");
	
	ok(!teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio NÃO FOI CHAMADA DE NOVO.");
	
	ok(!teste.Paywall.chamouBarramento, "Então - Verifico que o BARRAMENTO não foi CHAMADO.");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha recebido o patrocinio, dias depois o cookie 'infgw' expire e ele chegue novamente no limite máximo de visualizações.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true,
				Paywall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : this.inexistente
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio é chamada ANTES DO COOKIE EXPIRAR.");
	ok(!teste.Paywall.redirecionado, "Então - O leitor nao é redirecionado para o site de ofertas ANTES DO COOKIE EXPIRAR.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula ANTES DO COOKIE EXPIRAR.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula ANTES DO COOKIE EXPIRAR.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado' ANTES DO COOKIE EXPIRAR.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall ANTES DO COOKIE EXPIRAR.");
	
	// Simula a navegação quando o cookie expira
	ControlaAcesso.Cookies.removerCookie(ControlaAcesso.NOME_COOKIE, {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	if(localStorage) {
		localStorage.removeItem('infgwls');
	}
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
		
	ok(!teste.Paywall.redirecionado, "Então - O leitor nao é redirecionado para o site de ofertas DEPOIS QUE O COOKIE EXPIROU.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula PORQUE ELE CHEGOU NO LIMITE MÁXIMO.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula PORQUE ELE CHEGOU NO LIMITE MÁXIMO.");
	
	ok(!teste.Paywall.executouExibirPatrocinio, "Então - Verifico que a função que exibe o patrocinio NÃO FOI EXECUTADA DEPOIS QUE O COOKIE EXPIROU.");
	
	ok(teste.Paywall.chamouBarramento, "Então - Verifico que o BARRAMENTO não foi CHAMADO novamente.");
});

test("Dado que o leitor esteja com o status 'AUTORIZADO_COM_RESSALVA' e o patrocinio ativado.", function() {
	
	var mockResposta = resposta.sucesso.comRessalva();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie não é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que AoCompletar FOI EXECUTADA.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função que envia mensagem FOI EXECUTADA.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'CANCELADO' e o patrocinio ativado.", function() {
	
	var mockResposta = resposta.falha.sap.cancelado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem NÃO foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie esta preenchida.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie esta preenchida.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar NÃO é chamada.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função que envia mensagem NÃO FOI EXECUTADA.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'AUTORIZADO' e o patrocinio ativado.", function() {
	
	var mockResposta = resposta.sucesso.autorizado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	equal(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie não é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});