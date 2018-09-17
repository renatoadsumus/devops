package br.com.infoglobo.api.secao;

import java.util.HashSet;
import java.util.Set;

public class BuscaSecaoConfig {

	private static final int NIVEL_MAXIMO_PADRAO = 3;

	private int nivelMaximo = NIVEL_MAXIMO_PADRAO;

	private String[] camposDeExibicaoPadrao = {"*"};

	private boolean ignoraTopico = true;

	private boolean ignoraBlog = true;

	private Set<String> secoesIgnoradas = new HashSet<String>();

	private String[] recuperaAsSecoesAPartirDe;

	private String[] ignoraAsSecoes;

	private String[] parametros;

	private boolean ordenar = true;

	public String[] getRecuperaAsSecoesAPartirDe() {

		return recuperaAsSecoesAPartirDe;
	}

	public void setRecuperaAsSecoesAPartirDe(String[] recuperaAsSecoesAPartirDe) {

		this.recuperaAsSecoesAPartirDe = recuperaAsSecoesAPartirDe;
	}

	Set<String> getSecoesIgnoradas() {

		return secoesIgnoradas;
	}

	public String[] getIgnoraAsSecoes() {

		return ignoraAsSecoes;
	}

	public void setIgnoraAsSecoes(String[] ignoraAsSecoes) {

		if (ignoraAsSecoes != null) {

			secoesIgnoradas.clear();

			for (String uniqueName : ignoraAsSecoes) {

				secoesIgnoradas.add(uniqueName);
			}
		}

		this.ignoraAsSecoes = ignoraAsSecoes;
	}

	public int getNivelMaximo() {

		return nivelMaximo;
	}

	public void setNivelMaximo(int nivelMaximo) {

		this.nivelMaximo = nivelMaximo;
	}

	public boolean isIgnoraTopico() {

		return ignoraTopico;
	}

	public void setIgnoraTopico(boolean ignoraTopico) {

		this.ignoraTopico = ignoraTopico;
	}

	public boolean isIgnoraBlog() {

		return ignoraBlog;
	}

	public void setIgnoraBlog(boolean ignoraBlog) {

		this.ignoraBlog = ignoraBlog;
	}

	public String[] getCamposDeExibicaoPadrao() {

		return camposDeExibicaoPadrao;
	}

	public void setCamposDeExibicaoPadrao(String[] camposDeExibicaoPadrao) {

		this.camposDeExibicaoPadrao = camposDeExibicaoPadrao;
	}

	public String[] getParametros() {

		return parametros;
	}

	public void setParametros(String[] parametros) {

		this.parametros = parametros;
	}

	public boolean isOrdenar() {

		return ordenar;
	}

	public void setOrdenar(boolean ordenar) {

		this.ordenar = ordenar;
	}

}
