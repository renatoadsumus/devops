package br.com.infoglobo.climatempo;

import java.util.List;

import br.com.infoglobo.previsaotempo.CidadeElement;
import br.com.infoglobo.previsaotempo.InfogloboPrevisaoTempoService;

/**
 * Classe usada pelos componentes das publicações que precisam acessar 
 * a previsao do tempo das cidades
 * 
 * @author ehenriques
 * @deprecated Utilizar a api de previsão do tempo. Mais detalhes consulte a documentação da API no site da plataforma
 */
@Deprecated
public class PrevisaoTempo {
	
	/** serviço do tempo **/
	private InfogloboPrevisaoTempoService tempoService;
	
	/**
	 * Retorna uma lista de cidades de uma reigão qualquer
	 * 
	 * @param nomeRegiao nome da regiao
	 * @return lista de cidades
	 */
	public List<String> getListaCidadesPorRegiao(String[] nomeRegiao) {
		return tempoService.getNomesCidades(nomeRegiao);
	}

	/**
	 * Retorna a previsao de uma cidade qualquer
	 * 
	 * @param paramNome nome da cidade
	 * @return previsao da cidade
	 */
	public CidadeElement getPrevisaoCidade(String paramNome) {
		return tempoService.getPrevisaoTempo(paramNome);
	}

	/**
	 * @return the tempoService
	 */
	public InfogloboPrevisaoTempoService getTempoService() {
		return tempoService;
	}

	/**
	 * @param tempoService the tempoService to set
	 */
	public void setTempoService(InfogloboPrevisaoTempoService tempoService) {
		this.tempoService = tempoService;
	}

}
