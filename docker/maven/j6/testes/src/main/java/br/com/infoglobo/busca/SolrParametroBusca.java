package br.com.infoglobo.busca;

/**
 * 
 * Classe
 *
 */
public class SolrParametroBusca extends ParametroBuscaAbstract {
	
	/** indice */
	private int indice;
	/** tipoConteudo */ 
	private String[] tipoConteudo = new String[0];
	/** instanciaConteudo */
	private boolean instanciaConteudo;
	
	
    /**
     * @return o valor do <i>field</i> '<b>carregaConteudo</b>'
     */
    public boolean isInstanciaConteudo() {
    
    	return instanciaConteudo;
    }

    /**
     * @param instanciaConteudo o objeto a ser setado em '<b>instanciaConteudo</b>'
     */
    public void setInstanciaConteudo(boolean instanciaConteudo) {
    
    	this.instanciaConteudo = instanciaConteudo;
    }

    /**
     * @return o valor do <i>field</i> '<b>indice</b>'
     */
    public int getIndice() {
    
    	return indice;
    }
	
    /**
     * @param indice o objeto a ser setado em '<b>indice</b>'
     */
    public void setIndice(int indice) {
    
    	this.indice = indice;
    }

	/**
	 * @return o valor do <i>field</i> '<b>tipoConteudo</b>'
	 */
	public String getStringTipoConteudo() {

		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < tipoConteudo.length; i++) {

			sb.append("contenttype:");
			sb.append(tipoConteudo[i]);

			if (tipoConteudo.length != i + 1) {
				sb.append(" OR ");
			}

		}

		return sb.toString();
	}

}
