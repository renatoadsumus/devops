//TODO Implementar lógica para extender os tipos nativos do javascript
// Criação de novos métodos nos tipos nativos
if (typeof (Number.prototype._formatarDoisDigitos) != "function") {
	Number.prototype._formatarDoisDigitos = function() {
		return this.valueOf() < 10 ? '0' + this.valueOf() : this.valueOf();
	};
}

if (typeof (Number.prototype._formatarTresDigitos) != "function") {
	Number.prototype._formatarTresDigitos = function() {
		var numeroFormatado = "00" + this.valueOf();
		numeroFormatado = numeroFormatado.substring(numeroFormatado.length - 3);
		return numeroFormatado;
	};
}

if (typeof (Number.prototype._converterParaJson) != "function") {
	Number.prototype._converterParaJson = function() {
		return this.valueOf().toString();
	};
}

if (typeof (Boolean.prototype._converterParaJson) != "function") {
	Boolean.prototype._converterParaJson = function() {
		return this.valueOf().toString();
	};
}

if (typeof (Date.prototype._converterParaJson) != "function") {
	Date.prototype._converterParaJson = function() {
		return ControlaAcesso.Utils.quote(this.getUTCFullYear() + '-'
				+ (this.getUTCMonth() + 1)._formatarDoisDigitos() + '-'
				+ this.getUTCDate()._formatarDoisDigitos() + 'T'
				+ this.getUTCHours()._formatarDoisDigitos() + ':'
				+ this.getUTCMinutes()._formatarDoisDigitos() + ':'
				+ this.getUTCSeconds()._formatarDoisDigitos() + '.'
				+ this.getUTCMilliseconds()._formatarTresDigitos() + 'Z');
	};
}

if (typeof (String.prototype._converterParaJson) != "function") {
	String.prototype._converterParaJson = function() {
		return ControlaAcesso.Utils.quote(this.valueOf());
	};
}

if (typeof (Array.prototype._converterParaJson) != "function") {
	Array.prototype._converterParaJson = function() {
		
		var itensConvertidos = [];
		for ( var i = 0; i < this.length; i++) {
			itensConvertidos[itensConvertidos.length] = ControlaAcesso.JSON.extrairValorPropriedade(this[i]);
		}

		return "[" + itensConvertidos.join(",") + "]";
	};
}

var ControlaAcesso = {};

ControlaAcesso.Versao = '1.2';

ControlaAcesso.NOME_COOKIE = "infgw";

ControlaAcesso.NOME_LOCALSTORAGE = "infgwls";

ControlaAcesso.NOME_COOKIE_CONF = "infgwconf";

ControlaAcesso.NOME_COOKIE_DEGUSTACAO = "infgw-deg";

ControlaAcesso.GLBID = "GLBID";

ControlaAcesso.isPrivateMode = null;

/**
 * Classe que armazena as configurações do Controle de Acesso.
 */
ControlaAcesso.Configuracao = {
	json : null,
	
	CAMINHO_DO_JSON : "/api/controla-acesso/configuracao.json",
	
	carregar : function(executor, nomeConfig, urlBaseConfig) {
		
		function registrarErro(error, codigoDeErro) {
			
			var mensagem = "Nome da configuracao = " + nomeConfig + " url base da configuracao = " + urlBaseConfig + " - " + error;
			
			ControlaAcesso.Erro.registrar(mensagem, codigoDeErro);
		}
		
		function iniciar() {
			try {
				
				executor.iniciar();
			} catch (e) {
				
				registrarErro(e.message, ControlaAcesso.Erro.AO_EXECUTAR_O_METODO_NA_CONFIGURACAO);
			}
		}

		function buscar() {
			var dataType = "json";
			
			if (urlBaseConfig != "") {
				dataType = "jsonp"
			}
			
			$.ajax({
				cache : true,
				dataType : dataType,
				data : {
					'produto' : nomeConfig
				},
				jsonpCallback : 'paywallConfig',
				url : urlBaseConfig + ControlaAcesso.Configuracao.CAMINHO_DO_JSON,
				success : function(config) {
					
					ControlaAcesso.Configuracao.json = config;
					iniciar();
				},
				error : function(xhr, textStatus, error) {
					
					registrarErro(error, ControlaAcesso.Erro.AO_CONECTAR_PARA_CARREGAR_CONFIGURACAO);
				}
			});
		}

		if (this.json != null) {

			iniciar();
		} else {

			if (urlBaseConfig == null) urlBaseConfig = "";
			if (nomeConfig == null)	nomeConfig = ""; 

			buscar();
		}
	}
};

ControlaAcesso.Leitor = {
			
	TIPO_DESCONHECIDO : '-',
	TIPO_CADASTRADO : 'cadastrado',
	TIPO_ASSIN_SEM : 'assinante sem digital',
	TIPO_ASSIN_COM : 'assinante com digital',

	STATUS_NASCENTE : '-',
	STATUS_REGISTER : 'register-wall',
	STATUS_REGISTER_PASS : 'register-wall-passou',
	STATUS_PAYWALL : 'paywall',
	STATUS_PAYWALL_PASS : 'paywall-passou',
	STATUS_PAYWALL_CONV : 'paywall-converteu',
		
	totalDeVisualizacoes : function() {
		var cookie = ControlaAcesso.Model.carregar();
		
		return cookie.itens.length;
	},
	
	relatorio : function() {
		try {
			var cookie = ControlaAcesso.Model.carregar();
			
			var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(cookie.itens.length);
			
			console.info("Leitor está no evento de:", configEvento.nomeDoEvento);
			console.info("Status no analytics:", ControlaAcesso.Leitor.status());
			
			console.info("Data de Inicialização:", cookie.dtIni);
			console.info("Total de Visualizações:", this.totalDeVisualizacoes());
			
			console.info("Data de Execução do Register:", cookie.eventos.RegisterWall.dtExec);
			console.info("Data de Conversão no Register:", cookie.eventos.RegisterWall.dtConv);
			
			console.info("Data de Execução do Paywall:", cookie.eventos.Paywall.dtExec);
			console.info("Data de Conversão no Paywall:", cookie.eventos.Paywall.dtConv);
		} catch (e) {}
	},
	
	status : function() {
		var cookie = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE);
		var cookieConf = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE_CONF);
		
		if (cookie == null || cookie == "" || cookieConf == null || cookieConf == "") {
			return "00";
		}
		
		var registro = $.parseJSON(cookie);
				
		if (registro.eventos.Paywall.dtConv != null) {
			return ControlaAcesso.Leitor.STATUS_PAYWALL_PASS;
		}
		
		if (registro.eventos.Paywall.dtExec != null) {
			return ControlaAcesso.Leitor.STATUS_PAYWALL;
		}

		if (registro.eventos.RegisterWall.dtExec != null && registro.eventos.RegisterWall.dtConv == null) {
			return ControlaAcesso.Leitor.STATUS_REGISTER;
		}
		
		var cookieConfParsered = $.parseJSON(cookieConf);
		
		if ((registro.itens.length == cookieConfParsered.RegisterWall + 1 
			|| cookieConfParsered.Paywall == null && registro.itens.length == cookieConfParsered.RegisterWall) 
				&& registro.eventos.RegisterWall.dtConv != null) {
			return ControlaAcesso.Leitor.STATUS_REGISTER_PASS;
		}
		
		return registro.itens.length._formatarDoisDigitos().toString();
	},
	
	tipoDeCadastro : function() {
		var cookie = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE);
		
		if (cookie == null || cookie == "") {
			return ControlaAcesso.Leitor.TIPO_DESCONHECIDO;
		}
		
		var registro = $.parseJSON(cookie);
		
		var motivo = registro.eventos.Paywall.motivo;
		
		if (motivo) {
			
			if (motivo == "UPGRADE") {
				
				return ControlaAcesso.Leitor.TIPO_ASSIN_SEM;
			}
			
			var statusAutorizado = {
				"AUTORIZADO" : true, 
				"ACESSO_FORA_DO_PERIODO" : true, 
				"AUTORIZADO_COM_RESSALVA" : true
			};
			
			if (statusAutorizado[motivo]) {
				
				return ControlaAcesso.Leitor.TIPO_ASSIN_COM;
			}
		}
		
		if (motivo || registro.eventos.RegisterWall.dtConv != null || ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.GLBID)) {
			return ControlaAcesso.Leitor.TIPO_CADASTRADO;
		}
		
		return ControlaAcesso.Leitor.TIPO_DESCONHECIDO;
	}
};

ControlaAcesso.GA = {

	obterTipoCadastro : function(oldValueParm, currentValueParam) {

		function extrairPrincipal(value) {
			var ret = null;
			if (value) {
			   var p = 	value.indexOf('-',1);
			   if (p < 0)
				   ret = value;
			   else {
				   ret = value.substring(0,p).trim();
			   }
			}
			return ret;
		}
		
		function extrairComplemento(value) {
			var ret = null;
			if (value) {
			   var p = 	value.indexOf('-',1);
			   if (p < 0)
				   ret = "";
			   else {
				   ret = value.substring(p + 1).trim();
			   }
			}
			return ret;
		}
		
		function obterMotivo() {
			var motivo = null;
			var registro = $.parseJSON(ControlaAcesso.Cookies
					.obterValorCookie(ControlaAcesso.NOME_COOKIE));
			if (registro != null) {
				motivo = registro.eventos.Paywall.motivo;
			}
			return motivo;
		}

		function f2a() {
			var ret = ControlaAcesso.Leitor.TIPO_ASSIN_SEM;
			var motivo = obterMotivo();
			if (motivo) {
				if (motivo == "ENCERRADO" || motivo == "BLOQUEADO" || motivo == "CANCELADO")
					ret = ControlaAcesso.Leitor.TIPO_CADASTRADO;
			}
			return ret;
		}

		function f2b() {
			var ret = ControlaAcesso.Leitor.TIPO_ASSIN_COM;
			var motivo = obterMotivo();
			if (motivo) {
				if (motivo == "ENCERRADO" || motivo == "BLOQUEADO" || motivo == "CANCELADO")
					ret = ControlaAcesso.Leitor.TIPO_CADASTRADO;
			}
			return ret;
		}

		function f3a() {
			var ret = ControlaAcesso.Leitor.TIPO_ASSIN_COM;
			var motivo = obterMotivo();
			if (motivo) {
				if (motivo == "UPGRADE")
					ret = ControlaAcesso.Leitor.TIPO_CADASTRADO;
			}
			return ret;
		}

		var validValues = [ ControlaAcesso.Leitor.TIPO_DESCONHECIDO,ControlaAcesso.Leitor.TIPO_CADASTRADO, 
		                    ControlaAcesso.Leitor.TIPO_ASSIN_SEM, ControlaAcesso.Leitor.TIPO_ASSIN_COM ];

		function findId(value) {
			if (value != undefined) {
				for ( var i = 0; i < validValues.length; i++) {
					if (value == validValues[i])
						return i;
				}
			}
			return -1;
		}

		var answers = [
		    [ ControlaAcesso.Leitor.TIPO_DESCONHECIDO, ControlaAcesso.Leitor.TIPO_CADASTRADO, ControlaAcesso.Leitor.TIPO_ASSIN_SEM, ControlaAcesso.Leitor.TIPO_ASSIN_COM],
		    [ ControlaAcesso.Leitor.TIPO_CADASTRADO	 , ControlaAcesso.Leitor.TIPO_CADASTRADO, f2a				 		    	  , f2b ],
			[ ControlaAcesso.Leitor.TIPO_ASSIN_SEM	 , ControlaAcesso.Leitor.TIPO_ASSIN_SEM , ControlaAcesso.Leitor.TIPO_ASSIN_SEM, f3a ],
			[ ControlaAcesso.Leitor.TIPO_ASSIN_COM	 , ControlaAcesso.Leitor.TIPO_ASSIN_COM , ControlaAcesso.Leitor.TIPO_ASSIN_COM, ControlaAcesso.Leitor.TIPO_ASSIN_COM ] ];

		var currentValuePrincipal = extrairPrincipal(currentValueParam);
		var oldValuePrincipal = extrairPrincipal(oldValueParm);
		
		var idCurrentValue = findId(currentValuePrincipal);
		var idOldValue = findId(oldValuePrincipal);
		
		var ret;
		// ret recebe parte Principal
		if (idOldValue < 0 || idCurrentValue < 0 || idCurrentValue == idOldValue) {
			if (idCurrentValue >= 0) {
				ret =  currentValuePrincipal;
			}
			else {
				ret = ControlaAcesso.Leitor.TIPO_DESCONHECIDO;
			}
		}
		else {
			var answer = answers[idCurrentValue][idOldValue];
			if (typeof (answer) == 'function') {
				ret =  answer();
			}
			else {
				ret = answer;
			}
		}
		if (ret == ControlaAcesso.Leitor.TIPO_ASSIN_SEM) {  // trata complemento 
			var oldCompl = extrairComplemento(oldValueParm);
			if (oldCompl != '') {
				ret += ' - ' + oldCompl;
			}
				
		}
		return ret;
	},
		
	obterTipoUsuario : function(oldValueParm) {
		
		var registro = $.parseJSON(ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE));
		
		function resumoStatusAtual() {
			if (registro == null || registro.eventos == null) {
				return ControlaAcesso.Leitor.STATUS_NASCENTE;
			}
			
			if (registro.eventos.Paywall.dtConv != null) {
				return ControlaAcesso.Leitor.STATUS_PAYWALL_PASS;
			}
			
			if (registro.eventos.Paywall.dtExec != null) {
				return ControlaAcesso.Leitor.STATUS_PAYWALL;
			}

			if (registro.eventos.RegisterWall.dtExec != null && registro.eventos.RegisterWall.dtConv == null) {
				return ControlaAcesso.Leitor.STATUS_REGISTER;
			}
			
			if (registro.eventos.RegisterWall.dtConv != null) {
				return ControlaAcesso.Leitor.STATUS_REGISTER_PASS;
			}

			return ControlaAcesso.Leitor.STATUS_NASCENTE;
		}
		
		function fA() {
			var ret = oldValueParm;  // retorno default
			var motivo = (registro.eventos.Paywall? registro.eventos.Paywall.motivo: null);
			if (motivo) {
				if (registro.eventos.Paywall.dtConv == null && 
				     (motivo == "ENCERRADO" || motivo == "BLOQUEADO" || motivo == "CANCELADO" ||  motivo == "UPGRADE"))
					ret = ControlaAcesso.Leitor.STATUS_PAYWALL;
			}
			return ret;
		}

		var validValues = [ ControlaAcesso.Leitor.STATUS_NASCENTE, ControlaAcesso.Leitor.STATUS_REGISTER, ControlaAcesso.Leitor.STATUS_REGISTER_PASS, ControlaAcesso.Leitor.STATUS_PAYWALL, ControlaAcesso.Leitor.STATUS_PAYWALL_PASS, ControlaAcesso.Leitor.STATUS_PAYWALL_CONV];

		function findId(value) {
			if (value != undefined) {
				for ( var i = 0; i < validValues.length; i++) {
					if (value == validValues[i])
						return i;
				}
			}
			return -1;
		}

		var answers = [
			[ControlaAcesso.Leitor.STATUS_NASCENTE	   ,ControlaAcesso.Leitor.STATUS_REGISTER	  ,ControlaAcesso.Leitor.STATUS_REGISTER_PASS,ControlaAcesso.Leitor.STATUS_PAYWALL      ,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS  ,ControlaAcesso.Leitor.STATUS_PAYWALL_CONV],
			[ControlaAcesso.Leitor.STATUS_REGISTER	   ,ControlaAcesso.Leitor.STATUS_REGISTER	  ,ControlaAcesso.Leitor.STATUS_REGISTER_PASS,ControlaAcesso.Leitor.STATUS_PAYWALL		,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS  ,ControlaAcesso.Leitor.STATUS_PAYWALL_CONV],
			[ControlaAcesso.Leitor.STATUS_REGISTER_PASS,ControlaAcesso.Leitor.STATUS_REGISTER_PASS,ControlaAcesso.Leitor.STATUS_REGISTER_PASS,ControlaAcesso.Leitor.STATUS_PAYWALL		,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS  ,ControlaAcesso.Leitor.STATUS_PAYWALL_CONV],
			[ControlaAcesso.Leitor.STATUS_PAYWALL	   ,ControlaAcesso.Leitor.STATUS_PAYWALL	  ,ControlaAcesso.Leitor.STATUS_PAYWALL		 ,ControlaAcesso.Leitor.STATUS_PAYWALL		,fA                							,fA 				  					  ],
			[ControlaAcesso.Leitor.STATUS_PAYWALL_PASS ,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS ,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS ,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS ,ControlaAcesso.Leitor.STATUS_PAYWALL_PASS  ,ControlaAcesso.Leitor.STATUS_PAYWALL_CONV]];
		
		var currentValue = resumoStatusAtual();
		var idCurrentValue = findId(currentValue); 
		var idOldValue = findId(oldValueParm);
		
		var ret;
		if (idOldValue < 0 || idCurrentValue == idOldValue) {  
			ret =  currentValue;
		}
		else {
			var answer = answers[idCurrentValue][idOldValue];
			if (typeof (answer) == 'function') {
				ret =  answer();
			}
			else {
				ret = answer;
			}
		}
		return ret;
	}
};

ControlaAcesso.Utils = {

	ParChaveValor : function(chave, valor) {
		this.chave = chave;
		this.valor = valor;
		this.toString = function() {
			return this.chave.toString() + "=" + this.valor.toString();
		};
	},
	obterTipoDe : function(obj) {
		var nomeTipo = typeof (obj);
		var expressaoTipo = /^\[object\s(\w+)]$/i;
		var subMatches;

		if (obj === undefined) {
			throw new Error("Referência ou tipo invalidos");
		}

		if (obj === null) {
			return "null";
		}

		if (nomeTipo == "object") {
			subMatches = expressaoTipo.exec(Object.prototype.toString.call(obj));
			nomeTipo = subMatches[1].toLowerCase();
		}

		return nomeTipo;
	},
	quote : function(text) {
		return '"' + text + '"';
	},
	trim : function(textoToTrim) {
		var trimRegex = /^\s+|\s+$/gim;
		return (textoToTrim + "").replace(trimRegex, "");
	},
	extrairDominio : function(urlCompleta) {
		var expressaoDominio = /^(?:http(?:s*):\/\/)(.*?)\//;
		var submatches = expressaoDominio.exec(urlCompleta + "/");

		if (submatches != null && submatches.length == 2) {
			return submatches[1];
		}

		return "";
	},

	extrairValorQuerystring : function(chave, url) {
		if (url == null) {
			url = window.location.href;
		}
		chave = chave.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + chave + "=([^&#]*)");
		var qs = regex.exec(url);
		if (qs == null) {
			return "";
		} else {
			return qs[1];
		}
	},

	writeLog : null,
	log : function(msg) {
		try {
			if (this.writeLog == null) { // verifica se existe cookie
				this.writeLog = ControlaAcesso.Cookies.obterValorCookie('writeLog') == "true";
			}
			if (this.writeLog)
				console.info(">>ControlaAcesso.log:" + msg);
		} catch (e) {
		}
	},		
	retry: function(isDone, next) {
	    var current_trial = 0, max_retry = 50, interval = 10, is_timeout = false;
	    var id = window.setInterval(
	        function() {
	            if (isDone()) {
	                window.clearInterval(id);
	                next(is_timeout);
	            }
	            if (current_trial++ > max_retry) {
	                window.clearInterval(id);
	                is_timeout = true;
	                next(is_timeout);
	            }
	        },
	        10
	    );
	},
	isIE10OrLater: function(user_agent) {
	    var ua = user_agent.toLowerCase();
	    if (ua.indexOf('msie') === 0 && ua.indexOf('trident') === 0) {
	        return false;
	    }
	    var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
	    if (match && parseInt(match[1], 10) >= 10) {
	        return true;
	    }
	    return false;
	},
	isNavegadorNativoAndroid : function() {
		var nua = navigator.userAgent;
		var is_android = (
				(
					nua.indexOf('Mozilla/5.0') > -1 
						&& nua.indexOf('Android ') > -1 
						&& nua.indexOf('AppleWebKit') > -1
				) 
				&& !(nua.indexOf('Chrome') > -1)
			);

		return is_android;
	},
	detectPrivateMode: function(callback) {
		 var is_private;

		    if (window.webkitRequestFileSystem) {
		        window.webkitRequestFileSystem(
		            window.TEMPORARY, 1,
		            function() {
		                is_private = false;
		            },
		            function(e) {
		                is_private = true;
		            }
		        );
		    } else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
		        var db;
		        try {
		            db = window.indexedDB.open('test');
		        } catch(e) {
		            is_private = true;
		        }

		        if (typeof is_private === 'undefined') {
		        	ControlaAcesso.Utils.retry(
		                function isDone() {
						
		                    return db.readyState === 'done' ? true : false;
		                },
		                function next(is_timeout) {
		                    if (!is_timeout) {
		                        is_private = db.result ? false : true;
		                    }
		                }
		            );
		        }
		    } else if (ControlaAcesso.Utils.isIE10OrLater(window.navigator.userAgent)) {
		        is_private = false;
		        try {
		            if (!window.indexedDB) {
		                is_private = true;
		            }                 
		        } catch (e) {
		            is_private = true;
		        }
		    } else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
		        try {
		            window.localStorage.setItem('test', 1);
		        } catch(e) {
		            is_private = true;
		        }

		        if (typeof is_private === 'undefined') {
		            is_private = false;
		            window.localStorage.removeItem('test');
		        }
		    }

		    ControlaAcesso.Utils.retry(
		        function isDone() {
		            return typeof is_private !== 'undefined' ? true : false;
		        },
		        function next(is_timeout) {
		            callback(is_private);
		        }
		    );
	}
};

/**
 * Classe responsável pela manutenção de cookie.
 */
ControlaAcesso.Cookies = {
	obterValorCookie : function(nomeCookie) {
		var listaCookies = document.cookie.split(';');
		var regExpChaveValor = /([a-zA-Z0-9-]+)=(.*)/im;
		var matches;
		var chaveValorCookie;
		try {
			for ( var i = 0; i < listaCookies.length; i++) {
				matches = regExpChaveValor.exec(listaCookies[i]);
				chaveValorCookie = new ControlaAcesso.Utils.ParChaveValor(matches[1], matches[2]);
				if (chaveValorCookie.chave == nomeCookie) {
					return chaveValorCookie.valor;
				}
			}
		} catch (e) {
		} // consome erro

		return "";
	},
	calcularDataExpiracao : function(diasParaExpiracao, dataInicial) {
		var dataExpiracao = new Date();

		// Caso data inicial seja informada utilizá-la
		if (dataInicial) {
			dataExpiracao.setTime(dataInicial.getTime());
		}

		// Calculando data de expiração
		dataExpiracao.setTime(dataExpiracao.getTime()
				+ (diasParaExpiracao * 24 * 60 * 60 * 1000));

		return dataExpiracao;
	},
	criarParametros : function(nome, valor, kwargs) {
		var parametrosCookie = [];
		var propriedadeCookie;
		var valorPropriedade = "";

		// Adicionando o nome e valor às propriedades
		propriedadeCookie = new ControlaAcesso.Utils.ParChaveValor(nome, valor);
		parametrosCookie.push(propriedadeCookie.toString());

		for ( var prop in kwargs) {
			valorPropriedade = (prop == "expires" ? kwargs[prop].toUTCString() : kwargs[prop]);
			if (valorPropriedade != "") {
				propriedadeCookie = new ControlaAcesso.Utils.ParChaveValor(prop, valorPropriedade);
				parametrosCookie.push(propriedadeCookie.toString());
			}
		}

		return parametrosCookie.join("; ");
	},
	escreverCookie : function(nome, valor, kwargs, removeCookie) {
		var cookieParametrizado = "";

		// Validando os parâmetros
		if (ControlaAcesso.Utils.trim(nome) == "") {
			throw new Error("O nome do cookie deve ser informado");
		}

		if (!removeCookie && ControlaAcesso.Utils.trim(valor) == "") {
			throw new Error("O valor do cookie deve ser informado");
		}

		// Criando os parâmetros do cookie
		cookieParametrizado = this.criarParametros(nome, valor, kwargs);

		// Gravando o cookie
		document.cookie = cookieParametrizado;
	},
	removerCookie : function(nomeCookie, kwargs) {
		// Caso o kwargs não seja informado, criá-lo vazio.
		if (!kwargs) {
			kwargs = { };
		}
		
		// Informando data de expiração para 1 (um) dia atrás.
		kwargs.expires = this.calcularDataExpiracao(-1);						
		this.escreverCookie(nomeCookie, "", kwargs, true);
	}
};

ControlaAcesso.JSON = {
	extrairValorPropriedade : function(propriedade) {
		var tipoPropriedade = ControlaAcesso.Utils.obterTipoDe(propriedade);

		if (tipoPropriedade == "null") {
			return "null";
		}

		if (tipoPropriedade == "object") {
			return this.conveterParaJson(propriedade);
		}

		return propriedade._converterParaJson();
	},
	conveterParaJson : function(objeto) {
		// Utilizar o serializador JSON nativo, se disponível
		if (window.JSON) {
			return JSON.stringify(objeto);
		}

		var jsonProps = [];

		if (ControlaAcesso.Utils.obterTipoDe(objeto) == "null") {
			return "null";
		}

		for ( var attr in objeto) {
			// Não serializar os métodos
			if (ControlaAcesso.Utils.obterTipoDe(objeto[attr]) == "function") {
				continue;
			}

			jsonProps[jsonProps.length] = ControlaAcesso.Utils.quote(attr) + ":" + this.extrairValorPropriedade(objeto[attr]);
		}

		if (ControlaAcesso.Utils.obterTipoDe(objeto) == "object") {
			return '{' + jsonProps.join(",") + '}';
		}

		return jsonProps.join(",");
	},
	parsearDataFormatoJson : function(data) {
		var expressaoDataJson = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?Z/im;
		var submatches;
		var dataParseada = new Date();

		if (!expressaoDataJson.test(data)) {
			throw new Error("A data '" + data + "' está no formato inválido");
		}

		submatches = expressaoDataJson.exec(data);

		dataParseada.setUTCFullYear(submatches[1]);
		dataParseada.setUTCMonth(submatches[2] - 1);
		dataParseada.setUTCDate(submatches[3]);
		dataParseada.setUTCHours(submatches[4]);
		dataParseada.setUTCMinutes(submatches[5]);
		dataParseada.setUTCSeconds(submatches[6]);
		if (submatches[8]) {
			dataParseada.setUTCMilliseconds(submatches[8]);
		}

		return dataParseada;
	}
};

ControlaAcesso.Model = {
	Eventos : function() {
		this.add = function(chave, valor) {
			this[chave] = valor;
		}
	},

	Evento : function() {
		this.dtExec = null;
		this.dtConv = null;
		this.motivo = null;
	},

	Registro : function() {
		this.itens = [];
		this.dtIni = null;
		this.dtExp = null;

		this.eventos = new ControlaAcesso.Model.Eventos();
		
		this.atualizarDataDeExecucao = function(configEvento) {
			
			this.eventos[configEvento.nomeDoEvento].dtExec = new Date();

			ControlaAcesso.Model.salvar(this);
		};
		
		this.atualizarDataDeConversao = function(configEvento) {
			
			if (typeof configEvento == 'undefined') {
				
				configEvento = ControlaAcesso.Model.obterConfiguracaoEventos();
			}
			
			this.eventos[configEvento.nomeDoEvento].dtConv = new Date();

			ControlaAcesso.Model.salvar(this);
		};
		
		this.inserirMotivo = function(motivo, configEvento) {
			
			if (typeof configEvento == 'undefined') {
				
				configEvento = ControlaAcesso.Model.obterConfiguracaoEventos();
			}
			
			this.eventos[configEvento.nomeDoEvento].motivo = motivo;
			
			ControlaAcesso.Model.salvar(this);
		};
		
		this.adicionarConteudoVisualizado = function(idDoConteudo, callback) {
			this.itens[this.itens.length] = idDoConteudo;
			
			// Gravando no cookie
			ControlaAcesso.Model.salvar(this);
			
			if(callback) callback();
		}
	},
	
	criarEventos : function() {
		var eventos = {};
		
		eventos['RegisterWall'] = new ControlaAcesso.Model.Evento();
		eventos['Paywall'] = new ControlaAcesso.Model.Evento();
		
		return eventos;
	},
	
	carregar : function() {
		var valorCookie = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE);
		var registro = null;
		var usouLocalStorage = false;
		try {
			
			if (valorCookie == "" || valorCookie == null) {
				
				if (window.localStorage) {
					
					localStoragePay = localStorage.getItem(ControlaAcesso.NOME_LOCALSTORAGE);
					
					if (localStoragePay != "") {
						
						var localStorageJSON = $.parseJSON(localStoragePay);
						
						var dataExpiracao = ControlaAcesso.JSON.parsearDataFormatoJson(localStorageJSON.dtExp);
						
						if (dataExpiracao >= new Date()) {
														
							valorCookie = localStoragePay;
							usouLocalStorage = true;
												
						} 
					}
					
				}
			}
			
		} catch (e) {}
		
		
		
		if (valorCookie != "") {
			try {
				// tentando parsear o Cookie
				var cookie = $.parseJSON(valorCookie);
				
				registro = new ControlaAcesso.Model.Registro();
				registro.itens = cookie.itens;
				
				//TODO Migra os leitores para nova versão do cookie remover if após 30 dias.
				if (cookie.dtini) {
					
					registro.dtIni = ControlaAcesso.JSON.parsearDataFormatoJson(cookie.dtini);
					
					registro.eventos = ControlaAcesso.Model.criarEventos();
					
					if (cookie.dtwal) {
						registro.eventos["RegisterWall"].dtExec = ControlaAcesso.JSON.parsearDataFormatoJson(cookie.dtwal);
					}
					if (cookie.dtcnv) {
						registro.eventos["RegisterWall"].dtConv = ControlaAcesso.JSON.parsearDataFormatoJson(cookie.dtcnv);
					}
				} else {
					
					registro.dtIni = ControlaAcesso.JSON.parsearDataFormatoJson(cookie.dtIni);
					registro.dtExp = ControlaAcesso.JSON.parsearDataFormatoJson(cookie.dtExp);
					
					registro.eventos = cookie.eventos;
					
					for(var nomeDoEvento in cookie.eventos) {
						var cookieEvento = cookie.eventos[nomeDoEvento];
						var evento = registro.eventos[nomeDoEvento];
						
						if (cookieEvento.dtExec) {
							evento.dtExec = ControlaAcesso.JSON.parsearDataFormatoJson(cookieEvento.dtExec);
						}
						
						if (cookieEvento.dtConv) {
							evento.dtConv = ControlaAcesso.JSON.parsearDataFormatoJson(cookieEvento.dtConv);
						}
						
						if (cookieEvento.motivo) {
							evento.motivo = cookieEvento.motivo;
						}
					}
				}
				
			} catch (e) {
				
				registro = new ControlaAcesso.Model.Registro();
				registro.eventos = ControlaAcesso.Model.criarEventos();
			}
	
		} else {
			registro = new ControlaAcesso.Model.Registro();
			registro.eventos = ControlaAcesso.Model.criarEventos();
		}
		
		if (usouLocalStorage) {
			ControlaAcesso.Model.salvar(registro);	
		}
		
		return registro;
	},
	
	salvar : function(registro) {
		
		if (registro.dtIni == null) {
			registro.dtIni = new Date();
		}
		
		var diasDeExpiracao = ControlaAcesso.Configuracao.json.diasDeExpiracaoDoCookie;
		var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(diasDeExpiracao, registro.dtIni);
		
		registro.dtExp = dataExpiracao;
				
		ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE,
			ControlaAcesso.JSON.conveterParaJson(registro), {
				expires : dataExpiracao,
				domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
				path : ControlaAcesso.Configuracao.json.caminhoDoCookie
			});
		
		
		
		var configEventosJson = ControlaAcesso.Configuracao.json.eventos;
		
		var configEventosMapa = {}
		
		for ( var i = 0; i < configEventosJson.length; i++) {
			
			var evento = configEventosJson[i];
			
			configEventosMapa[evento.nomeDoEvento] = evento.limiteDeAcesso
			
		}
		
		ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE_CONF,
				ControlaAcesso.JSON.conveterParaJson(configEventosMapa), {
					expires : dataExpiracao,
					domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
					path : ControlaAcesso.Configuracao.json.caminhoDoCookie
				});
		
		try {

			var valorCookie = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE);
			
			if (window.localStorage) {
				localStorage.setItem(ControlaAcesso.NOME_LOCALSTORAGE, valorCookie);
			} else {
				ControlaAcesso.Utils.log("Falha ao escrever no local Storage.");
			}
		}
		catch (e) {
			ControlaAcesso.Utils.log("Falha ao escrever no local Storage.");
		}
		
	},
	
	obterConfiguracaoEventos : function(qtdAcesso) {
			
		var eventos = ControlaAcesso.Configuracao.json.eventos;
		
		if (typeof qtdAcesso == 'undefined') {
			
			qtdAcesso = ControlaAcesso.Leitor.totalDeVisualizacoes();
		}
	
		for ( var i = 0; i < eventos.length; i++) {
			var evento = eventos[i];
			
			if (qtdAcesso <= evento.limiteDeAcesso || i == eventos.length - 1) {
				return evento;
			}
		}
	},
	obtemEvento : function(nome) {
            
        var eventos = ControlaAcesso.Configuracao.json.eventos;
            
        for ( var i = 0; i < eventos.length; i++) {
            var evento = eventos[i];
            
            if (evento.nomeDoEvento == nome || i == eventos.length - 1) {
                return evento;
            }
        }
    },
	
	atualizaCookieConfiguracao : function(registro) {
	
	   if (registro.dtIni == null) {
            registro.dtIni = new Date();
        }
        
        var diasDeExpiracao = ControlaAcesso.Configuracao.json.diasDeExpiracaoDoCookie;
        var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(diasDeExpiracao, registro.dtIni);
        
        registro.dtExp = dataExpiracao;
                
        ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE,
            ControlaAcesso.JSON.conveterParaJson(registro), {
                expires : dataExpiracao,
                domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
                path : ControlaAcesso.Configuracao.json.caminhoDoCookie
            });
        
        
        
        var configEventosJson = ControlaAcesso.Configuracao.json.eventos;
        
        var configEventosMapa = {}
        
        for ( var i = 0; i < configEventosJson.length; i++) {
            
            var evento = configEventosJson[i];
            
            configEventosMapa[evento.nomeDoEvento] = evento.limiteDeAcesso
            
        }
        
        ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE_CONF,
                ControlaAcesso.JSON.conveterParaJson(configEventosMapa), {
                    expires : dataExpiracao,
                    domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
                    path : ControlaAcesso.Configuracao.json.caminhoDoCookie
                }
        );
	
	}
	
};

ControlaAcesso.Patrocinio = function (configEvento) {
	
	var NOME_COOKIE_PATROCINIO = "infgwpat";
	
	if (typeof configEvento == 'undefined') {
		
		throw new Error("Informe o config evento.");
	}
	
	this.ativado = function() {
		try {
			var patrocinio = configEvento.patrocinio;
			
			var ativado = patrocinio != null && patrocinio.diasDeCortesia > 0;
			
			if (ativado) {
				
				var agora = new Date();
				var dataInicio = new Date(patrocinio.dataInicio);
				var dataFim = new Date(patrocinio.dataFim);
				
				return agora >= dataInicio && agora <= dataFim;
			}
		} catch(e) {}

		return false;
	},
	
	this.existeCortesia = function() {
		
		return ControlaAcesso.Cookies.obterValorCookie(NOME_COOKIE_PATROCINIO) != "";
	},
		
	this.criarCortesia = function() {
		
		if (this.ativado() && !this.existeCortesia()) {
			var dataExpiracao = ControlaAcesso.Cookies.calcularDataExpiracao(configEvento.patrocinio.diasDeCortesia);
			
			ControlaAcesso.Cookies.escreverCookie(NOME_COOKIE_PATROCINIO, "ativado", {
				expires : dataExpiracao,
				domain : ControlaAcesso.Configuracao.json.dominioDoCookie,
				path : ControlaAcesso.Configuracao.json.caminhoDoCookie
			});
		}
	}
};

ControlaAcesso.Erro = {
		
	AO_EXECUTAR_O_METODO_NA_CONFIGURACAO : 1,
	AO_CONECTAR_PARA_CARREGAR_CONFIGURACAO : 2,
	AO_CONECTAR_PARA_AUTORIZAR_ACESSO : 3,
	RESPOSTA_DO_SERVICO_NULA : 4,
	FALHA_AO_REGISTRAR_UM_CONTEUDO : 5,
	SERVICO_INDISPONIVEL : 6,

	NOME_DO_COOKIE_SERVICO_FORA : 'infgwerr',

	registrar : function(mensagem, codigoDeErro) {
		
		var expiraEmUmaHora = new Date(new Date().getTime() + 3600000);
		
		try {

			ControlaAcesso.Cookies.escreverCookie(this.NOME_DO_COOKIE_SERVICO_FORA, mensagem, {
				path: "/",
				expires : expiraEmUmaHora
			}, false);

			ControlaAcesso.Utils.log("Codigo de Erro: " + codigoDeErro + " Mensagem: "+ mensagem);
		} catch (e) {
			
			ControlaAcesso.Utils.log("Falha ao escrever o cookie.");
		}
	},
	
	existe : function() {

		return ControlaAcesso.Cookies.obterValorCookie(this.NOME_DO_COOKIE_SERVICO_FORA) != "";
	}
};

/**
 * Classe responsável pelo acesso ao barramento, ele faz a verificação se o leitor está autorizado em um determinado serviço.
 * 
 * @type Function @param configEvento Função com as configurações de um evento.
 * @type PlainObject @param callback Recebe um conjunto de chave/valor, obrigatoriamente duas funções devem ser informadas.
 * @type Function autorizado : Função invocada quando o leitor é autorizado pelo barramento.
 * @type Function naoAutorizado : Função invocada quando o leitor não é autorizado pelo barramento.
 */
ControlaAcesso.AutorizaAcesso = function(paramConfigEvento, paramCallback) {
	
	var configEvento = paramConfigEvento;
	
	this.callback = paramCallback;

	this.getConfigEvento = function() {
		
		return configEvento;
	};
	
	if (configEvento.degustacaoAtivada) {
		var degustacao = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE_DEGUSTACAO);
		
		if (degustacao != "") {
			this.callback.autorizado("AUTORIZADO", null, degustacao);
			
			ControlaAcesso.Cookies.removerCookie(ControlaAcesso.NOME_COOKIE_DEGUSTACAO, {
				domain: ControlaAcesso.Configuracao.json.dominioDoCookie,
				path: ControlaAcesso.Configuracao.json.caminhoDoCookie
			});
		} else {
			this.validarAutorizacao();
		}
		
		return;
	}
	
	this.validarAutorizacao();
};

ControlaAcesso.AutorizaAcesso.prototype.validarAutorizacao = function() {
	
	var configEvento = this.getConfigEvento();
	var urlValidarLogin = configEvento.urlDeStatusDoLeitor;
	
	if (urlValidarLogin.indexOf("://") < 0)	urlValidarLogin = location.protocol + "//" + location.host + urlValidarLogin;
	
	var AutorizaAcesso = this;
	
	var dataType = "jsonp"
	var	formato = "application/javascript";
	var type = "get";
	var data =  { 
		"token-autenticacao" : ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.GLBID),
		"ipUsuario": "127.0.0.1",
		"codigoProduto": configEvento.codigoDoProduto
	};
	
	if (!configEvento.consultaComJsonp) {
		
		dataType = "json";
		formato = "application/json";
		type = "post";
		data = ControlaAcesso.JSON.conveterParaJson(data);
	}
	
	$.ajax({
		contentType : formato,
		headers: {
	        Accept : formato
	    },
	    jsonpCallback : 'AutorizaAcesso',
		dataType: dataType,
		type : type,
		data : data,
		url : urlValidarLogin,
		success : function(resposta) {
			
			AutorizaAcesso.processarResposta(resposta);
		},
		error : function(xhr, textStatus, error) {
			
			ControlaAcesso.Erro.registrar(error, ControlaAcesso.Erro.AO_CONECTAR_PARA_AUTORIZAR_ACESSO);
			AutorizaAcesso.callback.error();
		}
	});
};

ControlaAcesso.AutorizaAcesso.prototype.processarResposta = function(resposta) {
	
	if (resposta != null) {
		
		if (resposta.mensagem) {
			
			this.callback.comMensagem(resposta);
		} else if (resposta.autorizado) {
			
			if (typeof resposta.temTermoDeUso != "undefined" && !resposta.temTermoDeUso) { // Criar teste unitário sem termo de uso 
				
				this.callback.naoAutorizado(resposta.motivo, resposta.link_navegacao);
			} else {
				
				this.callback.autorizado(resposta.motivo, resposta.link_navegacao);
			}
			
		} else {
			
			this.callback.naoAutorizado(resposta.motivo, resposta.link_navegacao);
		}
		
	} else {
		
		ControlaAcesso.Erro.registrar("Falha ao processar resposta do barramento.", ControlaAcesso.Erro.RESPOSTA_DO_SERVICO_NULA);
	}
};

ControlaAcesso.Core = function() {

	this.urlLiberada = function(url, urlsLiberadas) {
		var dominioUrl = ControlaAcesso.Utils.extrairDominio(url);
		return (ControlaAcesso.Utils.trim(dominioUrl) != "" && urlsLiberadas.indexOf(dominioUrl) >= 0);
	};
	
	this.queryStringLiberada = function(queryStringConfig) {
		
		var browser = new ControlaAcesso.Browser();
		
		if (!browser.existeQueryString()) {
			return false;
		}
		
		for(var i in queryStringConfig) {
			var object = queryStringConfig[i];
		   
			var liberaAcesso = false;

			for(var prop in object) {
				if(object.hasOwnProperty(prop)){
					var queryString = browser.getParameterByName(prop);
					
					if(queryString.toLowerCase() == object[prop].toLowerCase()) {
						liberaAcesso = true;
					} else {
						liberaAcesso = false;
						break;
					}
				}
		   }
		   
		   if (liberaAcesso) {
				return true;
			}
		}
		
		return false;
	};

	this.userAgentLiberado = function(userAgentAcesso, RegexUserAgentsLiberados) {
		var regexPattern = new RegExp(RegexUserAgentsLiberados);
		return (ControlaAcesso.Utils.trim(RegexUserAgentsLiberados) != "" && regexPattern.test(userAgentAcesso));
	};

	this.obterIdentificacaoRegistro = function(id, contexto) {
		return id + contexto;
	};

	this.existeRegistro = function(registro, idDoConteudo) {

		for ( var i = 0; i < registro.itens.length; i++) {
			if (registro.itens[i] == idDoConteudo) {
				return true;
			}
		}

		return false;
	};

	this.limiteAcessosAlcancado = function(registro, limiteAcessos) {

		return (limiteAcessos >= 0 && registro.itens.length >= limiteAcessos);
	};
	
	this.passouLimiteEnaoCompletouPaywall = function(registro) {
		
		try {
			var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length);
			
			if ("Paywall" == configEvento.nomeDoEvento) {
				
				var passouLimiteEnaoCompletouPaywall = registro.itens.length > ControlaAcesso.Configuracao.json.limiteMaximoAcesso && ControlaAcesso.Leitor.STATUS_PAYWALL_PASS != ControlaAcesso.Leitor.status() && ControlaAcesso.Leitor.STATUS_PAYWALL != ControlaAcesso.Leitor.status();
				
				return passouLimiteEnaoCompletouPaywall; 
				
			}
					
		} catch (e) {
			ControlaAcesso.Utils.log("Erro ao verificar se estorou limite acesso: " + e.message);
			return false;
		}
		
	};
	this.naoCompletouRegister = function(registro) {
        
        try {
        
            var cookieConf = ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.NOME_COOKIE_CONF);
            var cookieConfParsered = $.parseJSON(cookieConf);
                                
            var limiteRegister = cookieConfParsered.RegisterWall;
            var limitePaywall = cookieConfParsered.Paywall;
            
            var naoCompletouRegister = registro.itens.length < limitePaywall && registro.itens.length > limiteRegister && ControlaAcesso.Leitor.STATUS_REGISTER_PASS != ControlaAcesso.Leitor.status() && ControlaAcesso.Leitor.STATUS_REGISTER != ControlaAcesso.Leitor.status();
            
            return naoCompletouRegister;
         
         } catch (e) {
            ControlaAcesso.Utils.log("Erro ao verificar se nao completou register: " + e.message);
            return false;
        }   
	   
	};
	
	this.naoChegouNoLimiteMaximo = function(registro) {
		
		return ControlaAcesso.Configuracao.json.limiteMaximoAcesso > registro.itens.length;
	};
	
	this.logouNaGloboCom = function() {
		
		return ControlaAcesso.Cookies.obterValorCookie(ControlaAcesso.GLBID) != "";
	};
	
	this.redirecionar = function(url) {
		
		if (url.indexOf("://") < 0) {
			if (url.substring(0,1) != '/')  url = '/' + url;
			
			url = location.protocol + "//" + location.host + url;
		}

		window.location.href = url;
	};

	this.registrar = function(kwargs) {
		
		var idDoConteudo = this.obterIdentificacaoRegistro(kwargs.id, ControlaAcesso.Configuracao.json.identificadorDoProduto);
		
		var registro = ControlaAcesso.Model.carregar();
		var configEvento = ControlaAcesso.Model.obterConfiguracaoEventos(registro.itens.length);
		var naoCompletouRegisterVar = this.naoCompletouRegister(registro);
		if (naoCompletouRegisterVar) {
           configEvento = ControlaAcesso.Model.obtemEvento("RegisterWall");
        }
		var autorizacao = autorizacao;

		// Não realizar o registro, caso não esteja ligado
		if (!ControlaAcesso.Configuracao.json.ativado) {
			
			if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
			
			return null;
		}


		// Caso o user agent esteja na lista de useragents que nao contabilizam
		if (this.userAgentLiberado(navigator.userAgent,	ControlaAcesso.Configuracao.json.userAgentsLivreAcesso)) {
			
			if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
			
			return null;
		}
		
		if (ControlaAcesso.Erro.existe()) {
			
			if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
			
			return null;
		}
		
		if (kwargs.exigirLogin) {
			//Só redireciona para a url de login caso não seja uma querystringLiberada e não tenha url liberada e limite não foi alcançado e se não estiver logado na globo.com
			if (!this.logouNaGloboCom() && 
					!this.urlLiberada(document.referrer, configEvento.urlsLivreAcesso) && 
					!this.queryStringLiberada(ControlaAcesso.Configuracao.json.queryStringLiberada)) {
				this.redirecionar(ControlaAcesso.Configuracao.json.urlRedirecionamentoExigirLogin);
				return;
			} 
							
		}

		// Não realizar o registro, caso ele já exista no contexto
		if (this.existeRegistro(registro, idDoConteudo)) {
			
			if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
			
			if(kwargs.exibirBannerContador) kwargs.exibirBannerContador(configEvento, ControlaAcesso.Configuracao.json);
			
			return null;
		}
		
		
		// Atingiu o limite máximo de acesso?
		
		if (this.limiteAcessosAlcancado(registro, configEvento.limiteDeAcesso) || naoCompletouRegisterVar || this.passouLimiteEnaoCompletouPaywall(registro)) {
    		
			if (naoCompletouRegisterVar) {
               configEvento = ControlaAcesso.Model.obtemEvento("RegisterWall");
            }
			
			if (!configEvento.ativado) {
				
				if (this.naoChegouNoLimiteMaximo(registro)) {
					
					registro.adicionarConteudoVisualizado(idDoConteudo);
				}
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return;
			}
			
			if (configEvento.somenteContadorAtivado) {
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return;
			}
			
			// Evento não ativado, somente o contador ativado (barreira desabilitada) ou Já houve conversão
			if (registro.eventos[configEvento.nomeDoEvento].dtConv != null) {
				
				if (this.naoChegouNoLimiteMaximo(registro)) {
					
					registro.adicionarConteudoVisualizado(idDoConteudo, function() {
						if(kwargs.exibirBannerContador) kwargs.exibirBannerContador(configEvento, ControlaAcesso.Configuracao.json);
					});
				}
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return null;
			}
			
			if (kwargs.naoRedirecionar) {
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return null;
			}

			// Se a url origem está liberada, não realizar o bloqueio
			if (this.urlLiberada(document.referrer,	configEvento.urlsLivreAcesso)) {
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return null;
			}
			
			if (this.queryStringLiberada(ControlaAcesso.Configuracao.json.queryStringLiberada)) {
				
				if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
				
				return null;
			}
			
			var patrocinio = new ControlaAcesso.Patrocinio(configEvento);
			
			if (patrocinio.existeCortesia() && registro.eventos[configEvento.nomeDoEvento].dtExec != null) {
				return;
			}
			
			if (this.logouNaGloboCom()) {
				
				var core = this;
				
				new ControlaAcesso.AutorizaAcesso(configEvento, {
					
					autorizado : function(motivo, url, degustacao) {
						
						registro.inserirMotivo(motivo, configEvento);
						
						if (motivo.toLowerCase() == "indisponivel") {
							
							registro.atualizarDataDeExecucao(configEvento);
							ControlaAcesso.Erro.registrar("Servico de autorização de acesso está Indisponivel.", ControlaAcesso.Erro.SERVICO_INDISPONIVEL);
							
						} else {
							
							registro.atualizarDataDeConversao(configEvento);
						}
						
						if (core.naoChegouNoLimiteMaximo(registro)) {
							
							registro.adicionarConteudoVisualizado(idDoConteudo, function() {
								if(kwargs.exibirBannerContador) kwargs.exibirBannerContador(configEvento, ControlaAcesso.Configuracao.json);
							});
						}
						
						if(kwargs.aoCompletar) kwargs.aoCompletar(configEvento, degustacao);
						
						if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, {
							autorizadoNoServico : true  
						});
					},
					naoAutorizado : function(motivo, url) {
						
						registro.inserirMotivo(motivo, configEvento);
						
						registro.atualizarDataDeExecucao(configEvento);
						
						if (patrocinio.ativado()) {
							
							if (!patrocinio.existeCortesia()) {
								
								patrocinio.criarCortesia();
								
								if(kwargs.exibirPatrocinio) kwargs.exibirPatrocinio(configEvento);
							}
							
							return;
						}
						
						if (!url) {
							
							url = configEvento.urlDeRedirecionamento;
						} else {
							
							url += encodeURIComponent(location.href);
						}
						
						core.redirecionar(url);
					},
					comMensagem : function(resposta) {
						
						registro.inserirMotivo(resposta.motivo, configEvento);
						
						registro.atualizarDataDeExecucao(configEvento);
						
						if (resposta.autorizado) {
							
							registro.atualizarDataDeConversao(configEvento);
						}
						
						if (!resposta.autorizado && patrocinio.ativado()) {
							
							patrocinio.criarCortesia();
							
							if(kwargs.exibirPatrocinio) kwargs.exibirPatrocinio(configEvento);
							
							return;
						}
						
						
						kwargs.enviarMensagem(resposta, configEvento);
						
						if(kwargs.aoCompletar) kwargs.aoCompletar(configEvento);
					},
					error : function() {
						if(kwargs.aoAutorizar) kwargs.aoAutorizar(configEvento, autorizacao);
					}
					
				});
				
			} else {
				
				registro.atualizarDataDeExecucao(configEvento);
				
				this.redirecionar(configEvento.urlDeRedirecionamento);
			}
			
		} else {
			registro.adicionarConteudoVisualizado(idDoConteudo, function() {
				if(kwargs.exibirBannerContador) kwargs.exibirBannerContador(configEvento, ControlaAcesso.Configuracao.json);
			});
		}
	};
	
};

/**
 * Classe responsável pela recuperação de dados do browser do leitor.
 */
ControlaAcesso.Browser = function() {};

ControlaAcesso.Browser.prototype.queryString = function() {
	return window.location.search;
};

ControlaAcesso.Browser.prototype.existeQueryString = function() {
	return this.queryString().length > 3;
};

ControlaAcesso.Browser.prototype.getParameterByName = function(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(this.queryString());
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Método responsável pelo registro dos conteúdos.
 * 
 * @param kwargs conjunto de configurações:
 * 
 * <code>kwargs.id</code> Identificação única do conteúdo a ser registrado (Obrigatório).
 * <code>kwargs.nomeConfig</code> Nome da configuração que fica configurado nos properties do escenic (Opcional). Ex: "oglobo". 
 * <code>urlBaseConfig</code> Url de onde será obtido a configuração, essa informação é obrigatória para os produtos que não estiverem na plataforma escenic (Opcional). Ex: "http://oglobo.globo.com/";
 * <code>kwargs.naoRedirecionar</code> Indica para o controle de acesso que o conteúdo não deve ser redirecionado quando chegar no limite máximo (Opcional - por padrão é false).
 * <code>kwargs.exigirLogin</code> Indica para o controle de acesso que o conteúdo exige login (true ou false).
 * 
 */
ControlaAcesso.registrar = function(kwargs) {
	
	if (typeof kwargs == 'undefined') {
		
		throw new Error("Informe os argumentos para o registro.");
	}
	
	if (typeof kwargs.id == 'undefined') {
		
		throw new Error("Informe o id do conteúdo a ser registrado.");
	}
	
	if (typeof kwargs.nomeDoCookie != 'undefined') {
		
		ControlaAcesso.NOME_COOKIE = kwargs.nomeDoCookie;
	}

	this.iniciar = function() {
		try {
			
			new ControlaAcesso.Core().registrar(kwargs);
		} catch (e) {
			
			ControlaAcesso.Erro.registrar(e.message, ControlaAcesso.Erro.FALHA_AO_REGISTRAR_UM_CONTEUDO);
		}
	};
	
	if(ControlaAcesso.Cookies.obterValorCookie("t3st3pyig")) {
		kwargs.nomeConfig = "teste";
	}
		
	try {
		var executor = this;
		
		if (!ControlaAcesso.Utils.isNavegadorNativoAndroid()) {
			
			ControlaAcesso.Utils.detectPrivateMode(function(is_private) {
				ControlaAcesso.isPrivateMode = is_private;
				
				if (ControlaAcesso.isPrivateMode == true) {
					kwargs.nomeConfig = kwargs.nomeConfig + "_anonima";
				}
				
				ControlaAcesso.Configuracao.carregar(executor, kwargs.nomeConfig, kwargs.urlBaseConfig);				
			});
			
		} else {
			
			ControlaAcesso.Configuracao.carregar(executor, kwargs.nomeConfig, kwargs.urlBaseConfig);
			
		}
		
	} catch (e) {
		
		ControlaAcesso.Utils.log("Falha ao detectar janela anonima.");
		
		ControlaAcesso.Configuracao.carregar(executor, kwargs.nomeConfig, kwargs.urlBaseConfig);
		
	}
		
		
	
};

ControlaAcesso.SiteOferta = function(dominio) {
	
	if (!dominio) {
		
		throw new Error("Dominio não pode ser nulo, undefined ou vazio.");
	}
	
	var registro = $.parseJSON(ControlaAcesso.Cookies.obterValorCookie('infgw'));

	this.atualizarDataDeConversao = function() {
		
		registro.eventos.Paywall.dtConv = new Date();
		
		salvar();
	};
	
	this.inserirMotivo = function(motivo) {
	
		if (!motivo) {
			
			throw new Error("Motivo não pode ser nulo, undefined ou vazio.");
		}
		
		registro.eventos.Paywall.motivo = motivo;
		
		salvar();
	};
	
	function salvar() {
		
		ControlaAcesso.Cookies.escreverCookie(ControlaAcesso.NOME_COOKIE,
		ControlaAcesso.JSON.conveterParaJson(registro), {
			expires : ControlaAcesso.JSON.parsearDataFormatoJson(registro.dtExp),
			domain : dominio,
			path : "/"
		});
	};
	
};