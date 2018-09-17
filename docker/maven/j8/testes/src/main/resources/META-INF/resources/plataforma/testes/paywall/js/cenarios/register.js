module("ControlaAcesso.Cenarios.Register", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.inexistente = resposta.falha.sap.inexistente();
		
		this.autorizado = resposta.sucesso.autorizado();
		
		Teste.limparCookie();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
		
		Teste.ativarTodosEventos();
		
		Teste.desativarContadorEmTodosEventos();
	}
});

test("Dado que o leitor não tenha acessado uma matéria.", function() {
	
	var registro = ControlaAcesso.Model.carregar();
	
	equal(ControlaAcesso.Leitor.status(), "00", "Então - Visualizamos o status de '00'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
});

test("Dado que o RegisterWall esteja ativado, o leitor não tenha alcançado o limite de visualizações.", function() {
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso - 1);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");
	
	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "09", "Então - Visualizamos o status de '09'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	ok(registro.itens.length < this.RegisterWall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é menor ao cadastrado no RegisterWall.");
});

test("Dado que o leitor tenha chegado ao limite máximo de visualizações do RegisterWall.", function() {
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");
	
	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "10", "Então - Visualizamos que a quantidade máxima de visualizações é igual ao status do leitor '10'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	ok(registro.itens.length = this.RegisterWall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});

test("Dado que o RegisterWall esteja ativado, o leitor ultrapasse o limite de visualizações, não esteja logado na globo.com e não tenha feito a conversão.", function() {
	
	var register = this.RegisterWall;
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : false
			},
			leitorSeConverteu : {
				RegisterWall : false
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado.");
	
	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos a data de execução preenchida.");
	equal(null, registro.eventos.RegisterWall.motivo, "Então - Visualizamos que o motivo não foi preenchido.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos a data de conversão nula.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "register-wall", "Então - Visualizamos o status 'register-wall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	equal(registro.itens.length, register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});

test("Dado que o RegisterWall esteja ativado, o leitor ultrapasse o limite de visualizações, esteja logado na globo.com, não tenha sido autorizado pelo serviço e não tenha feito a conversão.", function() {
	
	var register = this.RegisterWall;
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : false
			},
			respostas : {
				RegisterWall : this.inexistente
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado.");
	
	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos a data de execução preenchida.");
	equal(registro.eventos.RegisterWall.motivo, this.inexistente.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.inexistente.motivo);
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos a data de conversão nula.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "register-wall", "Então - Visualizamos o status 'register-wall'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.itens.length, register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});

test("Dado que o RegisterWall esteja ativado, o leitor ultrapasse o limite de visualizações, esteja logado na globo.com, não tenha sido autorizado pelo serviço, tenha feito a conversão no site oferta.", function() {
	
	var register = this.RegisterWall;
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : this.inexistente
			},
			degustacao : {
				RegisterWall : true
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado.");
	
	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos a data de execução preenchida.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos a data de conversão preenchida.");
	equal(registro.eventos.RegisterWall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	equal(teste.RegisterWall.degustacao, "degustação", "Então - Verifico que o tipo da degustação foi enviada pelo callback aoCompletar().");
	equal("", ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE_DEGUSTACAO), "Então - Verifico que o cookie da degustação foi removido.");
	
	equal(ControlaAcesso.Leitor.status(), "register-wall-passou", "Então - Visualizamos o status 'register-wall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	ok(registro.itens.length > register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é maior do que foi cadastrado no RegisterWall.");
});

test("Dado que o RegisterWall esteja ativado, o leitor ultrapasse o limite de visualizações, esteja logado na globo.com e tenha sido autorizado pelo serviço.", function() {
	
	var register = this.RegisterWall;
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : this.autorizado
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");
	
	equal(null,registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é nula.");
	equal(registro.eventos.RegisterWall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "register-wall-passou", "Então - Visualizamos o status 'register-wall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	ok(registro.itens.length > register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é maior do que foi cadastrado no RegisterWall.");
});

test("Dado que o RegisterWall esteja somente com o contador ativado e o leitor ultrapasse o limite de visualizações.", function() {
	var register = this.RegisterWall;

	Teste.ativarContadorNoEvento(register);

	var teste = this.registrar(register.limiteDeAcesso + 1);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");

	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "10", "Então - Visualizamos o status '10'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");

	equal(registro.itens.length, register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");

});

test("Dado que somente o RegisterWall esteja ativado, o leitor ultrapasse o limite de visualizações, esteja logado na globo.com, não tenha sido autorizado pelo serviço, tenha feito a conversão.", function() {
	
	var register = this.RegisterWall;
	
	Teste.ativarSomenteOEvento(this.RegisterWall);
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : this.inexistente
			},
			degustacao : {
				RegisterWall : true
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);

	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.RegisterWall.redirecionado, "Então - O leitor é redirecionado.");
	
	notEqual(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos a data de execução preenchida.");
	notEqual(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos a data de conversão preenchida.");
	equal(registro.eventos.RegisterWall.motivo, this.autorizado.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + this.autorizado.motivo);
	
	ok(teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "register-wall-passou", "Então - Visualizamos o status 'register-wall-passou'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	ok(registro.itens.length = register.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é IGUAL do que foi cadastrado no RegisterWall.");
});

test("Dado que o leitor tenha chegado ao limite máximo de visualizações do RegisterWall, alcance a quantidade máxima de visualizações do RegisterWall e acesse uma query string liberada.", function() {
	
	var register = this.RegisterWall;
	
	var mock = {
			queryString : {
				RegisterWall : "?utm_source=Facebook&utm_medium=Social"
			}
		};
	
	var teste = this.registrar(register.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");
	
	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "10", "Então - Visualizamos que a quantidade máxima de visualizações é igual ao status do leitor '10'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	ok(registro.itens.length = this.RegisterWall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});

test("Dado que o leitor tenha chegado ao limite máximo de visualizações do RegisterWall e tenha apagado o cookie.", function() {
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso);
	
	ControlaAcesso.Cookies.removerCookie(ControlaAcesso.NOME_COOKIE, {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(registro != null, "Então o cookie é restaurado a partir do Local Storage");
	
	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");
	
	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");
	
	ok(!teste.RegisterWall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.status(), "10", "Então - Visualizamos que a quantidade máxima de visualizações é igual ao status do leitor '10'.");
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "-", "Então - Visualizamos que o tipo de cadastro do leitor é indefinido '-'.");
	
	ok(registro.itens.length = this.RegisterWall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});
