package br.com.infoglobo.busca;

import static org.apache.commons.lang.StringUtils.trimToEmpty;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 *
 */
@Deprecated
public class EscenicParametroBusca extends ParametroBuscaAbstract {
	
	/** Pattern padrão de data para busca no escenic. */
	private static final String PATTERN_DE_DATA_ESCENIC = "yyyy-MM-dd HH:mm";
	/** idPublicacao */
	private int idPublicacao;
	/** idsSecao */
	private int[] idsSecao;
	/** dataInicial */
	private Date dataInicial;
	/** dataFinal */
	private Date dataFinal;
	/** todoConteudo */
	private Boolean todoConteudo;
	/** apenasSecaoPrincipal */
	private Boolean apenasSecaoPrincipal;
	/** somentePublicados */
	private Boolean somentePublicados;
	/** incluirSubSecoes */
	private Boolean incluirSubSecoes;
	
	@Override
	public String getBusca() {
	
	    return trimToEmpty(super.getBusca());
	}

	/**
	 * 
	 * @return se a ordem de exibição é <code>true</code> para descendente e <code>false</code> para ascendente. Valor
	 *         padrão <code>true</code>
	 */
	public boolean isDescendente() {
		if ("asc".equalsIgnoreCase(getOrdem())) {
	        return false;
        }
		return true;
	}

    /**
     * @return o valor do <i>field</i> '<b>idsSecao</b>'
     */
    public int[] getIdsSecao() {
    
    	return idsSecao;
    }
	
    /**
     * @param idsSecao o objeto a ser setado em '<b>idsSecao</b>'
     */
    public void setIdsSecao(int... idsSecao) {
    
    	this.idsSecao = idsSecao;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>dataInicial</b>'
     */
    public String getDataInicial() {
    	
    	if (dataInicial != null) {
    		SimpleDateFormat df = new SimpleDateFormat(PATTERN_DE_DATA_ESCENIC);
    		
    		return df.format(dataInicial);
        }
    
    	return "";
    }
	
    /**
     * @param dataInicial o objeto a ser setado em '<b>dataInicial</b>'
     */
    public void setDataInicial(Date dataInicial) {
    
    	this.dataInicial = dataInicial;
    }
	
    /**
     * @return o valor do <i>field</i> '<b>dataFinal</b>'
     */
    public String getDataFinal() {
    
    	if (dataFinal != null) {
    		SimpleDateFormat df = new SimpleDateFormat(PATTERN_DE_DATA_ESCENIC);
    		
    		return df.format(dataFinal);
        }
    
    	return "";
    }

    /**
     * @param dataFinal o objeto a ser setado em '<b>dataFinal</b>'
     */
    public void setDataFinal(Date dataFinal) {
    
    	this.dataFinal = dataFinal;
    }
	
	
    /**
     * @return o valor do <i>field</i> '<b>idPublicacao</b>'
     */
    public int getIdPublicacao() {
    
    	return idPublicacao;
    }

	
    /**
     * @param idPublicacao o objeto a ser setado em '<b>idPublicacao</b>'
     */
    public void setIdPublicacao(int idPublicacao) {
    
    	this.idPublicacao = idPublicacao;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>todoConteudo</b>', Caso seja nulo o valor padrão será: false.
     */
    public boolean isTodoConteudo() {
    	
    	if (todoConteudo == null) {
	        return false;
        }
    
    	return todoConteudo;
    }

	
    /**
     * @param todoConteudo o objeto a ser setado em '<b>todoConteudo</b>', Caso seja nulo o valor padrão será: false.
     */
    public void setTodoConteudo(Boolean todoConteudo) {
    
    	this.todoConteudo = todoConteudo;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>apenasSecaoPrincipal</b>', Caso seja nulo o valor padrão será: false.
     */
    public boolean isApenasSecaoPrincipal() {
    	
    	if (apenasSecaoPrincipal == null) {
	        return false;
        }
    
    	return apenasSecaoPrincipal;
    }

	
    /**
     * @param apenasSecaoPrincipal o objeto a ser setado em '<b>apenasSecaoPrincipal</b>', Caso seja nulo o valor padrão será: false.
     */
    public void setApenasSecaoPrincipal(Boolean apenasSecaoPrincipal) {
    
    	this.apenasSecaoPrincipal = apenasSecaoPrincipal;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>somentePublicados</b>', Caso seja nulo o valor padrão será: true.
     */
    public boolean isSomentePublicados() {
    	
    	if (somentePublicados == null) {
	        return true;
        }
    
    	return somentePublicados;
    }

	
    /**
     * @param somentePublicados o objeto a ser setado em '<b>somentePublicados</b>', Caso seja nulo o valor padrão será: true.
     */
    public void setSomentePublicados(Boolean somentePublicados) {
    
    	this.somentePublicados = somentePublicados;
    }

	
    /**
     * @return o valor do <i>field</i> '<b>incluirSubSecoes</b>', Caso seja nulo o valor padrão será: true.
     */
    public boolean isIncluirSubSecoes() {
    	
    	if (incluirSubSecoes == null) {
	        return true;
        }
    
    	return incluirSubSecoes;
    }

	
    /**
     * @param incluirSubSecoes o objeto a ser setado em '<b>incluirSubSecoes</b>', Caso seja nulo o valor padrão será: true.
     */
    public void setIncluirSubSecoes(Boolean incluirSubSecoes) {
    
    	this.incluirSubSecoes = incluirSubSecoes;
    }

}
