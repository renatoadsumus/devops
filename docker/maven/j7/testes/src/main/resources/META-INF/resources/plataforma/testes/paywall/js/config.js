module("ControlaAcesso.Configuracao", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;
		
		Teste.limparCookie();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
	}
});

asyncTest("Dado que o sistema gere um registro de acesso carregando as configurações das urls que estão no mundo escenic (Ex: OGlobo, Ela).", function() {
	
	ControlaAcesso.Configuracao.json = null;
	
	ControlaAcesso.registrar({
		id: "123", 
		nomeConfig: "oglobo"
	});
	
	setTimeout(function() {
		
		var json = ControlaAcesso.Configuracao.json;
		
		notEqual(null, json, "Então - Visualizo que os dados da configuração foram carregados.");
		equal(json.identificadorDoProduto, "g", "Então - Visualizo que o identificador do produto corresponde ao oglobo (g).")
		
		start();
	}, 1500);
});

asyncTest("Dado que o sistema gere um registro de acesso carregando as configurações das urls que estão em outro ambiente (Ex: Kogut).", function() {
	
	ControlaAcesso.Configuracao.json = null;
	
	ControlaAcesso.registrar({
		id: "123", 
		nomeConfig: "kogut", 
		urlBaseConfig: "http://" + window.location.hostname
	});
	
	setTimeout(function() {
		
		var json = ControlaAcesso.Configuracao.json;
		
		notEqual(null, json, "Então - Visualizo que os dados da configuração foram carregados.");
		equal(json.identificadorDoProduto, "k", "Então - Visualizo que o identificador do produto corresponde ao oglobo asp (k).")
		
		start();
	}, 1500);
});

asyncTest("Dado que seja solicitado o carregamento das configurações do globo e o cookie (t3st3pyig) de teste do paywall esteja criado.", function() {
	
	ControlaAcesso.Configuracao.json = null;
	
	ControlaAcesso.Cookies.escreverCookie("t3st3pyig", "ligado", {
		path: "/"
	}, false);
	
	ControlaAcesso.registrar({
		id: "123", 
		nomeConfig: "oglobo", 
		urlBaseConfig: "http://" + window.location.hostname
	});
	
	setTimeout(function() {
		
		var json = ControlaAcesso.Configuracao.json;
		
		notEqual(null, json, "Então - Visualizo que os dados da configuração foram carregados.");
		equal(json.identificadorDoProduto, "t", "Então - Visualizo que o identificador do produto corresponde ao de teste (t).")
		
		start();
	}, 1500);
});

test("Dado que o sistema registre o primeiro acesso correspondente ao RegisterWall.", function() {
	var evento = ControlaAcesso.Model.obterConfiguracaoEventos(1);
	equal("RegisterWall", evento.nomeDoEvento, "Então - Visualizo que foi carregado a configuração de evento RegisterWall");
});

test("Dado que o sistema registre o último acesso de RegisterWall.", function() {
	var evento =  ControlaAcesso.Model.obterConfiguracaoEventos(10);
	equal("RegisterWall", evento.nomeDoEvento, "Então - Visualizo que foi carregado a configuração de evento RegisterWall");
});

test("Dado que o sistema registre o primeiro acesso correspondente ao ControlaAcesso.", function() {
	var evento =  ControlaAcesso.Model.obterConfiguracaoEventos(11);
	equal("Paywall", evento.nomeDoEvento, "Então - Visualizo que foi carregado a configuração de evento de Paywall");
});

test("Dado que o sistema registre o último acesso de ControlaAcesso.", function() {
	var evento =  ControlaAcesso.Model.obterConfiguracaoEventos(20);
	equal("Paywall", evento.nomeDoEvento, "Então - Visualizo que foi carregado a configuração de evento de Paywall");
});

asyncTest("Quero usar o nome de um outro cookie.", function() {
	
	ControlaAcesso.registrar({
		id: "123",
		nomeDoCookie: "teste123"
	});
	
	setTimeout(function() {
		var registro = ControlaAcesso.Model.carregar();
		
		equal("123t", registro.itens[0], "Então - Visualizo que foi cadastrado o id '123' no cookie 'teste123'.");
		start();
	}, 500);
});
