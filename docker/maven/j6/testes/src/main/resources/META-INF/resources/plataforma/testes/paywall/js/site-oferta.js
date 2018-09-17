module("ControlaAcesso.SiteOferta", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;
		
		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.naoAutorizado = resposta.falha.cadun.naoAutorizado();
		
		Teste.limparCookie();
		
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
					Paywall : this.naoAutorizado
				}
			};
		
		this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
		
		ControlaAcesso.Configuracao.json = null;
		
		this.siteOferta = new ControlaAcesso.SiteOferta(CONFIG_GLOBAL.dominioDoCookie);
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
		
		Teste.ativarTodosEventos();
		
		Teste.desativarContadorEmTodosEventos();
	}
});

test("Dado que o site oferta informe um dominio nulo, vazio ou undefined.", function() {

	throws( function() {new ControlaAcesso.SiteOferta(null)}, "Então - Visualizamos o lançamento de uma exceção quando o dominio é nulo.");
	throws( function() {new ControlaAcesso.SiteOferta("")}, "Então - Visualizamos o lançamento de uma exceção quando o dominio é vazio.");
	throws( function() {new ControlaAcesso.SiteOferta()}, "Então - Visualizamos o lançamento de uma exceção quando o dominio é undefined.");
});

test("Dado que o leitor esteja no site de Oferta e é solicitado a atualização da data de conversão.", function() {
	
	var registroAntes = ControlaAcesso.Model.carregar();
	
	this.siteOferta.atualizarDataDeConversao();
	
	var registro = ControlaAcesso.Model.carregar();
	
	notEqual(null, registro.eventos.Paywall.dtConv, "Então - Visualizamos a data de conversão preenchida no Paywall.");
	equal(registroAntes.dtExp.toString(), registro.dtExp.toString(), "Então - Visualizamos que a data de expiracao se manteve (" + registroAntes.dtExp.toString() + ").");
});

test("Dado que o leitor esteja no site de Oferta e é solicitado a inserção do motivo.", function() {
	var registroAntes = ControlaAcesso.Model.carregar();
	
	this.siteOferta.inserirMotivo("Teste");
	
	var registro = ControlaAcesso.Model.carregar();
	
	equal("Teste", registro.eventos.Paywall.motivo, "Então - Visualizamos o motivo preenchido com o valor 'Teste'.");
	equal(registroAntes.dtExp.toString(), registro.dtExp.toString(), "Então - Visualizamos que a data de expiracao se manteve (" + registroAntes.dtExp.toString() + ").");
});

test("Dado que o site oferta informe um motivo nulo, vazio ou undefined.", function() {

	throws( function() {this.siteOferta.inserirMotivo(null)}, "Então - Visualizamos o lançamento de uma exceção quando o motivo é nulo.");
	throws( function() {this.siteOferta.inserirMotivo("")}, "Então - Visualizamos o lançamento de uma exceção quando o motivo é vazio.");
	throws( function() {this.siteOferta.inserirMotivo()}, "Então - Visualizamos o lançamento de uma exceção quando o motivo é undefined.");
});
