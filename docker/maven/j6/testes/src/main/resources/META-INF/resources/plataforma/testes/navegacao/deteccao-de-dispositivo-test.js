module("deteccao.preferencia", {
	setup: function() {
		
	},
	teardown: function() {
		deteccao.cookie.remover();
	}
});

test("Nenhuma preferencia informada, irei visualizar as preferencias que estão no cookie.", function() {
	
	deteccao.cookie.adicionar("teste", 1);
	
	var preferencia = deteccao.preferencia();
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "teste", "O cookie visualizado.");
});

test("Remover a preferência.", function() {
	
	deteccao.cookie.adicionar("teste", 1);
	
	deteccao.preferencia({
		remover : true
	});
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "", "O cookie não existe.");
});

test("Nenhuma preferencia de versão informada.", function() {
	
	throws(function() {deteccao.preferencia({versao : ""})}, "Versão em branco, recebo um erro.");
	throws(function() {deteccao.preferencia({})}, "Versão undefined, recebo um erro.");
});

test("Salvar uma preferência.", function() {
	
	deteccao.preferencia({
		versao : "mobi"
	});
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "mobi", "O cookie foi criado.");
});

module("deteccao.cookie", {
	setup: function() {
		
	},
	teardown: function() {
		deteccao.cookie.remover();
	}
});

test("Quero salvar um cookie sem dominio.", function() {
	
	deteccao.cookie.adicionar("teste", 1);
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "teste", "O cookie foi criado.");
});

test("Quero salvar um cookie com dominio.", function() {
	
	deteccao.cookie.adicionar("teste", 1, window.location.hostname);
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "teste", "O cookie foi criado.");
});

test("Quero remover um cookie.", function() {
	
	deteccao.cookie.adicionar("teste");
	
	deteccao.cookie.remover();
	
	var valorDoCookie = deteccao.cookie.recuperar(deteccao.cookie.nome);
	
	ok(valorDoCookie == "", "O cookie foi removido.");
});

test("Quero calcular a data de expiração.", function() {
	
	throws(function() {deteccao.cookie.calcularDataParaExpiracao()}, "Teste sem informar o numero de dias recebo um error.");
	
	var amanha = deteccao.cookie.calcularDataParaExpiracao(1);
	
	ok(amanha instanceof Date, "Teste se o valor retornado é uma data.");
});

module("deteccao.dispositivo", {});

test("Quero verificar se o dispositivo é um mobi.", function() {
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular iphone.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular android.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.187 Mobile Safari/534.11+";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular blackberry.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular nokia lumia.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (SymbianOS/9.1; U; [en-us]) AppleWebKit/413 (KHTML, like Gecko) Safari/413";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular symbian.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13";
		
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular N9.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; NOKIA; Lumia 800)";
	
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular WindowsPhone.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0";
	
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular com firefox.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";
	
	ok(deteccao.dispositivo.isMobi(), "Simulando um celular com chrome.");
});

test("Quero verificar se o dispositivo é um pc.", function() {
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36";
	
	ok(deteccao.dispositivo.isPc(), "Simulando o acesso do chrome.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)";
	
	ok(deteccao.dispositivo.isPc(), "Simulando o acesso do IE.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:24.0) Gecko/20100101 Firefox/24.0";
	
	ok(deteccao.dispositivo.isPc(), "Simulando o acesso do firefox.");
	
	deteccao.dispositivo.userAgent = "Opera/9.80 (Macintosh; Intel Mac OS X; U; en) Presto/2.2.15 Version/10.00";
	
	ok(deteccao.dispositivo.isPc(), "Simulando o acesso do Opera.");
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10";
	
	ok(deteccao.dispositivo.isPc(), "Simulando o acesso do Safari.");
});

test("Quero verificar se o dispositivo é Ipad.", function() {
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
	
	ok(deteccao.dispositivo.isIpad(), "Simulando o acesso do ipad.");
});

test("Quero verificar se o google bot está caindo na página classica.", function() {
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
	
	ok(deteccao.dispositivo.isPc(), "Visualizo a página para pc.");
});

test("Quero verificar se o google bot mobile está caindo na página de mobi.", function() {
	
	deteccao.dispositivo.userAgent = "Mozilla/5.0 (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)";
	
	ok(deteccao.dispositivo.isMobi(), "Visualizo a página para mobi.");
});
