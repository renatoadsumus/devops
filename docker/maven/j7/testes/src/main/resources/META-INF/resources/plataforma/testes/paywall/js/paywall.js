module("PayWall", {
    setup: function() {
        this.registerWall = new ControlaAcesso.Core.GerenciaAcesso();
        Teste.limparCookie();
    },
    teardown: function() {
    	Teste.limparCookie();
    }
});

test("Quando inicar registrador de acesso", function() {
    equal(this.registerWall.itens.length, 0, "não deve haver nenhum acesso no início");
});

test("Quando registrar o primeiro acesso", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    expect(2);
    equal(this.registerWall.itens.length, 1, "deve ser registrado um acesso");
    equal(this.registerWall.itens[0], "31416", "deve haver a identificação do conteudo no acesso");
});

test("Quando houver mais de um acesso ao mesmo conteúdo", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    equal(this.registerWall.itens.length, 1, "deve ser registrado um acesso");
});

test("Quando houver limite de acessos", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 2 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 2 });
    this.registerWall.registrar("31418", { numAcessosParaBloqueio: 2 });
    equal(this.registerWall.itens.length, 2, "devem ser registrados acessos até o limite");
});

test("Quando houver mais de um contexto de chaves", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0, contexto: "P" });
    expect(3);
    equal(this.registerWall.itens.length, 2, "devem ser registrados os conteúdos de todos contextos, independentemente da chave");
    equal(this.registerWall.itens[0], "31416", "não deve haver contexto associado quando não fornecido");
    equal(this.registerWall.itens[1], "31416P", "deve haver contexto associado quando fornecido");        
});

test("Quando houver redução no limite de acessos após um acesso ter sido realizado anteriormente", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 3 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    equal(this.registerWall.itens.length, 1, "deve ser respeitado o limite de acessos configurado");
});

test("Quando houver aumento no limite de acessos após um acesso ter sido realizado anteriormente", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 2 });
    equal(this.registerWall.itens.length, 2, "deve ser respeitado o limite de acessos configurado");
});

test("Quando houver redução no limite de acessos no terceiro acesso a um conteudo", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 3 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 3 });
    this.registerWall.registrar("31418", { numAcessosParaBloqueio: 1 });
    equal(this.registerWall.itens.length, 2, "deve ser respeitado o limite de acessos configurado");
});

test("Quando o limite de acessos for configurado com zero", function() {
    var controle;
    expect(2);
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 0 });
    this.registerWall.registrar("31418", { numAcessosParaBloqueio: 0 });
    this.registerWall.registrar("31419", { numAcessosParaBloqueio: 0 });
    controle = this.registerWall.registrar("31410", { numAcessosParaBloqueio: 0 });
    equal(this.registerWall.itens.length, 5, "não devem ser limitados os registros dos acessos");
    equal(controle.houveBloqueio(), false, "não deve ter ocorrido bloqueio");
});

test("Quando ocorrer o primeiro acesso", function() {
    var dataAtual;
    var delta;
    
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    // Considera uma margem de erro de 100 milisegundos
    dataAtual = new Date();
    delta = dataAtual.getTime() - this.registerWall.dtini.getTime();
    ok(Math.abs(delta) <= 100, "deve ser armazenada a data e hora");
});

test("Quando ocorrerem dois acessos", function() {    
        var dataAtual;
        var dataPrimeiroAcesso;
        var dataSegundoAcesso;
        var delta;
 
        // Realizando o primeiro registro
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
     dataPrimeiroAcesso = this.registerWall.dtini;
    // Considera uma margem de erro de 100 milisegundos
    dataAtual = new Date();
    delta = dataAtual.getTime() - dataPrimeiroAcesso.getTime();
    ok(Math.abs(delta) <= 100, "deve ser armazenada a data e hora no primeiro acesso");
    
    // Realizando o segundo registro
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 0 });
    dataSegundoAcesso = this.registerWall.dtini;
    // Considera uma margem de erro de 10 milisegundos
    delta = dataSegundoAcesso.getTime() - dataPrimeiroAcesso.getTime();
    ok(Math.abs(delta) <= 10, "deve ser mantida a data e hora do primeiro acesso");
});

test("Quando o limite de acessos for configurado como um", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });        
    ok(!controle.houveBloqueio(), "não deve ser gerado um bloqueio para o primeiro acesso");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    ok(controle.houveBloqueio(), "deve ser gerado um bloqueio para o segundo acesso");
});

test("Quando o bloqueio estiver desligado", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, bloqueioLigado: false });        
    ok(!controle.houveBloqueio(), "não deve ser gerado um bloqueio para o primeiro acesso");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, bloqueioLigado: false });
    ok(!controle.houveBloqueio(), "não deve ser gerado um bloqueio para os demais acessos");
});

test("Quando houver acesso a um mesmo conteúdo", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio no primeiro acesso");
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio nos demais acessos");
});

test("Quando forem configuradas URLs liberadas para os acessos e o limite for atingido", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "http://www.twitter.com" });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio para nenhum conteúdo");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "http://www.twitter.com" });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio para nenhum conteúdo");
});

test("Quando houver acessos de URLs não liberadas e o limite for atingido", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "http://www.twitter.com" });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio para o conteudo para as URLs liberadas");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.facebook.com", urlsLivreAcesso: "http://www.twitter.com" });
    ok(controle.houveBloqueio(), "deve ser gerado bloqueio para as URLs não liberadas");
});

test("Quando houver acessos de URLs liberadas e somente o domínio for informado como liberado", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "www.twitter.com" });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio para o conteudo para as URLs liberadas");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "www.twitter.com" });
    ok(!controle.houveBloqueio(), "não deve ser gerado bloqueio para o conteudo para as URLs liberadas");
});

test("Quando houver uma URL liberada realizar um acesso", function() {
    this.registerWall.registrar("31416");
    equal(this.registerWall.itens.length, 1,"deve ser registrado mesmo assim");
});

test("Quando houver uma URL liberada realizar um acesso e o limite for atingido", function() {
    var configuracao = { numAcessosParaBloqueio: 2, urlReferenciadora: "http://www.twitter.com", urlsLivreAcesso: "www.twitter.com" };
    var controle;
    
    expect(2);
    
    this.registerWall.registrar("31416", configuracao);
    this.registerWall.registrar("31417", configuracao);
    controle = this.registerWall.registrar("31418", configuracao);
    
    equal(this.registerWall.itens.length, 2, "devem ser limitados os registros");
    ok(!controle.houveBloqueio(), "não deve haver bloqueio");
});

test("Quando acessar de URLs liberadas distintas", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://twitter.com", urlsLivreAcesso: "twitter.com, www.facebook.com" });
    ok(!controle.houveBloqueio(), "não deve haver bloqueio");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.facebook.com", urlsLivreAcesso: "twitter.com, www.facebook.com" });
    ok(!controle.houveBloqueio(), "não deve haver bloqueio");
});

test("Quando acessar de URLs não liberadas", function() {
    var controle;
    
    expect(2);
    
    controle = this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.w3schools.com", urlsLivreAcesso: "twitter.com, www.facebook.com" });
    ok(!controle.houveBloqueio(), "não deve haver bloqueio");
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, urlReferenciadora: "http://www.w3schools.com", urlsLivreAcesso: "twitter.com, www.facebook.com" });
    ok(controle.houveBloqueio(), "deve haver bloqueio");
});

test("Quando registrar um acesso", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0 });
    var expressaoCookie = /^\{"itens":\["31416"\],"dtini":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z","dtwal":null,"dtcnv":null\}$/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "deve ser registrado um acesso no cookie");
});

test("Quando registrar dois acessos", function() {
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 0, diasParaReset: 1 });
    this.registerWall.registrar("31417", { numAcessosParaBloqueio: 0, diasParaReset: 1 });
    var expressaoCookie = /^\{"itens":\["31416","31417"\],"dtini":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z","dtwal":null,"dtcnv":null\}$/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "devem ser registrados dois acessos no cookie");
});

test("Quando o objeto de configuração ou alguma configuração não forem informados", function() {
    var objetosConfiguracao = [{ }, null];
    
    for(var i = 0; i < objetosConfiguracao.length; i++) {
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "ligado"),
            true,
            "deve ser informado o valor padrão true"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "bloqueioLigado"),
            true,
            "deve ser informado o valor padrão true"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "numAcessosParaBloqueio"),
            0,
            "deve ser informado o valor padrão zero"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "contexto"),
            "",
            "deve ser informado um valor padrão '' (string vazia)"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "urlReferenciadora"),
            document.referrer,
            "deve ser informado um valor padrão '' (a url referenciadora)"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "urlsLivreAcesso"),
            "",
            "deve ser informado um valor padrão '' (string vazia)"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "diasParaReset"),
            30,
            "deve ser informado um valor padrão 30"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "cookieDomain"),
            "." + document.domain,
            "deve ser informado um valor padrão como o domínio atual"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "cookiePath"),
            "/",
            "deve ser informada a string '/'"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "userAgentsLivreAcesso"),
            "",
            "deve ser informado um valor padrão '' (string vazia)"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "userAgent"),
            navigator.userAgent,
            "deve ser informado um valor padrão como sendo o user agente atual"
        );
        strictEqual(
            ControlaAcesso.Core.lerConfiguracao(objetosConfiguracao[i], "url"),
            location.href,
            "deve ser informado um valor padrão como sendo a url atual"
        );
    }
});

test("Quando alguma configuração for informada", function() {
    var delegate = function() { };
    var configuracao = {
                ligado: false,
                bloqueioLigado: false,
                numAcessosParaBloqueio: 1,
                contexto: "P",
                urlReferenciadora: "http://www.oglobo.com.br/default.asp",
                urlsLivreAcesso: "http://www.twitter.com.br",
                diasParaReset: 5,
                cookieDomain: ".oglobo.globo.com",
                cookiePath: "/pais/",
                userAgentsLivreAcesso: "(ia_archiver)",
                userAgent: "User Agente Teste",
                url: "http://www.umaurl.com.br"
            };
            
    strictEqual(
            ControlaAcesso.Core.lerConfiguracao(configuracao, "ligado"),
            false,
            "deve ser lido false"
        );            
    strictEqual(
            ControlaAcesso.Core.lerConfiguracao(configuracao, "bloqueioLigado"),
            false,
            "deve ser lido false"
        );                
    strictEqual(
            ControlaAcesso.Core.lerConfiguracao(configuracao, "numAcessosParaBloqueio"),
            1,
            "deve ser lido o valor 1"
        );
    strictEqual(
            ControlaAcesso.Core.lerConfiguracao(configuracao, "contexto"),
            "P",
            "deve ser lido o valor 'P'"
        );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "urlReferenciadora"),
        "http://www.oglobo.com.br/default.asp",
        "deve ser lido 'http://www.oglobo.com.br/default.asp'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "urlsLivreAcesso"),
        "http://www.twitter.com.br",
        "deve ser lido 'http://www.twitter.com.br'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "diasParaReset"),
        5,
        "deve ser lido 5"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "cookieDomain"),
        ".oglobo.globo.com",
        "deve ser lido '.oglobo.globo.com'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "cookiePath"),
        "/pais/",
        "deve ser lido '/pais/'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "userAgentsLivreAcesso"),
        "(ia_archiver)",
        "deve ser lido '(ia_archiver)'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "userAgent"),
        "User Agente Teste",
        "deve ser lido 'User Agente Teste'"
    );
    strictEqual(
        ControlaAcesso.Core.lerConfiguracao(configuracao, "url"),
        "http://www.umaurl.com.br",
        "deve ser lido 'http://www.umaurl.com.br'"
        );
    });
   
    test("Quando não houver valor padrão para uma chave de configuração informada", function() {
    var configuracao = { };
    raises(function() { ControlaAcesso.Core.lerConfiguracao(configuracao, "xpto"); }, "deve ser lançada uma exceção");
});

test("Quando resetar o registrador", function() {
    expect(2);
    this.registerWall.reset();
    deepEqual(this.registerWall.itens, [], "devem ser limpo os itens do acesso");
    equal(this.registerWall.dtini, null, "devem ser limpa a data do primeiro acesso");
});

test("Quando já existir um acesso no cookie, o limite de acessos for 1 e um novo acesso for realizado", function() {
    var controle;
    
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    
    //resetando o registro
    this.registerWall.reset();
    
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    
    ok(controle.houveBloqueio(), "deve haver um bloqueio");
});

/* Regras das métricas para o Analytics */
/*
Se o cookie não existe
...... preencher com '00' 
senão se data de conversão existe
...... preencher com 'Conv'
senão se data de exibição do wall existe
...... preencher com 'Wall' 
senão se não deu erro na leitura do cookie
...... preencher com '99', sendo 99 o número de matérias registradas, com zeros a esquerda (ex.: '07')
senão 
...... preencher com 'erro'
*/

test("Quando não houver registros anteriores e for solicitada as métricas", function() {
    strictEqual(this.registerWall.obterMetricas(), "00", "deve ser obtido zero acessos realizados até o momento");
});

test("Quando já houver registros anteriores e for solicitada as métricas", function() {
    this.registerWall.registrar("31416");
    strictEqual(this.registerWall.obterMetricas(), "01", "deve ser obtida a quantidade de acessos realizados até o momento");
});

test("Quando o wall for exibido", function() {
    var controle;
    
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    strictEqual(this.registerWall.obterMetricas(), "Wall", "deve ser obtida a string 'Wall'");
});

test("Quando o usuário se logar pela tela de Wall (conversão)", function() {
    var controle;
    
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    
    // Considerando que o usuário não está logado
    controle.onBloqueioAcesso = function() { };
    controle.onValidarLogin = function() { return false; };
    controle.validarAcesso();
    
    // Simulando o login do usuário...
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, url: "http://www.oglobo.com?gerarConversao=true" });
    
    controle.onValidarLogin = function() { return true; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    strictEqual(this.registerWall.obterMetricas(), "Conv", "deve ser obtida a string 'Conv'");
});

test("Quando obter métricas utilizando o Wraper", function() {
    gerarRegistroAcesso("31416");
    equal(ControlaAcesso.GA.obterQuantidadeDeAcessos(), "01", "deve ser registrado um acesso");
});

test("Quando registrar utilizando o Wraper", function() {
    var gerador = gerarRegistroAcesso("31416");
    equal(gerador.itens.length, 1,"deve ser registrado um acesso");
});

test("Quando realizar uma copia do objeto de registro", function() {
    var copiaRegistro;
    var registroOriginal = new ControlaAcesso.Core.GerenciaAcesso();
    
    registroOriginal.itens = ["1", "2"];
    registroOriginal.dtini = new Date();
    registroOriginal.dtini.setMinutes(1);
    
    registroOriginal.dtwal = new Date();
    registroOriginal.dtwal.setMinutes(2);
    
    registroOriginal.dtcnv = new Date();
    registroOriginal.dtcnv.setMinutes(3);

    copiaRegistro = registroOriginal.obterCopia();
    
    deepEqual(copiaRegistro, registroOriginal, "deve ser exatamente igual");
});

test("Quando realizar uma copia do objeto de registro e alterar o original", function() {
    var copiaRegistro;
    var registroOriginal = new ControlaAcesso.Core.GerenciaAcesso();
    
    registroOriginal.itens = ["1", "2"];
    registroOriginal.dtini = new Date();
    registroOriginal.dtini.setMinutes(1);
    
    registroOriginal.dtwal = new Date();
    registroOriginal.dtwal.setMinutes(2);
    
    registroOriginal.dtcnv = new Date();
    registroOriginal.dtcnv.setMinutes(3);

    copiaRegistro = registroOriginal.obterCopia();
    
    deepEqual(copiaRegistro, registroOriginal, "deve ser exatamente igual");
    
    // Alterando a cópia
    copiaRegistro.itens = ["1"];
    copiaRegistro.dtini.setMinutes(4);
    copiaRegistro.dtwal.setMinutes(5);
    copiaRegistro.dtcnv.setMinutes(6);
    
    deepEqual(registroOriginal.itens, ["1", "2"], "deve ser mantido os itens do original");
    equal(registroOriginal.dtini.getMinutes(), 1, "deve ser mantido os minutos da data do primeiro registro");
    equal(registroOriginal.dtwal.getMinutes(), 2, "deve ser mantido os minutos da data de exibição do wall");
    equal(registroOriginal.dtcnv.getMinutes(), 3, "deve ser mantido os minutos da data de conversão");
});

test("Quando realizar o fluxo de login e uma cópia do registro for realizada", function() {
    var copiaRegistro;
    var controle;
    
    // Executando os registros
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
   
    // Executando o Controle de Acesso
    // Considerando o usuário deslogado
    controle.onValidarLogin = function() { return false; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    // Simulando o login do usuário...
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, url: "http://www.oglobo.com?gerarConversao=true" });
    
    controle.onValidarLogin = function() { return true; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    
    copiaRegistro = this.registerWall.obterCopia();
    
    deepEqual(copiaRegistro, this.registerWall, "deve ser exatamente igual");
});

test("Quando for realizada uma cópia do registro", function() {
    var copiaRegistro;
    
    this.registerWall.registrar("31416");
    
    equal(this.registerWall.itens[0], "31416", "deve conter o registro");
    copiaRegistro = this.registerWall.obterCopia();
    
    deepEqual(copiaRegistro, this.registerWall, "deve ser exatamente igual");
    
    this.registerWall.registrar("31417");        
    equal(copiaRegistro.itens[0], "31416", "deve conter o registro");
    equal(copiaRegistro.itens.length, 1, "deve conter o registro");
});

test("Quando for realizada uma alteração na cópia do registro", function() {
    var copiaRegistro;
    
    this.registerWall.registrar("31416");
    copiaRegistro = this.registerWall.obterCopia();
    
    copiaRegistro.itens[0] = "XXX";
    copiaRegistro.dtini = null;
    
    deepEqual(copiaRegistro.itens, ["XXX"], "deve estar vazio");
    strictEqual(copiaRegistro.dtini, null, "deve ser nulo");        
    
    equal(this.registerWall.itens.length, 1, "não deve haver alteração no objeto original");
    equal(this.registerWall.itens[0], "31416", "não deve haver alteração no objeto original");
    ok(this.registerWall.dtini !== null, "não deve haver alteração no objeto original");
});

test("Quando for registrar a data do wall e não houver bloqueio", function() {
    var controle = this.registerWall.registrar("31416");

    ok(!controle.houveBloqueio(), "não deve haver bloqueio");
    strictEqual(this.registerWall.dtwal, null, "deve ser nula a data de bloqueio");
    
    // Verificando o valor no cookie
    var expressaoCookie = /"dtwal":null/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "deve ser registrada a data do wall como nula");
});

test("Quando for registrar a data do wall e houver um bloqueio", function() {
    var dataAtual;
    var controle;
    var delta;
    
    expect(3);
    
    // Executando os registros
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    ok(controle.houveBloqueio(), "deve haver um bloqueio");
    
    // Executando o Controle de Acesso
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    // Atualiza o registro
    this.registerWall.load();
    
    // Verificando a data
    dataAtual = new Date();
    delta = this.registerWall.dtwal.getTime() - dataAtual.getTime();        
    // Considera uma margem de erro de 10 milisegundos
    ok(Math.abs(delta) <= 10, "deve ser atualizada a data de exibição do Wall");
    
    // Verificando o valor no cookie
    var expressaoCookie = /"dtwal":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z"/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "deve ser registrada a data do wall no cookie");
});

test("Quando houver um bloqueio e o usuário se logar", function() {
    var dataAtual;
    var controle;
    var delta;
    
    expect(3);
    
    // Executando os registros
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    ok(controle.houveBloqueio(), "deve haver um bloqueio");
    
    // Executando o Controle de Acesso
    // Considerando o usuário deslogado
    controle.onValidarLogin = function() { return false; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    // Simulando o login do usuário...
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, url: "http://www.oglobo.com?gerarConversao=true" });
    
    controle.onValidarLogin = function() { return true; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();

    // Verificando a data de conversão
    dataAtual = new Date();
    delta = this.registerWall.dtcnv.getTime() - dataAtual.getTime();        
    // Considera uma margem de erro de 10 milisegundos
    ok(Math.abs(delta) <= 10, "deve ser atualizada a data de exibição do Wall");
    
    // Verificando o valor no cookie
    var expressaoCookie = /"dtcnv":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z"/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "deve ser registrada a data de conversão no cookie");
});

test("Quando o usuário se logar por fora da tela de wall", function() {
    var controle;
    
    // Executando os registros
    this.registerWall.registrar("31416", { numAcessosParaBloqueio: 1 });
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1 });
    
    // Executando o Controle de Acesso
    // Considerando o usuário deslogado
    controle.onValidarLogin = function() { return false; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();
    
    // Simulando o login do usuário por fora da tela de wall...
    controle = this.registerWall.registrar("31417", { numAcessosParaBloqueio: 1, url: "http://www.oglobo.com" });
    
    controle.onValidarLogin = function() { return true; };
    controle.onBloqueioAcesso = function() { };
    controle.validarAcesso();

    // Verificando o valor no cookie
    var expressaoCookie = /"dtcnv":null/;
    var valorCookie = ControlaAcesso.Cookies.obterValorCookie("infgw");
    ok(expressaoCookie.test(valorCookie), "deve ser registrada a data de conversão como nula");
});

