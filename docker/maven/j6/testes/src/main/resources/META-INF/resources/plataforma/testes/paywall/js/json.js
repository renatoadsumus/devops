var teste = new Date(2012, 5, 8, 10, 35, 9);
module("Number");

test("Quando formatar números com menos de dois dígitos", function() {
    expect(10);
    for (var i = 0; i < 10; i++) {
        equal(i._formatarDoisDigitos(), "0" + i, "deve se o numero formatado com dois digitos");
    }
});

test("Quando formatar números com dois dígitos", function() {
    expect(90);
    for(var i = 10; i < 100; i++) {
        equal(i._formatarDoisDigitos(), i, "deve se o numero formatado com dois digitos");
    }
});

test("Quando formatar números com um digito", function() {
    var numero = 1;
    equal(numero._formatarTresDigitos(), "001", "deve ser formatado com dois zeros à esquerda");
});

test("Quando formatar números com dois dígitos", function() {
    var numero = 12;
    equal(numero._formatarTresDigitos(), "012", "deve ser formatado com um zero à esquerda");
});

test("Quando formatar números com três dígitos", function() {
    var numero = 123;
    equal(numero._formatarTresDigitos(), "123", "deve ser formatado sem zeros à esquerda");
});

module("String");

test("Quando um string for convertida para JSON", function() {
    var umaString = "uma string";
    equal(ControlaAcesso.Utils.quote(umaString), '"uma string"', "deve ser convertido para o nome do atributo entre aspas");
});

module("JSON");

test("Quando uma string no formato JSON for parseada", function() {
    deepEqual($.parseJSON('{"letra":"A", "numero":1, "array":[1, 2]}'),
        { letra:"A", numero:1, array:[1, 2] }, "deve ser criado um objeto javascript");
});

test("Quando converter valores numéricos para JSON", function() {
    var numero = new Number(1);
    strictEqual(numero._converterParaJson(), "1", "deve ser um string contendo o valor numérico");
});

test("Quando converter valores booleanos verdadeiros para formato JSON", function() {
    var booleanoVerdadeiro = true;
    strictEqual(booleanoVerdadeiro._converterParaJson(), "true", "deve ser a string 'true'");
});

test("Quando converter valores booleanos verdadeiros para formato JSON", function() {
    var booleanoVerdadeiro = false;
    strictEqual(booleanoVerdadeiro._converterParaJson(), "false", "deve ser a string 'false'");
});

test("Quando converter a data atual para formato JSON", function() {
    var formatoData = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z/;
    var dataAtual = new Date();
    ok(formatoData.test(dataAtual._converterParaJson()), "deve ser convertida no formato yyyy-mm-ddThh:mm:ss.nnnZ");
});

test("Quando converter uma String para JSON", function() {
    var umaString = new String("uma string");
    strictEqual(umaString._converterParaJson(), '"uma string"', "deve ser um string entre aspas");
});

test("Quando converter um Array para JSON", function() {
    var umArray = new Array(1, "uma string");
    strictEqual(umArray._converterParaJson(), '[1,"uma string"]', "deve ser uma string entre entre colchetes, onde os itens são separados por vírgula e os primitivos também são convertidos");
});

test("Quando um objeto javascript complexo (contém objetos internos) for convertido para JSON", function() {
    var objeto = { booleano: true, letra:"A", numero:1, array:[1, "uma string"], objeto: { propriedade: 1 } };
    var json = ControlaAcesso.JSON.conveterParaJson(objeto);
    strictEqual(json, '{"booleano":true,"letra":"A","numero":1,"array":[1,"uma string"],"objeto":{"propriedade":1}}', "deve ser gerada um string JSON");
});

test("Quando converter um objeto para JSON e parseá-lo novamente para um objeto", function() {
    var objeto = { booleano: true, letra:"A", numero:1, array:[1, "uma string"], objeto: { propriedade: 1 } };
    var json = ControlaAcesso.JSON.conveterParaJson(objeto);
    deepEqual(
        $.parseJSON(json),
        { booleano: true, letra:"A", numero:1, array:[1, "uma string"], objeto: { propriedade: 1 } },
        "deve ser criado um objeto javascript"
    );
});

test("Quando o objeto contiver métodos", function() {
    var objeto = { prop1: 1, metodo: function() { } }
    equal(ControlaAcesso.JSON.conveterParaJson(objeto), '{"prop1":1}', "não deve ser serializados");
});

test("Quando um objeto javascript contiver outros objetos aninhados", function() {
    var objeto = { prop1: 1, prop2: { prop1_1: "1.1" } };
    var json = ControlaAcesso.JSON.conveterParaJson(objeto);
    equal(json, '{"prop1":1,"prop2":{"prop1_1":"1.1"}}', "deve ser gerado uma string JSON formatada corretamente");
});

test("Quando um array javascript contiver objetos", function() {
    var umArray = [1, {prop1:1}];
    var json = umArray._converterParaJson();
    equal(json, '[1,{"prop1":1}]', "deve ser gerado uma string JSON formatada corretamente");
});

test("Quando uma data no formato de JSON for parseada", function() {
    var umaData = new Date(2012, 5, 18, 16, 44, 55, 156);
    var dataFormatoJson = umaData._converterParaJson();
    var dataParseada = ControlaAcesso.JSON.parsearDataFormatoJson(dataFormatoJson);
    
    equal(umaData.getTime(), dataParseada.getTime(), "deve ser um objeto data do javascript");
});

test("Quando uma data no formato incorreto for parseada", function() {
    raises(function() { ControlaAcesso.JSON.parsearDataFormatoJson(""); }, "deve ser lançada uma exceção");
});

test("Quando converter o valor nulo para JSON", function() {
    var json = ControlaAcesso.JSON.conveterParaJson(null);
    equal(json, 'null', "deve ser gerada a string 'null'");
});

test("Quando um objeto contiver uma propriedade nula", function() {
    var json = ControlaAcesso.JSON.conveterParaJson({propNula:null});
    equal(json, '{"propNula":null}', "deve ser gerada a string 'null' para o valor da propriedade");
});

test("Quando um JSON contindo uma propriedade nula for parseado para um objeto javascript", function() {
    expect(2);
    var json = ControlaAcesso.JSON.conveterParaJson({propNula:null});
    var objeto = $.parseJSON(json);
    strictEqual(objeto.propNula, null, "deve ser gerado o valor null na propriedade");
    deepEqual(objeto, {propNula:null}, "deve ser gerado um objeto onde a propriedade tem valor null");
});
