package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.lang.StringUtils;

import br.com.infoglobo.statistics.InfogloboStatistics;

import com.escenic.servlet.ApplicationBus;

/**
 * Base class for Statistics Tags in Infoglobo Escenic publications
 * 
 * @author mandrada
 * 
 */
public abstract class InfogloboStatisticsBaseTag extends TagSupport {

	/** Serial Version */
	private static final long serialVersionUID = -3046602044057823670L;

	@Override
	public int doStartTag() throws JspException {
		return SKIP_BODY;
	}

	/**
	 * Gets the instance of class InfogloboStatistics from the GlobalBus to be used by the application
	 *  
	 * @return InfogloboStatistics from the GlobalBus
	 */
	protected InfogloboStatistics getInfogloboStatistics() {
		return (InfogloboStatistics) ApplicationBus.getApplicationBus(pageContext.getServletContext()).lookupSafe(
				"/infoglobo/InfogloboStatistics");
	}

	@Override
	public abstract int doEndTag() throws JspException;

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
			return StringUtils.split(replaceAllSpaces(((String) field)), ",");
		}

		if (field instanceof String[]) {
			String[] incomingArray = (String[]) field;

			for (int i = 0; i < incomingArray.length; i++) {
				incomingArray[i] = replaceAllSpaces(incomingArray[i]);
			}

			return incomingArray;
		}

		return null;
	}

	/**
	 * Replace all spaces from text to "".
	 *  
	 * @param text Text to be handled
	 * @return Text without spaces within
	 */
	private String replaceAllSpaces(String text) {
		if (text == null) {
			return text;
		}

		return text.replaceAll("\\s*", "").replaceAll("\\n*", "");
	}
}