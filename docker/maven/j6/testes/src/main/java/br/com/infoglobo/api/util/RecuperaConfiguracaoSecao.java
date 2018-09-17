package br.com.infoglobo.api.util;

import static br.com.infoglobo.api.util.RecuperaConfiguracao.API.SECAO;
import neo.nursery.BusException;

import org.apache.log4j.Logger;

import br.com.infoglobo.api.secao.BuscaSecaoConfig;

public class RecuperaConfiguracaoSecao extends RecuperaConfiguracao {

	private static final Logger LOG = Logger.getLogger(RecuperaConfiguracaoSecao.class);

	public RecuperaConfiguracaoSecao(String nomeDoProduto) {

		super(SECAO, nomeDoProduto);
	}

	public RecuperaConfiguracaoSecao(String nomeDoProduto, String aplicacao, String configuracao) {

		super(SECAO, nomeDoProduto, aplicacao, configuracao);
	}

	public RecuperaConfiguracaoSecao(String nomeDoProduto, String aplicacao) {

		super(SECAO, nomeDoProduto, aplicacao);
	}

	public BuscaSecaoConfig config() throws ConfiguracaoNaoEncontrada {

		BuscaSecaoConfig config = buscaApiConfig(getConfig());

		if (config == null) {

			throw new ConfiguracaoNaoEncontrada(getConfig());
		}

		return config;
	}

	private BuscaSecaoConfig buscaApiConfig(String nomeDoComponente) {

		try {
			return (BuscaSecaoConfig) getBus().lookup(nomeDoComponente);
		} catch (BusException e) {

			LOG.trace("Nao foi possivel carregar o componente: " + nomeDoComponente, e);
		}
		return null;
	}

}
