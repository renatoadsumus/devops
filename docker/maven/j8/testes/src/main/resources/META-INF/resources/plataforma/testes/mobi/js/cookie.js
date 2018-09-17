module("deteccao.cookie", {
	setup: function() {
		
		nomeCookie = deteccao.cookie.nome;
		
	},
	teardown: function() {
		
	}
});

test("Quero testar que o cookie não existe.", function() {
	equal(deteccao.cookie.recuperar(nomeCookie), "");
});

test("Quero adicionar o cookie de preferência web", function() {
	
	deteccao.cookie.adicionar('web');
	
	equal(deteccao.cookie.recuperar(nomeCookie), 'infgPreferenciaVisualizacao=web', 'Preferência do usuário : ' + deteccao.cookie.recuperar(nomeCookie));
});