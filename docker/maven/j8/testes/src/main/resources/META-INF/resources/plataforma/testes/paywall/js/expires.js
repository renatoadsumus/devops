module("Expires", {
	setup : function() {
		this.gerenciaAcesso = new ControlaAcesso.Core.GerenciaAcesso();
		
		Teste.limparCookie();
	},
	teardown: function() {
		
		Teste.limparCookie();
	}
});

test("Quando registrar um conteúdo", function() {
	this.gerenciaAcesso.registrar(Math.round(Math.random() * 99999 + 10000) + "",
			{
				numAcessosParaBloqueio : 5
			});
	ok(this.gerenciaAcesso.itens.length > 0, "deve conter itens");
});

test("Quando o JSON for inválido", function() {
	raises(function() {
		var objeto = $.parseJSON('{"itens":["13423",');
	}, "deve ocorrer um erro");
});
