module("ControlaAcesso.Cenarios.Status", {
	setup: function() {
		ControlaAcesso.Configuracao.json = CONFIG_GLOBAL;

		this.registrar = Teste.registrarAcessos;
		
		this.RegisterWall = Teste.Config.RegisterWall();
		
		this.Paywall = Teste.Config.Paywall();

		this.inexistente = resposta.falha.sap.inexistente();
		
		this.autorizado = resposta.sucesso.autorizado();
		
		Teste.ativarTodosEventos();
		
		Teste.limparCookie();
	},
	teardown: function() {
		ControlaAcesso.Configuracao.json = null;
		
		Teste.limparCookie();
		
		Teste.ativarTodosEventos();
		
		Teste.desativarContadorEmTodosEventos();
	}
});

test("Dado que o leitor esteja com o status 'AUTORIZADO'.", function() {
	
	var mockResposta = resposta.sucesso.autorizado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	equal(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie não é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'NAO_AUTENTICADO'.", function() {
	
	var mockResposta = resposta.falha.cadun.naoAutenticado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'NAO_AUTORIZADO'.", function() {
	
	var mockResposta = resposta.falha.cadun.naoAutorizado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'BLOQUEADO'.", function() {
	
	var mockResposta = resposta.falha.cadun.bloqueado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'CONFIRMACAO_NECESSARIA'.", function() {
	
	var mockResposta = resposta.falha.cadun.confirmacaoNecessaria();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'ACEITE_TERMO_USO'.", function() {
	
	var mockResposta = resposta.falha.cadun.aceiteTermoUso();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'PENDENTE_CONFIRMACAO'.", function() {
	
	var mockResposta = resposta.falha.cadun.pendenteConfirmacao();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});


test("Dado que o leitor esteja com o status 'TRIAL_EXPIRADO'.", function() {
	
	var mockResposta = resposta.falha.cadun.trialExpirado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'ACESSO_FORA_DO_PERIODO'.", function() {
	
	var mockResposta = resposta.falha.sap.acessoForaDoPeriodo();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'ENCERRADO'.", function() {
	
	var mockResposta = resposta.falha.sap.encerrado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'INDISPONIVEL'.", function() {
	
	var mockResposta = resposta.falha.sap.indisponivel();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	ok(ControlaAcesso.Erro.existe(), "Então - Visualizamos o cookie de serviço com erro criado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'AUTORIZADO_COM_RESSALVA'.", function() {
	
	var mockResposta = resposta.sucesso.comRessalva();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	notEqual(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie não é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "assinante com digital", "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante com digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'UPGRADE'.", function() {
	
	var mockResposta = resposta.falha.sap.upgrade();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal("assinante sem digital", ControlaAcesso.Leitor.tipoDeCadastro(), "Então - Visualizamos que o tipo de cadastro do leitor é 'assinante sem digital'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'INEXISTENTE'.", function() {
	
	var mockResposta = resposta.falha.sap.inexistente();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
		};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();

	ok(teste.Paywall.redirecionado, "Então - O leitor é redirecionado.");
	ok(!teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem não foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(!teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar não é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'CANCELADO'.", function() {
	
	var mockResposta = resposta.falha.sap.cancelado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie esta preenchida.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie esta preenchida.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

test("Dado que o leitor esteja com o status 'PN_DUPLICADO'.", function() {
	
	var mockResposta = resposta.falha.sap.pnDuplicado();
	
	var mock = {
			leitorSeConverteu : {
				RegisterWall : true
			},
			logadoNaGloboCom : {
				Paywall : true,
				RegisterWall : false
			},
			respostas : {
				Paywall : mockResposta
			}
	};
	
	var teste = this.registrar(this.Paywall.limiteDeAcesso + 1, mock);
	
	var registro = ControlaAcesso.Model.carregar();
	
	ok(!teste.Paywall.redirecionado, "Então - O leitor não é redirecionado.");
	ok(teste.Paywall.temMensagem, "Então - Verifico que a função de enviar mensagem foi executado.");
	
	notEqual(registro.eventos.Paywall.dtExec, null, "Então - Visualizamos que a data de execução do Paywall no cookie não é nula.");
	equal(registro.eventos.Paywall.dtConv, null, "Então - Visualizamos que a data de conversão do Paywall no cookie é nula.");
	
	ok(teste.Paywall.executouAoCompletar, "Então - Verifico que a função que é executada ao completar é chamada.");
	
	equal(ControlaAcesso.Leitor.tipoDeCadastro(), "cadastrado", "Então - Visualizamos que o tipo de cadastro do leitor é 'cadastrado'.");
	
	equal(registro.eventos.Paywall.motivo, mockResposta.motivo, "Então - Visualizamos que o motivo foi preenchido com o texto: " + mockResposta.motivo);
});

