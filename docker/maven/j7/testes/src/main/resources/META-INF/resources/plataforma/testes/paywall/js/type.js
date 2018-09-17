module("Type");

test("Quando verificar o tipo de um Número", function() {
    equal(typeof(1), "number", "deve ser 'number'");
});

test("Quando verificar o tipo de um valor booleano", function() {
    equal(typeof(true), "boolean", "deve ser 'number'");
});

test("Quando verificar o tipo de uma String", function() {
    equal(typeof("uma string"), "string", "deve ser 'string'");
});

test("Quando verificar o tipo de uma Data, um Array ou um Objeto", function() {
    var listaObjetos = [new Date(), {}, []];
    expect(3);
    for(var i = 0; i < listaObjetos.length; i++) {
        equal(typeof(listaObjetos[i]), "object", "deve ser 'object'");
    }
});

test("Quando verificar o tipo de uma Function", function() {
    equal(typeof(new Function()), "function", "deve ser 'function'");
});

test("Quando verificar o tipo de null", function() {
    equal(typeof(null), "object", "deve ser 'object'");
});

test("Quando verificar o tipo de undefined", function() {
    equal(typeof(undefined), "undefined", "deve ser 'undefined'");
});

test("Quando verificar o tipo de NaN", function() {
    equal(typeof(NaN), "number", "deve ser 'number'");
});

test("Quando verificar o tipo de Infinity", function() {
    equal(typeof(Infinity), "number", "deve ser 'number'");
});

test("Quando verificar se um tipo do objeto nativo Date", function() {
    equal(Object.prototype.toString.apply(new Date()), "[object Date]", "deve ser [object Date]");
});

test("Quando verificar se um tipo do objeto nativo Array", function() {
    equal(Object.prototype.toString.apply([]), "[object Array]", "deve ser [object Date]");
});

module("ObterTipoDe");

test("Quando verificar o tipo de um numero", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(1), "number", "deve ser 'number'");
});

test("Quando verificar o tipo de uma instância numero", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(new Number(1)), "number", "deve ser 'number'");
});

test("Quando verificar o tipo de um valor booleano", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(true), "boolean", "deve ser 'boolean'");
});

test("Quando verificar o tipo de uma string", function() {
    equal(ControlaAcesso.Utils.obterTipoDe("uma string"), "string", "deve ser 'string'");
});

test("Quando verificar o tipo de uma instância de String", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(new String("uma string")), "string", "deve ser 'string'");
});

test("Quando verificar o tipo de uma function", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(new Function()), "function", "deve ser 'function'");
});

test("Quando verificar o tipo de uma data", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(new Date()), "date", "deve ser 'date'");
});

test("Quando verificar o tipo de um array", function() {
    equal(ControlaAcesso.Utils.obterTipoDe([]), "array", "deve ser 'array'");
});

test("Quando verificar o tipo de uma instância de um array", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(new Array()), "array", "deve ser 'array'");
});

test("Quando verificar o tipo de um objeto", function() {
    equal(ControlaAcesso.Utils.obterTipoDe({}), "object", "deve ser 'object'");
});

test("Quando verificar o tipo de null", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(null), "null", "deve ser 'null'");
});

test("Quando verificar o tipo de undefined", function() {
    raises(function() { ControlaAcesso.Utils.obterTipoDe(undefined); }, "deve ser lançada uma exceção");
});

test("Quando a string for vazia", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(""), "string", "deve ser 'string'");
});

test("Quando for zero", function() {
    equal(ControlaAcesso.Utils.obterTipoDe(0), "number", "deve ser 'number'");
});
