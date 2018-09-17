module("ControlaAcesso.Model", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;
		
		this.core = new ControlaAcesso.Core();
		
		this.resultado = ControlaAcesso.Model.criarEventos(CONFIG_GLOBAL);
		
		this.resultadoJSON = ControlaAcesso.JSON.conveterParaJson(this.resultado);
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		Teste.limparCookie();
		
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
	}
});

test("Quero validar a estrutura do cookie.", function() {
	var registro =  ControlaAcesso.Model.carregar();

	ok(isNotUndefined(registro.eventos), "Então verifico que a estrutura de eventos foi criado.");
	ok(isNotUndefined(registro.dtIni), "Então verifico que a estrutura de data de inicialização foi criada.");
	ok(isNotUndefined(registro.dtExp), "Então verifico que a estrutura de data de expiracao foi criada.");
	ok(isNotUndefined(registro.itens), "Então verifico que a estrutura para guardar os itens visualizados foi criado.");

	ok(isNotUndefined(registro.eventos.RegisterWall), "Então verifico que a estrutura para o RegisterWall foi criado.");
	ok(isNotUndefined(registro.eventos.RegisterWall.dtExec), "Então verifico que dentro do RegisterWall foi criada a estrutura de data de execução.");
	ok(isNotUndefined(registro.eventos.RegisterWall.dtConv), "Então verifico que dentro do RegisterWall foi criada a estrutura de data de conversão.");
	ok(isNotUndefined(registro.eventos.RegisterWall.motivo), "Então verifico que dentro do RegisterWall foi criada a estrutura do motivo.");

	ok(isNotUndefined(registro.eventos.Paywall), "Então verifico que a estrutura para o Paywall foi criado.");
	ok(isNotUndefined(registro.eventos.Paywall.dtExec), "Então verifico que dentro do Paywall foi criada a estrutura de data de execução.");
	ok(isNotUndefined(registro.eventos.Paywall.dtConv), "Então verifico que dentro do Paywall foi criada a estrutura de data de conversão.");
	ok(isNotUndefined(registro.eventos.Paywall.motivo), "Então verifico que dentro do Paywall foi criada a estrutura do motivo.");
});

test("Criar eventos a partir da configuração", function() {
	var eventos = ControlaAcesso.Model.criarEventos(CONFIG_GLOBAL);	
	equal(ControlaAcesso.JSON.conveterParaJson(eventos), this.resultadoJSON);
});

test("Carregar o registro quando não há registros no cookie", function() {
	var registro =  ControlaAcesso.Model.carregar();
	equal(registro.itens.length, 0);
	equal(ControlaAcesso.JSON.conveterParaJson(registro.eventos), this.resultadoJSON);
});

test("Carregar o registro do cookie", function() {
	this.core.registrar({id: "123"});
	var registro =  ControlaAcesso.Model.carregar();
	deepEqual(registro.itens, ["123t"]);
	equal(ControlaAcesso.JSON.conveterParaJson(registro.eventos), this.resultadoJSON);
});

test("Importar somente a data de inicialização do cookie antigo", function() {
	
	var cookieAntigo = '{"itens":["8508472"],"dtini":"2013-05-27T15:20:09.482Z","dtwal":null,"dtcnv":null}';
	
	ControlaAcesso.Cookies.escreverCookie(
		ControlaAcesso.NOME_COOKIE,
		cookieAntigo, 
		{
			expires : ControlaAcesso.Cookies.calcularDataExpiracao(CONFIG_GLOBAL.diasDeExpiracaoDoCookie, new Date()),
			domain : CONFIG_GLOBAL.dominioDoCookie,
			path : CONFIG_GLOBAL.caminhoDoCookie
		}
	);
	
	var registro =  ControlaAcesso.Model.carregar();
	var registerWall = registro.eventos.RegisterWall;
	
	equal(registro.dtIni._converterParaJson(), "\"2013-05-27T15:20:09.482Z\"");
	equal(registerWall.dtExec, null);
	equal(registerWall.dtConv, null);
});

test("Importar todos as informações do cookie antigo", function() {
	
	var cookieAntigo = '{"itens":["8508472"],"dtini":"2013-05-27T15:20:09.482Z","dtwal":"2013-05-28T15:20:09.482Z","dtcnv":"2013-05-28T15:20:09.482Z"}';
	
	ControlaAcesso.Cookies.escreverCookie(
		ControlaAcesso.NOME_COOKIE,
		cookieAntigo, 
		{
			expires : ControlaAcesso.Cookies.calcularDataExpiracao(CONFIG_GLOBAL.diasDeExpiracaoDoCookie, new Date()),
			domain : CONFIG_GLOBAL.dominioDoCookie,
			path : CONFIG_GLOBAL.caminhoDoCookie
		}
	);
	
	var registro =  ControlaAcesso.Model.carregar();
	var registerWall = registro.eventos.RegisterWall;
	
	equal(registro.dtIni._converterParaJson(), "\"2013-05-27T15:20:09.482Z\"");
	equal(registerWall.dtExec._converterParaJson(), "\"2013-05-28T15:20:09.482Z\"");
	equal(registerWall.dtConv._converterParaJson(), "\"2013-05-28T15:20:09.482Z\"");
});

test("Dado que seja solicitado a atualização da data de execução, de conversão e inserção de um motivo.", function() {
	var registro = ControlaAcesso.Model.carregar();
	
	registro.atualizarDataDeExecucao(this.RegisterWall);
	registro.atualizarDataDeConversao(this.RegisterWall);
	registro.inserirMotivo("Teste", this.RegisterWall);
	
	var cookie = Teste.obterCookieNoFormatoJSON();
	
	notEqual(cookie.eventos.RegisterWall.dtExec, null, "Então - Visualizamos que a data de execução preenchida.");
	notEqual(cookie.eventos.RegisterWall.dtConv, null, "Então - Visualizamos que a data de conversão do RegisterWall no cookie não é nula.");
	notEqual(cookie.eventos.RegisterWall.motivo, null, "Então - Visualizamos os motivos inseridos.");
});
