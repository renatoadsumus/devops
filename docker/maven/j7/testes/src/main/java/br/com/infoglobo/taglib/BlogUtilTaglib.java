/**
 *
 */
package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import neo.nursery.GlobalBus;

import org.apache.log4j.Logger;

import br.com.infoglobo.common.InfogloboProperties;

/**
 * @author Marcio Pati e Flavio Trezena
 */
public class BlogUtilTaglib extends TagSupport {

	/** Serial version */
    private static final long serialVersionUID = -5499751146068688087L;

    /** Nome do arquivo de propriedades para instanciar InfogloboProperties */
    private static final String INFOGLOBO_PROPERTIES = "/Infoglobo";
    /** Propriedade que define se será usado ou não captcha na tela de login de blog */
    private static final String PROPRIEDADE_USE_CAPTCHA = "blog.login.use.captcha";
    /** Propriedade que define se será usado ou não SSL na tela de login de blog */
    private static final String PROPRIEDADE_USE_SSL = "blog.login.use.ssl";

    /** Separador entre o protocolo da URL e o caminho a ser utilizado */
    private static final String SEPARADOR_PROTOCOLO = "://";
    /** Protocolo HTTP */
    private static final String PROTOCOLO_HTTP = "http";
    /** Protocolo HTTPS */
    private static final String PROTOCOLO_HTTPS = "https";
    
    /** Utilizado para realizar logs no sistema */
    private final transient Logger logger = Logger.getLogger(BlogUtilTaglib.class);

    /** Propriedades da aplicação */
    private transient InfogloboProperties properties = (InfogloboProperties) GlobalBus.lookupSafe(INFOGLOBO_PROPERTIES); 
    
	@Override
    public int doStartTag() throws JspException {
    	String protocolo = PROTOCOLO_HTTP;
    	
    	if (isSsl()) {
    		protocolo = PROTOCOLO_HTTPS;
    	}
    	
    	String server = pageContext.getRequest().getServerName();
    	String context = pageContext.getServletContext().getContextPath(); //retorna:  Extra/
    	
    	//monta o path de acesso 
    	String urlServlet = protocolo.concat(SEPARADOR_PROTOCOLO).concat(server).concat(context);
    	logger.debug(urlServlet);

    	// Seta a variável useCpatcha no contexto da página para informar se será ou não usado captcha
		pageContext.setAttribute("useCaptcha", new Boolean(properties.getProperty(PROPRIEDADE_USE_CAPTCHA)));
		
    	// Seta na variável "path" a URL para gerar a imagem do captcha
		pageContext.setAttribute("path", urlServlet);

		return EVAL_PAGE;
    }

	/**
	 * @return the ssl
	 */
	private boolean isSsl() {
		return new Boolean(properties.getProperty(PROPRIEDADE_USE_SSL)).booleanValue();
	}
}
