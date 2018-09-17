module("deteccao.dispositivo", {
	setup: function() {
		
	},
	teardown: function() {
		
	}
});

test("Dado que eu quero identificar o dispositivo.", function() {
	
	var dispositivo = deteccao.dispositivo.recuperar();
	
	ok(dispositivo, "O dispositivo foi indentificado");
});


test("Dado que eu quero identificar o dispositivo.", function() {
	
	var dispositivo = deteccao.dispositivo.recuperar();
	
	ok(dispositivo, "O dispositivo foi indentificado");
});