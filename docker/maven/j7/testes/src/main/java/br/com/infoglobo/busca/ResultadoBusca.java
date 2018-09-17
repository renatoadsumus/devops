package br.com.infoglobo.busca;

import java.util.List;

import neo.xredsys.presentation.PresentationArticle;

/**
 * Classe retorna um resultado da busca no solr.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 *
 */
public class ResultadoBusca {

	/** qtdResultado */
	private long qtdResultado;
	/** ids */
	private List<Integer> ids;
	/** listaConteudo */
	private List<PresentationArticle> listaConteudo;
	
    /**
     * @return o valor do <i>field</i> '<b>qtdResultado</b>'
     */
    public long getQtdResultado() {
    
    	return qtdResultado;
    }
	
    /**
     * @param qtdResultado o objeto a ser setado em '<b>qtdResultado</b>'
     */
    public void setQtdResultado(long qtdResultado) {
    
    	this.qtdResultado = qtdResultado;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>ids</b>'
     */
    public List<Integer> getIds() {
    
    	return ids;
    }
	
    /**
     * @param ids o objeto a ser setado em '<b>ids</b>'
     */
    public void setIds(List<Integer> ids) {
    
    	this.ids = ids;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>listaConteudo</b>'
     */
    public List<PresentationArticle> getListaConteudo() {
    
    	return listaConteudo;
    }

	
    /**
     * @param listaConteudo o objeto a ser setado em '<b>listaConteudo</b>'
     */
    public void setListaConteudo(List<PresentationArticle> listaConteudo) {
    
    	this.listaConteudo = listaConteudo;
    }


}
