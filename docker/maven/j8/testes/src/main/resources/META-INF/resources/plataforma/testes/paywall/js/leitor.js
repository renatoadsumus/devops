module("ControlaAcesso.Leitor", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;
		
		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		Teste.limparCookie();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
	}
});

test("Dado que leitor não tenha visualizado uma matéria e o sistema queira saber a quantidade.", function() {
	
	equal(0, ControlaAcesso.Leitor.totalDeVisualizacoes(), "Então - Visualizo nenhum registro no cookie.");
});

test("Dado que leitor tenha registrado uma matéria e o sistema queira saber a quantidade de visualizações.", function() {
	
	var registroAcesso = this.registrar(1);
	
	equal(1, ControlaAcesso.Leitor.totalDeVisualizacoes(), "Então - Visualizo o registro de 1 visualização no cookie.");
});

test("Dado que leitor ultrapasse o limite máximo de visualizações do RegisterWall e o sistema queira saber a quantidade de visualizações no cookie.", function() {
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : false
			},
			logadoNaGloboCom : {
				RegisterWall : false
			}
		};
	
	var registroAcesso = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);
	
	equal(ControlaAcesso.Leitor.totalDeVisualizacoes(), 10, "Então - Visualizo o registro de 10 visualizações no cookie.");
});

test("Dado que leitor ultrapasse o limite máximo de visualizações do RegisterWall e tenha sido convertido.", function() {
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				RegisterWall : false
			}
		};
	
	var registroAcesso = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);
	
	equal(ControlaAcesso.Leitor.totalDeVisualizacoes(), 11, "Então - Visualizo o registro de 11 visualizações no cookie.");
});

test("Dado que leitor ultrapasse o limite máximo de visualizações do Paywall e o sistema queira saber a quantidade de visualizações no cookie.", function() {
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true,
				Paywall : false
			},
			logadoNaGloboCom : {
				RegisterWall : false
			}
		};
	
	var registroAcesso = this.registrar(this.Paywall.limiteDeAcesso, mock);
	
	equal(ControlaAcesso.Leitor.totalDeVisualizacoes(), 20, "Então - Visualizo o registro de 20 visualizações no cookie.");
});
