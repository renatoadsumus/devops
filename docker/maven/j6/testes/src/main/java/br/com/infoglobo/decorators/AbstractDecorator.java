package br.com.infoglobo.decorators;

import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.PageContext;

import neo.xredsys.api.Section;
import neo.xredsys.presentation.PresentationArticle;
import neo.xredsys.presentation.PresentationArticleDecorator;

import org.apache.commons.lang.math.NumberUtils;

/**
 * Classe abstrata para os decoradores
 * 
 * @author ehenriques
 * 
 */
public class AbstractDecorator extends PresentationArticleDecorator implements Serializable {

	/**
	 * Serialização padrão da classe.
	 */
	private static final long serialVersionUID = -7626803234071697044L;

	/** Nome do status de pré visualização. */
	private static final String STATUS_PRE_VISUALIZACAO = "preview";

	/** Nome da seção principal */
	public static final String SECAO_PRINCIPAL = "ece_frontpage";

	/**
	 * 
	 */
	protected boolean ehHtmlPreview = false;

	/**
	 * contexto da página
	 */
	private PageContext pageContext = null;

	/**
	 * Default constructor.
	 * 
	 * @param pa
	 *            Pesentation article.
	 */
	public AbstractDecorator(PresentationArticle pa) {

		super(pa);
	}

	/**
	 * @return Getter para pageContext
	 */
	public PageContext getPageContext() {

		return pageContext;
	}

	/**
	 * Setter para pageContext
	 * 
	 * @param pageContext
	 *            novo valor
	 */
	public void setPageContext(PageContext pageContext) {

		this.pageContext = pageContext;
	}

	/**
	 * Retorna um campo do content-type.
	 * 
	 * @param field
	 *            campo do content-type.
	 * @return Objeto encontrado.
	 */
	public Object getField(String field) {

		return getFields().get(field).getValue();
	}

	/**
	 * Retorna a seção principal (root) do sistema.
	 * 
	 * @return Seção root.
	 */
	public Section getSecaoPrincipal() {

		return getSecaoPrincipal(getHomeSection());
	}

	/**
	 * Pega recursivamente a seção principal (root).
	 * 
	 * @param section
	 *            Seção filha onde iniciará a recursividade.
	 * @return Seção root.
	 */
	protected Section getSecaoPrincipal(Section section) {

		if (section.getParent() == null) {
			return section;
		}
		return getSecaoPrincipal(section.getParent());
	}

	/**
	 * Retorna a seção atual do leitor no site.
	 * 
	 * @return retorna a seção atual.
	 */
	public Section getSecaoCorrente() {

		if (getRequest() == null) {
			return null;
		}

		return (Section) getRequest().getAttribute("section");
	}

	/**
	 * 
	 * @param pageContext
	 *            Contexto da página corrente
	 * @return Section
	 */
	public static Section getSecaoCorrente(PageContext pageContext) {

		if (pageContext == null) {
			return null;
		}

		return (Section) pageContext.getRequest().getAttribute("section");
	}

	/**
	 * @return HttpServletRequest
	 */
	public HttpServletRequest getRequest() {

		if (getPageContext() == null) {
			return null;
		}

		return (HttpServletRequest) getPageContext().getRequest();
	}

	/**
	 * @return <code>true</code> se o que está sendo renderizado é um preview, caso contrário será <code>false</code>.
	 */
	public boolean ePreview() {

		return STATUS_PRE_VISUALIZACAO.equals(getStateName());
	}

	/**
	 * Utilize o método <code>ePreview</code>
	 * 
	 * @return true|false
	 */
	@Deprecated
	public boolean isHtmlPreview() {

		if (getRequest() != null) {
			String valorToken = getRequest().getParameter("token");
			int numero = NumberUtils.toInt(valorToken, 0);
			ehHtmlPreview = (numero != 0 && getRequest().getParameterMap().size() == 1);
		}

		return ehHtmlPreview;
	}
}
