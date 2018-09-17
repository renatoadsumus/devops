function containsText(text, searchText) {
    return text.indexOf(searchText) > -1;
}

module("ParChaveValor", {
    setup: function() {
        this.kvp = new ControlaAcesso.Utils.ParChaveValor("dez", 10);
    }
});
    
test("Quando criar um par chave valor", function() {
    expect(2);
    strictEqual(this.kvp.chave, "dez", "deve ser preenchida a propriedade chave");
    strictEqual(this.kvp.valor, 10, "deve ser preenchida a propriedade valor");
});

test("Quando converter para string", function() {
    equal(this.kvp.toString(), "dez=10", "deve ser formatado corretamente");
});

module("HelperCookie", {
        setup: function() {
            ControlaAcesso.Cookies.escreverCookie("cookieTest", "543210");
            ControlaAcesso.Cookies.escreverCookie("outroCookie", "1234567890");
        },
        teardown: function() {
            ControlaAcesso.Cookies.removerCookie("cookieTest");
            ControlaAcesso.Cookies.removerCookie("outroCookie");
        }
    });
    
test("Quando criar os parâmetros do cookie", function() {
    var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(1);
    equal(
            ControlaAcesso.Cookies.criarParametros("um_cookie", "seu_valor", { expires: dataExpiracao, domain: ".dominio.com", path: "/"}),
            "um_cookie=seu_valor; expires=" + dataExpiracao.toUTCString() + "; domain=.dominio.com; path=/",
            "devem ser formatados os parâmetros do cookie"
        );
});

test("Comparar datas UTC com GMT", function() {
    var data = new Date();
    equal(data.toUTCString(), data.toGMTString(), "devem ser iguais");
});

test("Quando informar os dias para expiração", function() {
    // Criando datas com os parâmetros ano, mês, dia, hora, minuto, segundo, milisegundo
    expect(2);
    var umaData = new Date(2012, 6, 5, 20, 28, 5, 100);
    var doisDiasDepois = new Date(2012, 6, 7, 20, 28, 5, 100);
    strictEqual(ControlaAcesso.Cookies.calcularDataExpiracao(2, umaData).toUTCString(),
        doisDiasDepois.toUTCString(), "deve ser calculada a data de expiração");
    // Verificando se a data informada não foi modificada
    deepEqual(umaData, new Date(2012, 6, 5, 20, 28, 5, 100), "deve ser exatamente a mesma data");
});

test("Quando informar os dias para expiração sem data inicial", function() {
    var hoje = ControlaAcesso.Cookies.calcularDataExpiracao(0);
    var doisDiasDepois = ControlaAcesso.Cookies.calcularDataExpiracao(2);        
    strictEqual(doisDiasDepois - hoje,
        2 * 24 * 60 * 60  * 1000, "deve ser calculada a data de expiração");
});

test("Quando gravar um Cookie", function() {
    expect(2);
    ok(containsText(document.cookie, "cookieTest"), "deve ser armazenada a chave do cookie");
    ok(containsText(document.cookie, "543210"), "deve ser armazenado o valor do cookie");
});

test("Quando ler um Cookie pela sua chave", function() {
    equal(ControlaAcesso.Cookies.obterValorCookie("cookieTest"), "543210", "deve ser obtida o valor do mesmo");
});

test("Quando ler o valor de um Cookie inexistente", function() {
    equal(ControlaAcesso.Cookies.obterValorCookie("cookieTestNaoExistente"), "", "deve ser retornado string vazia");
});

test("Quando remover um Cookie", function() {
    ControlaAcesso.Cookies.removerCookie("cookieTest");
    ok(!containsText(document.cookie, "cookieTest"), "não deve existir o cookie no browser");
});

test("Quando remover um Cookie de outro path", function() {
	ControlaAcesso.Cookies.escreverCookie("outroPath", "543210", { path: "/testes/" });
    ControlaAcesso.Cookies.removerCookie("outroPath", { path: "/testes/" });
    ok(!containsText(document.cookie, "outroPath"), "não deve existir o cookie no browser");
});

test("Quando remover um cookie criado num subdomínio do atual", function() {
	ControlaAcesso.Cookies.escreverCookie("cookieSubdomio", "novo cookie", {
		domain: "." + document.domain
	});
	ControlaAcesso.Cookies.removerCookie("cookieSubdomio", {
		domain: "." + document.domain
	});
	ok(!containsText(document.cookie, "cookieSubdomio"), "não deve existir o cookie no browser");
});
    
test("Quando houver mais de um Cookie durante a escrita", function() {
    expect(2);        
    ok(containsText(document.cookie, "outroCookie"), "não devem afetados os nomes dos demais cookies");
    ok(containsText(document.cookie, "1234567890"), "não devem afetados os valores dos demais cookies");       
});

test("Quando for gravar um Cookie e este já existir", function() {
    ControlaAcesso.Cookies.escreverCookie("cookieTest", "novo_valor");
    ok(containsText(document.cookie, "novo_valor"), "deve ser atualizado o valor do cookie");
});

test("Quando o nome(chave) do cookie não for informada", function() {
    try {
        ControlaAcesso.Cookies.escreverCookie(" ", "umValor", { domain: document.domain, path: "/"});
    }
    catch(ex) {
        if(ex.message == "O nome do cookie deve ser informado") {
            ok(true, "deve ser lançada um exceção");
            return;
        }
    }
    ok(false, "deve ser lançada um exceção");
});

test("Quando o valor do cookie não for informado", function() {
    try {
        ControlaAcesso.Cookies.escreverCookie("umNome", " ", { expires: 1, domain: document.domain, path: "/"});
    }
    catch(ex) {
        if(ex.message == "O valor do cookie deve ser informado") {
            ok(true, "deve ser lançada um exceção");
            return;
        }
    }
    ok(false, "deve ser lançada um exceção");
});

