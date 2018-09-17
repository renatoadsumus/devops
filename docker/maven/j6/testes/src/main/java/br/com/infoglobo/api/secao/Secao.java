package br.com.infoglobo.api.secao;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import neo.xredsys.api.Section;

public class Secao implements Comparable<Secao> {

	private Section secao;

	private List<Secao> subSecoes;
	
	private BuscaSecaoConfig config;

	public Secao(Section secao, BuscaSecaoConfig config) {

		if (secao == null) {

			throw new IllegalArgumentException("Secao nao pode ser nula.");
		}

		this.secao = secao;
		this.config = config;
	}

	public int getId() {

		return secao.getId();
	}

	public String getUrl() {

		return secao.getUrl();
	}

	public String getNome() {

		return secao.getName();
	}

	public String getNomeUnico() {

		return secao.getUniqueName();
	}
	
	public Map<String, String> getParametros() {
		
		Map<String, String> parametros = new HashMap<String, String>(); 
		
		if (config.getParametros() == null || config.getParametros().length == 0) {
	        
			return parametros;
        }
		
		for (String param : config.getParametros()) {
			
			String paramParseado = param.replace(".", "_");
			
			parametros.put(paramParseado, secao.getParameter(param));	        
        }
		
		return parametros;
		
	}

	public void setSubSecoes(List<Secao> subSecoes) {

		this.subSecoes = subSecoes;
	}

	public List<Secao> getSubSecoes() {

		if (subSecoes != null) {

			Collections.sort(subSecoes);
		}

		return subSecoes;
	}

	@Override
	public int compareTo(Secao apiSecao) {

		return this.getNome().compareToIgnoreCase(apiSecao.getNome());
	}
}
