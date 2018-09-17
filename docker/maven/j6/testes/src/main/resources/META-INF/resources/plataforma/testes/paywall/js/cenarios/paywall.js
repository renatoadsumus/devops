module("ControlaAcesso.Cenarios.Paywall", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.inexistente = resposta.falha.sap.inexistente();
		
		this.autorizado = resposta.sucesso.autorizado();
		
		Teste.ativarTodosEventos();
		
		Teste.limparCookie();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
		
		Teste.ativarTodosEventos();
		
		Teste.desativarContadorEmTodosEventos();
	}
});

test("Dado que o Paywall esteja somente com o contador ativado, o leitor tenha passado pelo Register e ultrapasse o limite de visualizações.", function() {
	var configPaywall = this.Paywall;
	
	Teste.ativarContadorNoEvento(configPaywall);
	
	var mock = {
		leitorSeConverteu : {
			RegisterWall : true
		},
		logadoNaGloboCom : {
			RegisterWall : false
		}
	};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(registro.eventos.RegisterWall.dtExec, null, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(registro.eventos.RegisterWall.dtConv, null, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado no Paywall.");
	
	equal(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "20", "Então - Visualizamos o status '20'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});


test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, não esteja autenticado na globo.com e tenha sido convertido.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				Paywall : true,
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : false,
				RegisterWall : false
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(registro.eventos.RegisterWall.dtExec, null, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(registro.eventos.RegisterWall.dtConv, null, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado no ControlaAcesso.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall não é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall não é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall-passou", "Então - Visualizamos o status 'paywall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, esteja autenticado na globo.com e tenha sido autorizado pelo serviço.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : this.autorizado
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado no Paywall.");
	
	equal(null, registro.eventos.Paywall.dtExec, "Então - Visualizamos que a data de execução do paywall é nula.");
	notEqual(null, registro.eventos.Paywall.dtConv, "Então - Visualizamos que a data de conversão do paywall não é nula.");
	equal(registro.eventos.Paywall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall-passou", "Então - Visualizamos o status 'paywall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, esteja autenticado na globo.com e não tenha sido autorizado pelo serviço.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
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
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado no Paywall.");
	
	notEqual(null, registro.eventos.Paywall.dtExec, "Então - Visualizamos que a data de execução do paywall esta preenchida.");
	equal(null, registro.eventos.Paywall.dtConv, "Então - Visualizamos que a data de conversão do paywall é nula.");
	equal(registro.eventos.Paywall.motivo, this.inexistente.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.inexistente.motivo);
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, esteja autenticado na globo.com, não tenha sido autorizado pelo serviço e fez a assinatura (converteu).", function() {
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
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado no Paywall.");
	
	notEqual(null, registro.eventos.Paywall.dtExec, "Então - Visualizamos que a data de execução do paywall esta preenchida.");
	notEqual(null, registro.eventos.Paywall.dtConv, "Então - Visualizamos que a data de conversão do paywall é nula.");
	equal(registro.eventos.Paywall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall-passou", "Então - Visualizamos o status 'paywall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o RegisterWall esteja desativado, o Paywall habilitado, o leitor ultrapasse o limite máximo de visualizações, esteja logado na globo.com e não faça a conversão.", function() {
	var configPaywall = this.Paywall;
	
	Teste.ativarSomenteOEvento(configPaywall);
	
	var mock = {
			leitorSeConverteu : {
				Paywall : false
			},
			logadoNaGloboCom : {
				Paywall : true
			},
			respostas : {
				Paywall : this.inexistente
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado quando chega no RegisterWall.");
	
	equal(registro.eventos.RegisterWall.dtConv, null, "Então - Visualizamos que a data de conversão do RegisterWall no cookie é nula.");
	equal(registro.eventos.RegisterWall.dtExec, null, "Então - Visualizamos que a data de execução do RegisterWall no cookie é nula.");
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado quando chega no Paywall.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, esteja autenticado na globo.com, tenha sido autorizado pelo barramento e não esteja com o termo de uso.", function() {
	var configPaywall = this.Paywall;
	var termoDeUso = resposta.falha.cadun.aceiteTermoUso();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : termoDeUso
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado no Paywall.");
	
	notEqual(null, registro.eventos.Paywall.dtExec, "Então - Visualizamos que a data de execução do paywall esta preenchida.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	equal(registro.eventos.Paywall.motivo, termoDeUso.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + termoDeUso.motivo);
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall", "Então - Visualizamos o status 'paywall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, esteja autenticado na globo.com, tenha sido autorizado pelo barramento, não esteja com o termo de uso, tenha sido redirecionado e tenha dado o aceite.", function() {
	var configPaywall = this.Paywall;
	var termoDeUso = resposta.falha.cadun.aceiteTermoUso();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : termoDeUso
			},
			aceitouTermo : {
				Paywall : true
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado no Paywall.");
	
	notEqual(null, registro.eventos.Paywall.dtExec, "Então - Visualizamos que a data de execução do paywall não é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall não é nula.");
	equal(registro.eventos.Paywall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "paywall-passou", "Então - Visualizamos o status 'paywall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});

test("Dado que o Paywall esteja ativado, o leitor tenha passado pelo Register, alcance a quantidade máxima de visualizações do paywall e acesse uma query string liberada.", function() {
	var configPaywall = this.Paywall;
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : false,
				RegisterWall : false
			},
			queryString : {
				Paywall : "?utm_source=Facebook&utm_medium=Social"
			}
		};
	
	var teste = this.registrar(configPaywall.limiteDeAcesso + 1, mock);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado no RegisterWall.");

	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução do RegisterWall não é nula.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão do RegisterWall não é nula.");
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado no Paywall.");
	
	equal(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do paywall é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do paywall é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "20", "Então - Visualizamos o status '20'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, configPaywall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no Paywall");
	
});
