package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.lang.StringUtils;

import br.com.infoglobo.climatempo.PrevisaoTempo;

import com.escenic.servlet.ApplicationBus;

/**
 * Classe básica para as tags do Climatempo (Previsão do tempo)
 * 
 * @author ehenriques
 * @deprecated Utilizar a api de previsão do tempo. Mais detalhes consulte a documentação da API no site da plataforma
 */
@Deprecated
public abstract class ClimatempoBaseTag extends TagSupport {

	/** serial id */
	private static final long serialVersionUID = -2376041273551053589L;
	
	@Override
	public int doStartTag() throws JspException {
		return SKIP_BODY;
	}
	
	@Override
	public abstract int doEndTag() throws JspException;
	
	
	/**
	 * Gets the instance of class PrevisaoTempo from the GlobalBus to be used by the application
	 *  
	 * @return PrevisaoTempo from the GlobalBus
	 */
	protected PrevisaoTempo getPrevisaoTempo() {
		return (PrevisaoTempo) ApplicationBus.getApplicationBus(pageContext.getServletContext()).lookupSafe(
				"/infoglobo/PrevisaoTempo");
	}
	
	/**
	 * Returns a String Array out of a String of comma-separated values, removing existing spaces inside the String.
	 * If the parameter "field" is a String Array already, simply returns it, removing existing spaces from each element.
	 * 
	 * @param field String or String Array being handled
	 * @return String or String Array converted to a String Array without spaces within the contents of its elements
	 */
	protected String[] getStringArray(Object field) {
		if (field == null) {
			return null;
		}

		if (field instanceof String) {
			return StringUtils.split(StringUtils.trim(((String) field)), ",");
		}

		if (field instanceof String[]) {
			String[] incomingArray = (String[]) field;

			for (int i = 0; i < incomingArray.length; i++) {
				incomingArray[i] = StringUtils.trim(incomingArray[i]);
			}

			return incomingArray;
		}

		return null;
	}


}
