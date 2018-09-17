module("ControlaAcesso.Erro", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

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


test("Dado que ocorra um erro para o leitor, quero gravar um cookie liberando o acesso por uma hora.", function() {
	
	var configPaywall = this.Paywall;
	
	ControlaAcesso.Erro.registrar("Teste");
	
	var registroAcesso = this.registrar(configPaywall.limiteDeAcesso + 1, true);
	
	var registro = Teste.obterCookieNoFormatoJSON();
	
	ok(ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.Erro.NOME_DO_COOKIE_SERVICO_FORA) != "", "Então - Visualizamos o cookie criado.");
	ok(ControlaAcesso.Erro.existe(), "Então - Visualizamos o serviço com erro.");
	
	equal(registro, null, "Então - Visualizamos que não ocorreu registro dos conteúdos visualizados por ele.");
	ok(!registroAcesso.RegisterWall.redirecionado, "Então - Visualizamos que o leitor não sofreu redirecionamento no RegisterWall.");
	ok(!registroAcesso.Paywall.redirecionado, "Então - Visualizamos que o leitor não sofreu redirecionamento no ControlaAcesso.");
});

if (!isInternetExplorer()) {
	asyncTest("Dado que ocorra um erro no barramento, quero gravar um cookie liberando o acesso por uma hora.", function() {
		
		var register = this.RegisterWall;
		var urlDeStatusDoLeitor = register.urlDeStatusDoLeitor;
		
		var mock = {
				logadoNaGloboCom : {
					RegisterWall : true
				},
				leitorSeConverteu : {
					RegisterWall : false
				},
				usarValidarAutorizacaoOriginal : true
			};
		
		register.urlDeStatusDoLeitor = "/blablabla";
		
		var registroAcesso = this.registrar(register.limiteDeAcesso + 1, mock);
		
		var registro = ControlaAcesso.Model.carregar();
		
		setTimeout(function() {
			ok(ControlaAcesso.Erro.existe(), "Então - Visualizamos o serviço com erro.");
			ok(!registroAcesso.RegisterWall.redirecionado, "Então - Visualizamos que o leitor não sofreu redirecionamento no RegisterWall.");
			ok(!registroAcesso.Paywall.redirecionado, "Então - Visualizamos que o leitor não sofreu redirecionamento no ControlaAcesso.");
			ok(registroAcesso.executouAoAutorizar, "Então - Visualizamos que a função de autorizar foi executada.");
			start();
		}, 750);
		
		register.urlDeStatusDoLeitor = urlDeStatusDoLeitor;
	});
} else {
	testSkip("[Dado que ocorra um erro no barramento, quero gravar um cookie liberando o acesso por uma hora.] A partir da versão 1.9 do jquery a consulta ajax começou a gerar erro nos testes.");
}
