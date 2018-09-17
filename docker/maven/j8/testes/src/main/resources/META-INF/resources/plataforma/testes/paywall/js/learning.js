Number.prototype._formatarDoisDigitos = function() {
    return this.valueOf() < 10 ? '0' + this.valueOf() : this.valueOf();
}

module("Number");

test("Quando verificar se um valor é numérico", function() {
    equal(isFinite(0), true, "deve ser verdadeiro se for zero");
    for (var i = -1; i < 2; i++) {
        equal(isFinite(i), true, "deve ser verdadeiro se for um número inteiro");
    }
    equal(isFinite("a"), false, "deve ser falso se o valor for uma string");
});

module("String");

test("Quando realizar o split de um string vazia sem informar separador", function() {
    deepEqual("".split(""), [], "deve retornar um array vazio");
});

test("Quando realizar o split de um string informando caracter de separação", function() {
    deepEqual("a".split(";"), ["a"], "deve retornar um array contendo somente a string");
});

test("Quando realizar o split de um string separada por um caracter", function() {
    deepEqual("a;b".split(";"), ["a", "b"], "deve retornar um array contendo somente a string");
});

module("Array");

test("Juntar array vazio, sem informar o separador em uma string", function() {
    strictEqual([].join(""), "", "deve ser um string vazia");
});

test("Juntar array, sem informar separador", function() {
    strictEqual(["a", "b"].join(""), "ab", "deve retornar a concatenção dos itens");
});

test("Juntar array, informando separador", function() {
    strictEqual(["a", "b"].join(","), "a,b", "deve retornar a concatenção dos itens");
});
