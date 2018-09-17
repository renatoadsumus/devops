package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.lang.StringUtils;

import br.com.infoglobo.statistics.InfogloboStatistics;

import com.escenic.forum.presentation.PresentationManager;
import com.escenic.servlet.ApplicationBus;

/**
 * Base class for Statistics Tags in Infoglobo Escenic publications
 * 
 * @author mandrada
 * 
 */
public abstract class CommunityEngineBaseTag extends TagSupport {

	/** Serial version */
	private static final long serialVersionUID = -433243765145795159L;

	@Override
	public int doStartTag() throws JspException {
		return SKIP_BODY;
	}

	/**
	 * Gets the instance of class InfogloboStatistics from the GlobalBus to be used by the application
	 *  
	 * @return InfogloboStatistics from the GlobalBus
	 */
	protected PresentationManager getPresentationManager() {
		return (PresentationManager) ApplicationBus.getApplicationBus(pageContext.getServletContext()).lookupSafe(
				"/com/escenic/forum/presentation/PresentationManager");
	}

	@Override
	public abstract int doEndTag() throws JspException;

}