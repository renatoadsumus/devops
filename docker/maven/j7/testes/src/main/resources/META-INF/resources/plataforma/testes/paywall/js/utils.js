module("ControlaAcesso.Utils.trim");

test("Quando uma string com espaços no início for informada", function() {
    equal(ControlaAcesso.Utils.trim("  espaços antes"), "espaços antes", "deve se retornada uma string sem espaços no início");
});

test("Quando uma string com espaços no fim for informada", function() {
    equal(ControlaAcesso.Utils.trim("espaços depois  "), "espaços depois", "deve se retornada uma string sem espaços no fim");
});

test("Quando uma string com espaços no início e no fim for informada", function() {
    equal(ControlaAcesso.Utils.trim("   espaços no início e no fim  "), "espaços no início e no fim", "deve se retornada uma string sem espaços no início e no fim");
});

test("Quando uma string somente com espaços for informada", function() {
    equal(ControlaAcesso.Utils.trim("   "), "", "deve se retornada uma string vazia");
});

test("Quando uma string vazia for informada", function() {
    equal(ControlaAcesso.Utils.trim(""), "", "deve se retornada uma string vazia");
});


module("ControlaAcesso.Utils.url", {
    setup: function() {
    	this.core = new ControlaAcesso.Core();
    }
});

test("Quando uma URL completa for informada", function() {
    var listasUrls = [
            { url: "http://www.globo.com", dominio: "www.globo.com" },
            { url: "http://www.globo.com/", dominio: "www.globo.com" },
            { url: "http://www.globo.com/pais", dominio: "www.globo.com" },
            { url: "http://www.globo.com/pais/", dominio: "www.globo.com" },
            { url: "http://www.globo.com/default.asp", dominio: "www.globo.com" },
            { url: "http://www.globo.com/default.asp?url=/pais", dominio: "www.globo.com" },
            { url: "http://www.globo.com/pais/default.asp", dominio: "www.globo.com" },
            { url: "https://www.globo.com", dominio: "www.globo.com" },
            { url: "httpss://www.globo.com/", dominio: "www.globo.com" },
            { url: "http://www.facebook.com", dominio: "www.facebook.com" },
            { url: "http://twitter.com", dominio: "twitter.com" },
            { url: "http://www.google.com", dominio: "www.google.com" },
            { url: "http://www.google.com.br", dominio: "www.google.com.br" },
            { url: "http://plus.google.com", dominio: "plus.google.com" }
        ]
    for(var i = 0; i < listasUrls.length; i++) {
        equal(ControlaAcesso.Utils.extrairDominio(listasUrls[i].url),
            listasUrls[i].dominio, "deve ser informado somente o domínio '" + listasUrls[i].dominio + "'");
    }
});

test("Quando uma URL INcompleta for informada", function() {
    equal(ControlaAcesso.Utils.extrairDominio("plus.google.com"), "", "deve ser retornada uma string vazia ''");
});

test("Quando uma URL vazia for informada", function() {
    equal(ControlaAcesso.Utils.extrairDominio(""), "", "deve ser retornada uma string vazia ''");
});

test("Quando uma URL invalida for informada", function() {
	equal(ControlaAcesso.Utils.extrairDominio("-"), "", "deve ser retornada uma string vazia ''");
});

test("Quando uma URL contendo um parâmetro for informada", function() {
    strictEqual(
        "1",
        ControlaAcesso.Utils.extrairValorQuerystring("parametro", "http://www.urlcontendoparametro.com.br?parametro=1"),
        "deve ser extraido o valor da chave parametro '1'"
    );
});

test("Quando uma URL contendo dois parâmetros for informada", function() {
    expect(2);
    strictEqual(
        "um",
        ControlaAcesso.Utils.extrairValorQuerystring("parametro1", "http://www.urlcontendoparametro.com.br?parametro1=um&parametro2=dois"),
        "deve ser extraido o valor da chave parametro 'um'"
    );
    strictEqual(
        "dois",
        ControlaAcesso.Utils.extrairValorQuerystring("parametro2", "http://www.urlcontendoparametro.com.br?parametro1=um&parametro2=dois"),
        "deve ser extraido o valor da chave parametro 'dois'"
    );
});

test("Quando uma URL sem parâmetros for informada e for realizada a tentativa de leitura de um parâmetro qualquer", function() {
    strictEqual(
        "",
        ControlaAcesso.Utils.extrairValorQuerystring("parametro1", "http://www.urlcontendoparametro.com.br"),
        "deve ser extraido o valor '' (string vazia)"
    );
});
//
//test("Quando o registro for desligado e já houver registros", function() {
//    var controle;
//    
//    controle = this.core.registrar("31416", { numAcessosParaBloqueio: 1, ligado: true })
//    equal(this.core.itens.length, 1, "deve haver um registro")
//    ok(!controle.houveBloqueio(), "não deve ser bloqueado o primeiro acesso");
//    
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1, ligado: true })
//    equal(this.core.itens.length, 1, "deve continuar havendo um registro")
//    ok(controle.houveBloqueio(), "deve ser bloqueado o segundo acesso");
//    
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1, ligado: false })
//    equal(this.core.itens.length, 1, "deve continuar havendo um registro quando o registro for desligado")
//    ok(controle.houveBloqueio(), "deve ser conitnuar sendo bloqueado o acesso");
//});
//
//test("Quando o usuário estiver logado", function() {
//    var controle;
//    
//    this.core.registrar("31416", { numAcessosParaBloqueio: 1 });
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1 });
//    
//    controle.onValidarLogin = function() { return true; };
//    
//    ok(!controle.houveBloqueio(), "não deve ser bloqueado acesso");
//});
//
//test("Quando o usuário não estiver logado", function() {
//    var controle;
//    
//    this.core.registrar("31416", { numAcessosParaBloqueio: 1 });
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1 });
//    
//    controle.onValidarLogin = function() { return true; };
//    
//    ok(!controle.houveBloqueio(), "não deve ser bloqueado acesso");
//});
//
//test("Quando o usuário estiver logado e não for informada função de validação de login", function() {
//    var controle;
//    
//    this.core.registrar("31416", { numAcessosParaBloqueio: 1 });
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1 });
//    
//    controle.onValidarLogin = null;
//    
//    ok(controle.houveBloqueio(), "deve ser bloqueado acesso");
//});
//
//test("Quando houver um bloqueio e houver método de tratamento", function() {
//    var controle;
//    var metodoExecutado = 0;
//    
//    this.core.registrar("31416", { numAcessosParaBloqueio: 1 });
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1 });
//    
//    controle.onBloqueioAcesso = function() { metodoExecutado++; };
//    
//    controle.validarAcesso();
//    
//    equal(metodoExecutado, 1, "deve ser acionada o método de tratamento");
//});
//
//test("Quando houver um bloqueio e não houver método de tratamento", function() {
//    var controle;
//    var metodoExecutado = 0;
//    
//    this.core.registrar("31416", { numAcessosParaBloqueio: 1 });
//    controle = this.core.registrar("31417", { numAcessosParaBloqueio: 1 });
//    
//    controle.onBloqueioAcesso = null;
//    
//    controle.validarAcesso();
//    
//    equal(metodoExecutado, 0, "não deve ser acionada o método de tratamento");
//});
