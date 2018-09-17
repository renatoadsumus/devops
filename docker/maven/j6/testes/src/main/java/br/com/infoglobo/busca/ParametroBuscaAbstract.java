package br.com.infoglobo.busca;

import neo.xredsys.presentation.PresentationLoader;

import org.apache.commons.lang.StringUtils;

/**
 * Classe abstrata de parametros de busca.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 *
 */
@Deprecated
public abstract class ParametroBuscaAbstract {
	
	/** Campo de ordenação padrão da busca. */
	private static final String CAMPO_DE_ORDENACAO_PADRAO = "publishDate";
	/** Ordenação padrão da busca*/
	private static final String ORDENACAO_PADRAO = "desc";
	/** presentationLoader */ 
	private PresentationLoader presentationLoader;
	/** busca */
	private String busca;
	/** qtdElementos */
	private int qtdElementos;
	/** campoOrdenacao */ 
	private String campoOrdenacao;
	/** ordem */
	private String ordem;
	/** nomePublicacao */
	private String nomePublicacao;
	/** tipoConteudo */
	private String[] tipoConteudo;
	
    /**
     * @return o valor do <i>field</i> '<b>busca</b>'
     */
    public String getBusca() {
    
    	return busca;
    }
	
    /**
     * @param busca o objeto a ser setado em '<b>busca</b>'
     */
    public void setBusca(String busca) {
    
    	this.busca = busca;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>qtdElementos</b>'
     */
    public int getQtdElementos() {
    
    	return qtdElementos;
    }
	
    /**
     * Informa a quantidade máxima de elementos para retornar. Se for -1 
     * retornarão todos os elementos que atendam à query.
     * 
     * @param qtdElementos o objeto a ser setado em '<b>qtdElementos</b>'
     */
    public void setQtdElementos(int qtdElementos) {
    
    	this.qtdElementos = qtdElementos;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>campoOrdenacao</b>'
     */
    public String getCampoOrdenacao() {
    
    	return StringUtils.defaultIfEmpty(campoOrdenacao, CAMPO_DE_ORDENACAO_PADRAO);
    }
	
    /**
     * @param campoOrdenacao o objeto a ser setado em '<b>campoOrdenacao</b>', caso seja nulo, será retornado "publishDate".
     */
    public void setCampoOrdenacao(String campoOrdenacao) {
    
    	this.campoOrdenacao = campoOrdenacao;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>ordem</b>'
     */
	public String getOrdem() {

		return StringUtils.defaultIfEmpty(ordem, ORDENACAO_PADRAO);
    }
	
	/**
	 * @param ordem
	 *            o objeto a ser setado em '<b>ordem</b>', asc - para ascendente, desc - para descendente. Caso seja
	 *            nulo, será retornado "desc".
	 */
    public void setOrdem(String ordem) {
    
    	this.ordem = ordem;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>publicacao</b>'
     */
    public String getNomePublicacao() {
    
    	return StringUtils.trimToEmpty(nomePublicacao);
    }
	
    /**
     * @param nomePublicacao o objeto a ser setado em '<b>nomePublicacao</b>'
     */
    public void setNomePublicacao(String nomePublicacao) {
    
    	this.nomePublicacao = nomePublicacao;
    }

	/**
	 * @return o valor do <i>field</i> '<b>tipoConteudo</b>'
	 */
	public String[] getTipoConteudo() {

		return tipoConteudo;
	}

    /**
     * @param tipoConteudo o objeto a ser setado em '<b>tipoConteudo</b>'
     */
    public void setTipoConteudo(String... tipoConteudo) {
    
    	this.tipoConteudo = tipoConteudo;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>presentationLoader</b>'
     */
    public PresentationLoader getPresentationLoader() {
    
    	return presentationLoader;
    }

	
    /**
     * @param presentationLoader o objeto a ser setado em '<b>presentationLoader</b>'
     */
    public void setPresentationLoader(PresentationLoader presentationLoader) {
    
    	this.presentationLoader = presentationLoader;
    }


}
