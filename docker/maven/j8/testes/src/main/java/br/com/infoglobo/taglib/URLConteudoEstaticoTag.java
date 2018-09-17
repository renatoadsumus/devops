package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import neo.nursery.GlobalBus;
import br.com.infoglobo.common.InfogloboProperties;

/**
 * Tag for retrieving totals statistics from the query service, caching them as
 * necessary.
 * 
 * @author mandrada
 * 
 */
public class URLConteudoEstaticoTag extends TagSupport {
	/** Serial version */
	private static final long serialVersionUID = 7547735056975520791L;
	
	/** Nome do arquivo de propriedades que contém a URL de conteúdo estático */
	private String arquivoProperties;
	
	/** Nome da propriedade que contém a URL de conteúdo estático */
	private String propriedadeUrl;
	
	@Override
	public int doEndTag() throws JspException {
		InfogloboProperties properties = (InfogloboProperties) GlobalBus.lookupSafe(arquivoProperties);
		
		if (properties == null) {
			return EVAL_PAGE;
		}
		
		String urlEstatica = properties.getProperty(propriedadeUrl);
		
		if (urlEstatica == null) {
			return EVAL_PAGE;
		}
		
		this.pageContext.setAttribute(getId(), urlEstatica);
		
		return EVAL_PAGE;
	}

	/**
	 * @return the arquivoProperties
	 */
	public String getArquivoProperties() {
		return arquivoProperties;
	}

	/**
	 * @param arquivoProperties the arquivoProperties to set
	 */
	public void setArquivoProperties(String arquivoProperties) {
		this.arquivoProperties = arquivoProperties;
	}

	/**
	 * @return the propriedadeUrl
	 */
	public String getPropriedadeUrl() {
		return propriedadeUrl;
	}

	/**
	 * @param propriedadeUrl the propriedadeUrl to set
	 */
	public void setPropriedadeUrl(String propriedadeUrl) {
		this.propriedadeUrl = propriedadeUrl;
	}
}