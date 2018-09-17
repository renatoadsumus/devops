var Teste;
var limite_maximo_acesso = CONFIG_GLOBAL.limiteMaximoAcesso;

Teste = {};

Teste.obterConfiguracaoDeEventoPorNome = function(nomeDoEvento) {

	var eventos = CONFIG_GLOBAL.eventos;

	for ( var i = 0; i < eventos.length; i++) {
		var evento = eventos[i];

		if (evento.nomeDoEvento == nomeDoEvento) {

			return evento;
		}
	}

	throw new Error("Nome do evento não foi encontrado nas configurações.");
};

Teste.Config = {}

Teste.Config.RegisterWall = function() {

	return Teste.obterConfiguracaoDeEventoPorNome("RegisterWall");
}

Teste.Config.Paywall = function() {

	return Teste.obterConfiguracaoDeEventoPorNome("Paywall");
}

Teste.ativarSomenteOEvento = function(evento) {
	
	if (evento.nomeDoEvento == "RegisterWall") {
		CONFIG_GLOBAL = configRegisterWall;
		ControlaAcesso.Configuracao.json = configRegisterWall;
	} else if (evento.nomeDoEvento == "Paywall") {
		CONFIG_GLOBAL = configPaywall;
		ControlaAcesso.Configuracao.json = configPaywall;
	} else {
		throw "Evento não existe";
	}
};

Teste.ativarTodosEventos = function() {
	CONFIG_GLOBAL = configTodosEventos;	
	ControlaAcesso.Configuracao.json = configTodosEventos;	
};

Teste.ativarContadorNoEvento = function(evento) {
	
	evento.somenteContadorAtivado = true;
	
	//Força a configuração global pegar o limite máximo do evento.
	CONFIG_GLOBAL.limiteMaximoAcesso = evento.limiteDeAcesso;
	
};

Teste.desativarContadorEmTodosEventos = function() {
	
	//Restaurando o limite máximo de acesso.
	CONFIG_GLOBAL.limiteMaximoAcesso = limite_maximo_acesso;

	var eventos = CONFIG_GLOBAL.eventos;

	for ( var i = 0; i < eventos.length; i++) {
		eventos[i].somenteContadorAtivado = false;
	}
};

Teste.Origin = {
	validarAutorizacao : ControlaAcesso.AutorizaAcesso.prototype.validarAutorizacao
};

var URL_DO_BARRAMENTO = "http://site.globo.com/?url_retorno=";

var resposta = {};

/**
 * Classe que representa as respostas do barramento.
 */
resposta.Barramento = function(kwargs) {
		
	var motivo = kwargs.motivo ? kwargs.motivo : "";
	var autorizado = kwargs.autorizado ? kwargs.autorizado : false;
	var link = kwargs.link ? kwargs.link : URL_DO_BARRAMENTO;
	var mensagem = kwargs.mensagem ? kwargs.mensagem : "";
	var temTermoDeUso = kwargs.temTermoDeUso;
	
	return {"autorizado" : autorizado, "motivo" : motivo, "link_navegacao" : link, "mensagem" : mensagem, "temTermoDeUso" : temTermoDeUso};
	
};

resposta.sucesso = {
	
	autorizado : function() {
		
		return new resposta.Barramento({
			motivo : "AUTORIZADO", 
			autorizado : true
		});
	},
	
	comRessalva : function() {
		
		return new resposta.Barramento({
			motivo : "AUTORIZADO_COM_RESSALVA", 
			autorizado : true,
			mensagem : "Identificamos um problema em seu cadastro. " +
					"Entre em contato pelo telefone (21) 2534-4335 ou pelo email " +
					"assinaturadigital@oglobo.com.br"
		});
	}
};

resposta.falha = {
	
	urlEmBranco : function() {
		
		var barramento = new resposta.Barramento({
			motivo : "NAO_AUTENTICADO"
		});
		
		barramento.link_navegacao = "";
		
		return barramento;
	},
	
	urlNulo : function() {
		
		var barramento = new resposta.Barramento({
			motivo : "NAO_AUTENTICADO"
		});
		
		barramento.link_navegacao = null;
		
		return barramento;
	},
	
	urlUndefined : function() {
		
		return {"autorizado" : false, "motivo" : null};
	},
		
	sap : {
		
		upgrade : function() {
			
			return new resposta.Barramento({
				motivo: "UPGRADE"
			});
		},
		
		inexistente : function() {
			
			return new resposta.Barramento({
				motivo : "INEXISTENTE"
			});
		},
		
		cancelado : function() {
			
			return new resposta.Barramento({
				motivo : "CANCELADO",
				mensagem : "Seu acesso foi inativado. Entre em contato pelo telefone " +
						"(21) 2534-4335 ou pelo email assinaturadigital@oglobo.com.br"
			});
		},
		
		pnDuplicado : function() {
			
			return new resposta.Barramento({
				motivo : "PN_DUPLICADO",
				mensagem : "Identificamos um problema na sua assinatura. Entre em contato pelo telefone " +
						"(21) 2534-4335 ou pelo email assinaturadigital@oglobo.com.br"
			});
		},

		acessoForaDoPeriodo : function() {
			
			return new resposta.Barramento({
				motivo : "ACESSO_FORA_DO_PERIODO"
			});
		},
		
		encerrado : function() {
			
			return new resposta.Barramento({
				motivo : "ENCERRADO"
			});
		},
		
		indisponivel : function() {
			
			return new resposta.Barramento({
				motivo : "INDISPONIVEL",
				autorizado : true
			});
		}
	},
	
	cadun : {
		
		naoAutenticado : function() {
			
			return new resposta.Barramento({
				motivo : "NAO_AUTENTICADO"
			});
		},
		
		naoAutorizado : function() {
			
			return new resposta.Barramento({
				motivo : "NAO_AUTORIZADO",
				mensagem : "Serviço temporariamente indisponível. Tente novamente mais tarde."
			});
		},
		
		bloqueado : function() {
			
			return new resposta.Barramento({
				motivo : "BLOQUEADO",
				mensagem : "Identificamos um problema em seu cadastro. " +
						"Entre em contato pelo telefone (21) 2534-4335 ou pelo email " +
						"assinaturadigital@oglobo.com.br"
			});
		},
		
		confirmacaoNecessaria : function() {
			
			return new resposta.Barramento({
				motivo : "CONFIRMACAO_NECESSARIA"
			});
		},
		
		aceiteTermoUso : function() {
			
			return new resposta.Barramento({
				motivo : "ACEITE_TERMO_USO",
				temTermoDeUso : false,
				autorizado : true
			});
		},
		
		pendenteConfirmacao : function() {
			
			return new resposta.Barramento({
				motivo : "PENDENTE_CONFIRMACAO"
			});
		},
		
		trialExpirado : function() {
			
			return new resposta.Barramento({
				motivo : "TRIAL_EXPIRADO",
				mensagem : "Identificamos um problema em seu cadastro. " +
						"Entre em contato pelo telefone (21) 2534-4335 ou pelo email " +
						"assinaturadigital@oglobo.com.br"
			});
		},
		
		indisponivel : function() {
			
			return new resposta.Barramento({
				motivo : "INDISPONIVEL"
			});
		}
	}
	
};

resposta.teste = {
        
	RegistroAcesso : function() {
		
		this.RegisterWall = function() {
			this.url = null;
			this.redirecionado = false;
			this.temMensagem = false;
			this.respostaBarramento = null;
			this.chamouBarramento = false;
			this.executouAoCompletar = false;
			this.degustacao = null;
			this.executouExibirPatrocinio = false;
		},
		
		this.Paywall = function() {
			this.url = null;
			this.redirecionado = false;
			this.temMensagem = false;
			this.respostaBarramento = null;
			this.chamouBarramento = false;
			this.executouAoCompletar = false;
			this.degustacao = null;
			this.executouExibirPatrocinio = false;
		},
		
		this.executouAoAutorizar = false
	}

};

Teste.registrarAcessos = function(quantidade, mock) {
	
	var core = new ControlaAcesso.Core();
	
	var registroAcesso = new resposta.teste.RegistroAcesso();
	
	//Mocando a recuperação do glbid.
	core.logouNaGloboCom = function() {
		
		var registro = ControlaAcesso.Model.carregar();
		var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length);
		
		if (mock.logadoNaGloboCom[configEvento.nomeDoEvento]) {
			
			var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(1, new Date());
			
			ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.GLBID, "GLBID123TESTE", {
				expires : dataExpiracao,
				domain: CONFIG_GLOBAL.dominioDoCookie,
				path: CONFIG_GLOBAL.caminhoDoCookie
			});
			
			return true;
		}
		
		return false;
	};
	
	//Mocando o acesso ao barramento
	ControlaAcesso.AutorizaAcesso.prototype.validarAutorizacao = function() {
		
		registroAcesso[this.getConfigEvento().nomeDoEvento].chamouBarramento = true;
		
		this.processarResposta(mock.respostas[this.getConfigEvento().nomeDoEvento]);
	};
	
	//Mocando recuperacao de querystring do browser.
	ControlaAcesso.Browser.prototype.queryString = function() {
		
		if (typeof mock.queryString == "undefined") {
			return "";
		}
		
		var registro = ControlaAcesso.Model.carregar();
		var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length);
		
		if(mock.queryString[configEvento.nomeDoEvento]) {
			return mock.queryString[configEvento.nomeDoEvento];
		}
		
		return "";
	};
	
	if (typeof mock != 'undefined' && mock.usarValidarAutorizacaoOriginal) {
		ControlaAcesso.AutorizaAcesso.prototype.validarAutorizacao = Teste.Origin.validarAutorizacao;
	}
	
	//Mocando o redirecionamento
	core.redirecionar = function(url) {
		
		var registro = ControlaAcesso.Model.carregar();
		var nomeDoEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length).nomeDoEvento;
		
		registroAcesso[nomeDoEvento].redirecionado = true;
		registroAcesso[nomeDoEvento].url = url;
		
		if (typeof mock.aceitouTermo != "undefined" && mock.aceitouTermo[nomeDoEvento]) {
			
			if (typeof mock.respostas == "undefined") {
				
				mock.respostas = {};
			}
			
			mock.respostas[nomeDoEvento] = resposta.sucesso.autorizado();
			
			core.registrar({
				id : "REGISTRO_TERMO_DE_ACEITE" + nomeDoEvento
			});
		}

		if (mock.leitorSeConverteu[nomeDoEvento]) {
			
			var registro = ControlaAcesso.Model.carregar();
			var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length);
			
			if (typeof mock.degustacao != 'undefined' && mock.degustacao[configEvento.nomeDoEvento]) {
				
				if (!configEvento.degustacaoAtivada) {
					throw "O mock tá tentando testar a degustação, porém a sua configuração está desativada no properties do escenic-admin!";
				}
				
				var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(1, new Date());
				
				ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE_DEGUSTACAO, "degustação", {
					expires : dataExpiracao,
					domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
					path : ControlaAcesso.Configuracao.json.caminhoDoCookie
				});
				
			} else {
				
				mock.logadoNaGloboCom[nomeDoEvento] = true;
				
				if (typeof mock.respostas == "undefined") {
					
					mock.respostas = {};
				}
				
				mock.respostas[nomeDoEvento] = resposta.sucesso.autorizado();
			}
			

			core.registrar({
				id : "REGISTRO_CONVERTIDO_" + nomeDoEvento,
				aoCompletar : function(configEvento, degustacao) {
					registroAcesso[configEvento.nomeDoEvento].executouAoCompletar = true;
					registroAcesso[configEvento.nomeDoEvento].degustacao = degustacao;
				},
				aoAutorizar : function(configEvento) {
					registroAcesso.executouAoAutorizar = true;
				},
				exibirPatrocinio : function(configEvento) {
					registroAcesso[configEvento.nomeDoEvento].executouExibirPatrocinio = true;
				}
			});
		}
	};
	
	for ( var i = 1; i <= quantidade; i++) {
		
		
		if (typeof mock != 'undefined' && mock.naoRedirecionar) {
			
			core.registrar({
				id : i,
				naoRedirecionar : mock.naoRedirecionar,
				aoCompletar : function(configEvento) {
					registroAcesso[configEvento.nomeDoEvento].executouAoCompletar = true;
				},
				aoAutorizar : function(configEvento) {
					registroAcesso.executouAoAutorizar = true;
				},
				exibirPatrocinio : function(configEvento) {
					registroAcesso[configEvento.nomeDoEvento].executouExibirPatrocinio = true;
				}
			});
		} else {
			
			core.registrar({
				id : i,
				enviarMensagem : function(resposta, configEvento) {
					registroAcesso[configEvento.nomeDoEvento].temMensagem = true;
					registroAcesso[configEvento.nomeDoEvento].respostaBarramento = resposta;
				},
				aoCompletar : function(configEvento) {
					registroAcesso[configEvento.nomeDoEvento].executouAoCompletar = true;
				},
				aoAutorizar : function(configEvento) {
					registroAcesso.executouAoAutorizar = true;
				},
				exibirPatrocinio : function(configEvento) {
					registroAcesso[configEvento.nomeDoEvento].executouExibirPatrocinio = true;
				}
			});
		}
	}
	
	return registroAcesso;
};

Teste.obterCookieNoFormatoJSON = function() {
	
	var cookie = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE);
	
	if (cookie == "" || cookie == null) {
		return null;
	}
	
	return $.parseJSON(cookie);
};

Teste.limparCookie = function() {
	
	// Remove o GLBID se estiver logado.
	ControlaAcesso.Cookies.removerCookie(ControlaAcesso.GLBID, {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	// Remove o cookie de patrocinio.
	ControlaAcesso.Cookies.removerCookie("infgwpat", {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	// Remove o cookie de serviço fora.
	ControlaAcesso.Cookies.removerCookie(ControlaAcesso.Erro.NOME_DO_COOKIE_SERVICO_FORA, {
		path: "/"
	});
	
	// Remove o cookie de teste do paywall
	ControlaAcesso.Cookies.removerCookie("t3st3pyig", {
		path: "/"
	});
	
	// Remove o cookie de teste do paywall
	ControlaAcesso.Cookies.removerCookie("infgwconf", {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	ControlaAcesso.Cookies.removerCookie(ControlaAcesso.NOME_COOKIE, {
		domain: CONFIG_GLOBAL.dominioDoCookie,
		path: CONFIG_GLOBAL.caminhoDoCookie
	});
	
	if(localStorage) {
		localStorage.removeItem('infgwls');
	}
	
}

function isNotUndefined(variavel){
	
	return typeof variavel != 'undefined';
}

function isInternetExplorer() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0) {
    	return true;
    }
    
    return false;
}

QUnit.testSkip = function() {
   QUnit.test(arguments[0] + ' (IGNORADO)', function() {
       QUnit.expect(0);//dont expect any tests
       var li = document.getElementById(QUnit.config.current.id);
       QUnit.done(function() {
           li.style.background = '#FFFF99';
       });
   });
};
testSkip = QUnit.testSkip;
