var configRegisterWall = {
	"ativado" : true,
	"caminhoDoCookie" : "/",
	"diasDeExpiracaoDoCookie" : 30,
	"dominioDoCookie" : ".globoi.com",
	"eventos" : [ {
		"ativado" : true,
		"codigoDoProduto" : "OG03",
		"consultaComJsonp" : true,
		"degustacaoAtivada" : true,
		"limiteDeAcesso" : 10,
		"nomeDoEvento" : "RegisterWall",
		"patrocinio" : null,
		"somenteContadorAtivado" : false,
		"urlCadastroGloboCom" : "https://login.qa01.globoi.com/cadastro/4975",
		"urlDeAutenticacao" : "?service=ajax&action=sso&globoID=4975",
		"urlDeRedirecionamento" : "/registro/",
		"urlDeRedirecionamentoDoLogin" : "/resources/redirectPayWall.html",
		"urlDeStatusDoLeitor" : "http://apiqlt/funcionalidade/4975/autorizacao-acesso/v2",
		"urlLoginGloboCom" : "https://login.qa01.globoi.com/login/4975",
		"urlsLivreAcesso" : "www.facebook.com, t.co, twitter.com, www.google.com, www.google.com.br, google.com, google.com.br, plus.google.com, www.globo.com, br.bing.com, br.search.yahoo.com, g1.globo.com, extra.globo.com, www.techtudo.com.br, globoesporte.globo.com, mulher.globo.com, meus5minutos.globo.com, variedades.globo.com, onias.globoi.com, famosos.globo.com, m.facebook.com, lm.facebook.com, l.facebook.com, facebook.com, mobile.twitter.com, m.globo.com, m.g1.globo.com, m.extra.globo.com, m.globoesporte.globo.com"
	} ],
	"identificadorDoProduto" : "t",
	"limiteMaximoAcesso" : 10,
	"userAgentsLivreAcesso" : "(ia_archiver)|(Googlebot)|(Mediapartners-Google)|(AdsBot-Google)|(msnbot)|(Yahoo! Slurp)|(ZyBorg)|(Ask Jeeves/Teoma) | (bingbot) | (cXensebot)",
	"queryStringLiberada" : [
	        {
	        	"utm_source": "Facebook",
	            "utm_medium": "Social"
	        },
	        {
	            "utm_source": "Twitter",
	            "utm_medium": "Social"
	        }
		]
}

var configPaywall = {
		"ativado" : true,
		"caminhoDoCookie" : "/",
		"diasDeExpiracaoDoCookie" : 30,
		"dominioDoCookie" : ".globoi.com",
		"eventos" : [
				{
					"ativado" : false,
					"codigoDoProduto" : "OG03",
					"consultaComJsonp" : true,
					"degustacaoAtivada" : true,
					"limiteDeAcesso" : 10,
					"nomeDoEvento" : "RegisterWall",
					"patrocinio" : null,
					"somenteContadorAtivado" : false,
					"urlCadastroGloboCom" : "https://login.qa01.globoi.com/cadastro/4975",
					"urlDeAutenticacao" : "?service=ajax&action=sso&globoID=4975",
					"urlDeRedirecionamento" : "http://assinatura.globostg.globoi.com/Experimente.aspx",
					"urlDeRedirecionamentoDoLogin" : "/resources/redirectPayWall.html",
					"urlDeStatusDoLeitor" : "http://apiqlt/funcionalidade/4975/autorizacao-acesso/v2",
					"urlLoginGloboCom" : "https://login.qa01.globoi.com/login/4975",
					"urlsLivreAcesso" : "www.facebook.com, t.co, twitter.com, www.google.com, www.google.com.br, google.com, google.com.br, plus.google.com, www.globo.com, br.bing.com, br.search.yahoo.com, g1.globo.com, extra.globo.com, www.techtudo.com.br, globoesporte.globo.com, mulher.globo.com, meus5minutos.globo.com, variedades.globo.com, onias.globoi.com, famosos.globo.com"
				},
				{
					"ativado" : true,
					"codigoDoProduto" : "OG03",
					"consultaComJsonp" : true,
					"degustacaoAtivada" : false,
					"limiteDeAcesso" : 20,
					"nomeDoEvento" : "Paywall",
					"patrocinio" : null,
					"somenteContadorAtivado" : false,
					"urlCadastroGloboCom" : "https://login.qa01.globoi.com/cadastro/3981",
					"urlDeAutenticacao" : "?service=ajax&action=sso&globoID=3981",
					"urlDeRedirecionamento" : "/registro?evento=rw",
					"urlDeRedirecionamentoDoLogin" : "/plataforma/html/paywall/redirecionar.html",
					"urlDeStatusDoLeitor" : "http://apiqlt/funcionalidade/3981/autorizacao-acesso/v2",
					"urlLoginGloboCom" : "https://login.qa01.globoi.com/login/3981",
					"urlsLivreAcesso" : "www.facebook.com, t.co, twitter.com, www.google.com, www.google.com.br, google.com, google.com.br, plus.google.com, www.globo.com, br.bing.com, br.search.yahoo.com, g1.globo.com, extra.globo.com, www.techtudo.com.br, globoesporte.globo.com, mulher.globo.com, meus5minutos.globo.com, variedades.globo.com, onias.globoi.com, famosos.globo.com, m.facebook.com, lm.facebook.com, l.facebook.com, facebook.com, mobile.twitter.com, m.globo.com, m.g1.globo.com, m.extra.globo.com, m.globoesporte.globo.com"
				} ],
		"identificadorDoProduto" : "t",
		"limiteMaximoAcesso" : 20,
		"userAgentsLivreAcesso" : "(ia_archiver)|(Googlebot)|(Mediapartners-Google)|(AdsBot-Google)|(msnbot)|(Yahoo! Slurp)|(ZyBorg)|(Ask Jeeves/Teoma) | (bingbot) | (cXensebot)",
		"queryStringLiberada" : [
     	        {
    	        	"utm_source": "Facebook",
    	            "utm_medium": "Social"
    	        },
    	        {
    	            "utm_source": "Twitter",
    	            "utm_medium": "Social"
    	        }
    		]
	}

var configTodosEventos = {
	"ativado" : true,
	"caminhoDoCookie" : "/",
	"diasDeExpiracaoDoCookie" : 30,
	"dominioDoCookie" : ".globoi.com",
	"eventos" : [
			{
				"ativado" : true,
				"codigoDoProduto" : "OG03",
				"consultaComJsonp" : true,
				"degustacaoAtivada" : true,
				"limiteDeAcesso" : 10,
				"nomeDoEvento" : "RegisterWall",
				"patrocinio" : null,
				"somenteContadorAtivado" : false,
				"urlCadastroGloboCom" : "https://login.qa01.globoi.com/cadastro/4975",
				"urlDeAutenticacao" : "?service=ajax&action=sso&globoID=4975",
				"urlDeRedirecionamento" : "http://assinatura.globostg.globoi.com/Experimente.aspx",
				"urlDeRedirecionamentoDoLogin" : "/resources/redirectPayWall.html",
				"urlDeStatusDoLeitor" : "http://apiqlt/funcionalidade/4975/autorizacao-acesso/v2",
				"urlLoginGloboCom" : "https://login.qa01.globoi.com/login/4975",
				"urlsLivreAcesso" : "www.facebook.com, t.co, twitter.com, www.google.com, www.google.com.br, google.com, google.com.br, plus.google.com, www.globo.com, br.bing.com, br.search.yahoo.com, g1.globo.com, extra.globo.com, www.techtudo.com.br, globoesporte.globo.com, mulher.globo.com, meus5minutos.globo.com, variedades.globo.com, onias.globoi.com, famosos.globo.com"
			},
			{
				"ativado" : true,
				"codigoDoProduto" : "OG03",
				"consultaComJsonp" : true,
				"degustacaoAtivada" : false,
				"limiteDeAcesso" : 20,
				"nomeDoEvento" : "Paywall",
				"patrocinio" : null,
				"somenteContadorAtivado" : false,
				"urlCadastroGloboCom" : "https://login.qa01.globoi.com/cadastro/3981",
				"urlDeAutenticacao" : "?service=ajax&action=sso&globoID=3981",
				"urlDeRedirecionamento" : "/registro?evento=rw",
				"urlDeRedirecionamentoDoLogin" : "/plataforma/html/paywall/redirecionar.html",
				"urlDeStatusDoLeitor" : "http://apiqlt/funcionalidade/3981/autorizacao-acesso/v2",
				"urlLoginGloboCom" : "https://login.qa01.globoi.com/login/3981",
				"urlsLivreAcesso" : "www.facebook.com, t.co, twitter.com, www.google.com, www.google.com.br, google.com, google.com.br, plus.google.com, www.globo.com, br.bing.com, br.search.yahoo.com, g1.globo.com, extra.globo.com, www.techtudo.com.br, globoesporte.globo.com, mulher.globo.com, meus5minutos.globo.com, variedades.globo.com, onias.globoi.com, famosos.globo.com, m.facebook.com, lm.facebook.com, l.facebook.com, facebook.com, mobile.twitter.com, m.globo.com, m.g1.globo.com, m.extra.globo.com, m.globoesporte.globo.com"
			} ],
	"identificadorDoProduto" : "t",
	"limiteMaximoAcesso" : 20,
	"userAgentsLivreAcesso" : "(ia_archiver)|(Googlebot)|(Mediapartners-Google)|(AdsBot-Google)|(msnbot)|(Yahoo! Slurp)|(ZyBorg)|(Ask Jeeves/Teoma) | (bingbot) | (cXensebot)",
	"queryStringLiberada" : [
	        {
	        	"utm_source": "Facebook",
	            "utm_medium": "Social"
	        },
	        {
	            "utm_source": "Twitter",
	            "utm_medium": "Social"
	        }
		]
}