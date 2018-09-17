module("ControlaAcesso.Core", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.aceiteTermoUso = resposta.falha.cadun.aceiteTermoUso();
		
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

test("Dado que chegue no limite máximo de visualizações, não quero redirecionar um leitor quando ele visualizar um determinado conteúdo liberado.", function() {
	
	var mock = {
			naoRedirecionar : true
		};
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(!teste.RegisterWall.redirecionado, "Então - O leitor não é redirecionado.");

	equal(null, registro.eventos.RegisterWall.dtExec, "Então - Visualizamos que a data de execução não é preenchida.");
	equal(null, registro.eventos.RegisterWall.dtConv, "Então - Visualizamos que a data de conversão não é preenchida.");

	equal(registro.itens.length, this.RegisterWall.limiteDeAcesso, "Então - Visualizamos que a quantidade máxima de visualizações de conteúdo é igual ao cadastrado no RegisterWall.");
});

test("Quero validar a estrutura de resposta enviado para o callback de envio de mensagem.", function() {
	
	var mockResposta = resposta.falha.cadun.naoAutorizado();
	
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

	ok(isNotUndefined(teste.Paywall.respostaBarramento.mensagem), "Checo que existe mensagem.");
	ok(isNotUndefined(teste.Paywall.respostaBarramento.motivo), "Checo que existe o motivo.");
	ok(isNotUndefined(teste.Paywall.respostaBarramento.autorizado), "Checo que existe a autorização.");
});


module("ControlaAcesso.Core.Barramento", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.aceiteTermoUso = resposta.falha.cadun.aceiteTermoUso();
		
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

test("Dado que tenha conectado ao barramento, quero verificar se a url do barramento esta vindo preenchida.", function() {
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : false
			},
			respostas : {
				RegisterWall : this.aceiteTermoUso
			}
		};
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);

	equal(teste.RegisterWall.url, URL_DO_BARRAMENTO + encodeURIComponent(location.href), "Então - Visualizamos que a url esta preenchida.");
});

test("Dado que tenha conectado ao barramento e ele informe uma url em branco.", function() {
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : resposta.falha.urlEmBranco()
			}
		};
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);

	equal(teste.RegisterWall.url, this.RegisterWall.urlDeRedirecionamento, "Então - Visualizamos a url padrão cadastrada nas configurações.");
});

test("Dado que tenha conectado ao barramento e ele informe uma url nula.", function() {
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : resposta.falha.urlNulo()
			}
		};
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);

	equal(teste.RegisterWall.url, this.RegisterWall.urlDeRedirecionamento, "Então - Visualizamos a url padrão cadastrada nas configurações.");
});

test("Dado que tenha conectado ao barramento e ele informe uma url 'undefined'.", function() {
	
	var mock = {
			logadoNaGloboCom : {
				RegisterWall : true
			},
			leitorSeConverteu : {
				RegisterWall : true
			},
			respostas : {
				RegisterWall : resposta.falha.urlUndefined()
			}
		};
	
	var teste = this.registrar(this.RegisterWall.limiteDeAcesso + 1, mock);

	equal(teste.RegisterWall.url, this.RegisterWall.urlDeRedirecionamento, "Então - Visualizamos a url padrão cadastrada nas configurações.");
});

module("ControlaAcesso.Core.urlLiberada", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;
		
		Teste.limparCookie();
		
		this.core = new ControlaAcesso.Core();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
	}
});

test("Quando uma url referenciadora for informada", function() {
    equal(this.core.urlLiberada("http://www.google.com", "http://www.google.com"), true, "deve ser liberada caso esteja na lista de URLs liberadas");
});

test("Quando uma url referenciadora for informada e não houver URLs liberadas", function() {
    equal(this.core.urlLiberada("http://www.google.com", ""), false, "não deve ser liberada");
});

test("Quando não for informada uma url referenciadora e não houver URLs liberadas", function() {
    equal(this.core.urlLiberada("", ""), false, "não deve ser liberada");
});

module("ControlaAcesso.Core.userAgentLiberado", {
    setup: function() {
        this.core = new ControlaAcesso.Core();
    }
});

test("Quando forem informados o user agent e os user agents liberados", function() {
    var expressaoUserAgentsLiberados = "(ia_archiver)|(Googlebot)|(Mediapartners-Google)|(AdsBot-Google)|(msnbot)|(Yahoo! Slurp)|(ZyBorg)|(Ask Jeeves/Teoma)";
    
    expect(9);
    
    // Alexa-1
    ok(this.core.userAgentLiberado("ia_archiver", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Alexa-1");
    // Alexa-2
    ok(this.core.userAgentLiberado("ia_archiver-web.archive.org", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Alexa-2");
    // AskJeeves-Teoma
    ok(this.core.userAgentLiberado("Mozilla/2.0 (compatible; Ask Jeeves/Teoma; +http://sp.ask.com/docs/about/tech_crawling.html)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent AskJeeves-Teoma");
    // Googlebot-2.1
    ok(this.core.userAgentLiberado("Googlebot/2.1 (+http://www.google.com/bot.html)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Googlebot-2.1");
    // Googlebot-Mozilla-2.1
    ok(this.core.userAgentLiberado("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Googlebot-Mozilla-2.1");
    // Google-AdSense-2.1
    ok(this.core.userAgentLiberado("Mediapartners-Google/2.1", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Google-AdSense-2.1");
    // MSN-1.0
    ok(this.core.userAgentLiberado("msnbot/1.0 (+http://search.msn.com/msnbot.htm)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent MSN-1.0");
    // Yahoo-Slurp
    ok(this.core.userAgentLiberado("Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent Yahoo-Slurp");
    // ZyBorg-1.0
    ok(this.core.userAgentLiberado("Mozilla/4.0 compatible ZyBorg/1.0 (wn-14.zyborg@looksmart.net; http://www.WISEnutbot.com)", expressaoUserAgentsLiberados), "deve ser liberado para o user agent ZyBorg-1.0");
});

test("Quando for informado o user agent e a não houver user agents liberados", function() {
    equal(this.core.userAgentLiberado("Um user agente", ""), false, "não deve ser liberada");
});

test("Quando não forem informados o user agent e os user agents liberados", function() {
    equal(this.core.userAgentLiberado("", ""), false, "não deve ser liberada");
});

module("ControlaAcesso.Core.queryStringLiberada", {
	setup: function() {
		this.core = new ControlaAcesso.Core();
		
		this.queryStringConfig = 
			[
		        {
		        	"utm_source": "Facebook",
		            "utm_medium": "Social"
		        },
		        {
		            "utm_source": "Twitter",
		            "utm_medium": "Social"
		        }
			];
	}
});

test("Dado que não seja informada uma configuração", function() {
	
	ok(!this.core.queryStringLiberada(), "o acesso não deve ser liberado.");
});

test("Dado que seja informada uma configuração inválida.", function() {
	
	ok(!this.core.queryStringLiberada("teste"), "o acesso não deve ser liberado.");
});

test("Dado que seja informada uma querystring VÁLIDA.", function() {
	
	var tabelaDeValoresValidos = [
        "?utm_source=Facebook&utm_medium=Social",
        "?utm_medium=Social&utm_source=Facebook",
        "?utm_source=Facebook&utm_medium=SOCIAL",
        "?utm_source=Facebook&utm_medium=social",
        "?utm_source=FACEBOOK&utm_medium=Social",
        "?utm_source=facebook&utm_medium=Social",
        "?utm_source=FACEBOOK&utm_medium=SOCIAL",
        "?utm_source=facebook&utm_medium=social",
        "?utm_source=Twitter&utm_medium=Social",
        "?utm_medium=Social&utm_source=Twitter",
        "?utm_source=Twitter&utm_medium=SOCIAL",
        "?utm_source=Twitter&utm_medium=social",
        "?utm_source=TWITTER&utm_medium=Social",
        "?utm_source=twitter&utm_medium=Social",
        "?utm_source=TWITTER&utm_medium=SOCIAL",
        "?utm_source=twitter&utm_medium=social"
	];
	

	for (var i = 0; i < tabelaDeValoresValidos.length; i++) {
		var queryString = tabelaDeValoresValidos[i];
		
		mocarQueryString(queryString);
		ok(this.core.queryStringLiberada(this.queryStringConfig), "o acesso DEVE ser liberado para query string \"" + queryString +"\".");
	}
});

test("Dado que seja informada uma querystring INVÁLIDA.", function() {
	
	var tabelaDeValoresInvalidos = [
        "?utm_source=Facebook",
        "?utm_source=Facebook&utm_medium",
        "?utm_source=Facebook&utm_medium=Fun",
        "?utm_medium=Social",
        "?utm_source&utm_medium=Social",
        "?utm_source=Orkut&utm_medium=Social",
        "?utm_source=Orkut&utm_medium=Fun",
        "?utm_source&utm_medium",
        "?utm_source=Twitter",
        "?utm_source=Twitter&utm_medium",
        "?utm_source=Twitter&utm_medium=Fun",
        "?-"
	];
	

	for (var i = 0; i < tabelaDeValoresInvalidos.length; i++) {
		var queryString = tabelaDeValoresInvalidos[i];
		
		mocarQueryString(queryString);
		ok(!this.core.queryStringLiberada(this.queryStringConfig), "o acesso NÃO DEVE ser liberado para query string \"" + queryString +"\".");
	}
});

function mocarQueryString(queryString) {
	ControlaAcesso.Browser.prototype.queryString = function() {
		return queryString;
	}
}
