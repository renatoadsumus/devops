package br.com.infoglobo.api.util;

import static br.com.infoglobo.util.WebAppBusUtil.getWebappBus;
import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.isEmpty;
import static org.apache.commons.lang.StringUtils.isNotEmpty;
import static org.apache.commons.lang.StringUtils.trimToEmpty;
import neo.nursery.Bus;
import neo.nursery.BusException;

import org.apache.log4j.Logger;

public abstract class RecuperaConfiguracao {

	private static final Logger LOG = Logger.getLogger(RecuperaConfiguracao.class);

	private API api;

	private String nomeDoProduto;

	private String aplicacao;

	private String configuracao;

	private Bus bus;

	public enum API {

		SECAO("/infoglobo/api/secao/", "BuscaSecaoConfig"), CONTEUDO("/infoglobo/api/conteudo/", "ConfiguracaoDeBusca");

		private String configDir;

		private String nomeDaConfig;

		private API(String configDir, String nomeDaConfig) {

			this.configDir = configDir;
			this.nomeDaConfig = nomeDaConfig;
		}
	}

	public RecuperaConfiguracao(API api, String nomeDoProduto, String aplicacao, String configuracao) {

		this(api, nomeDoProduto, aplicacao);
		this.configuracao = configuracao;
	}

	public RecuperaConfiguracao(API api, String nomeDoProduto, String aplicacao) {

		this(api, nomeDoProduto);
		this.aplicacao = aplicacao;
	}

	public RecuperaConfiguracao(API api, String nomeDoProduto) {

		if (api == null) {

			throw new IllegalArgumentException("Por favor informe uma api SECAO ou CONTEUDO");
		}

		if (isEmpty(trimToEmpty(nomeDoProduto))) {

			throw new IllegalArgumentException("O nome do produto nao poder nulo.");
		}

		this.api = api;
		this.nomeDoProduto = nomeDoProduto;

		carregarBus();
	}

	private void carregarBus() {

		try {

			bus = getWebappBus(nomeDoProduto);
		} catch (BusException e) {

			LOG.error("Nao foi possivel carregar a instacia de bus para publicacao: " + nomeDoProduto, e);
			throw new RuntimeException(e);
		}
	}

	Bus getBus() {

		return bus;
	}

	public String getConfig() {

		if (isNotEmpty(configuracao)) {

			return getConfigComponenteParaProdutoEAppEConfig();
		}

		if (isNotEmpty(aplicacao)) {

			return getConfigComponenteParaProdutoEApp();
		}

		if (isNotEmpty(nomeDoProduto)) {

			return getConfigComponenteParaProduto();
		}

		return getConfigComponente();
	}

	private String getConfigComponenteParaProdutoEAppEConfig() {

		return api.configDir + nomeDoProduto + "/" + aplicacao + "/" + configuracao + "/" + api.nomeDaConfig;
	}

	private String getConfigComponenteParaProdutoEApp() {

		return api.configDir + nomeDoProduto + "/" + aplicacao + "/" + api.nomeDaConfig;
	}

	private String getConfigComponenteParaProduto() {

		return api.configDir + nomeDoProduto + "/" + api.nomeDaConfig;
	}

	private String getConfigComponente() {

		return api.configDir + api.nomeDaConfig;
	}

	public String getNomeDoProduto() {

		return nomeDoProduto;
	}
	
    public String getAplicacao() {
    
    	return aplicacao;
    }
}
