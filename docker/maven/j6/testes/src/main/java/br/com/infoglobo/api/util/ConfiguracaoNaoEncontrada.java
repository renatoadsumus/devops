package br.com.infoglobo.api.util;

import static java.lang.String.format;
import br.com.infoglobo.commons.exceptions.InfogloboException;

public class ConfiguracaoNaoEncontrada extends InfogloboException {

	private static final long serialVersionUID = 1607160134185547720L;

	private String config;

	public ConfiguracaoNaoEncontrada(String config) {

		super(format("A configuracao [%s] nao foi encontrada.", config));

		this.config = config;
	}

	public String getConfig() {

		return config;
	}

}
