package br.com.infoglobo.navegacao;

import static org.apache.commons.lang.StringUtils.isEmpty;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

public class PreferenciaBuilder {

	private Map<String, String> preferencias;

	private String serverName;

	private String preview;

	private String dominioDoCookie;

	public void setPreferencias(Map<String, String> preferencias) {
		this.preferencias = preferencias;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	public void setPreview(String preview) {
		this.preview = preview;
	}

	public void setDominioDoCookie(String dominioDoCookie) {
		this.dominioDoCookie = dominioDoCookie;
	}

	public Map<String, Object> construir() {

		validarConstrucao();

		Map<String, Object> versoes = new HashMap<String, Object>();

		for (Entry<String, String> versao : preferencias.entrySet()) {

			versoes.put(versao.getKey(), new Versao(versao.getKey(), versao.getValue()));
		}

		versoes.put("dominioDoCookie", dominioDoCookie);

		return versoes;
	}

	private void validarConstrucao() {

		if (preferencias == null) {

			throw new IllegalArgumentException("Voce deve informar os nomes e a urls das versoes. Nao vou construir a preferencia");
		}

		if (isEmpty(serverName)) {

			throw new IllegalArgumentException("O serverName da requisicao nao pode ser nula ou vazia. Nao vou construir a preferencia");
		}

		if (isEmpty(dominioDoCookie)) {

			throw new IllegalArgumentException("Voce nao setou o dominio do cookie. Nao vou construir a preferencia.");
		}
	}

	public class Versao {

		private String dominio;

		private String nome;

		public Versao(String nome, String dominio) {

			this.dominio = dominio;
			this.nome = nome;
		}

		public boolean isAtivo() {

			if (nome.equalsIgnoreCase(preview)) {

				return true;
			}

			return serverName.equalsIgnoreCase(dominio);
		}

		public String getDominio() {

			return dominio;
		}

		public String getNome() {

			return nome;
		}
	}

}
