package br.com.infoglobo.taglib;

import static com.escenic.servlet.ApplicationBus.getApplicationBus;
import static org.apache.commons.lang.StringUtils.isEmpty;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import neo.nursery.GlobalBus;

import org.apache.commons.lang.StringUtils;

import com.escenic.servlet.ApplicationBus;

import br.com.infoglobo.common.InfogloboProperties;
import br.com.infoglobo.util.Publicacao;

/**
 * Taglib que define qual tipo de navegação o leitor irá visualizar de acordo com as seguintes regras:
 * 
 * <ul>
 * <li>
 * O varnish que identifica se o acesso ao site está sendo por um dispositivo móvel, caso seja, é direcionado para a
 * aplicação a url: http://extra.globo.com/?versao=mobi</li>
 * <li>
 * 
 * </li>
 * 
 * </ul>
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 * 
 */
public class DefineNavegacao extends TagSupport {

	/** Serialização padrão para classes. */
	private static final long serialVersionUID = -7027639052117956246L;

	/** Nome da query string que identifica a versão do site. */
	private static final String QUERY_STRING_VERSAO = "versao";

	private static final String QUERY_STRING_PREVIEW = "preview";

	/** Nome do cookie que identifica a navegação do site. */
	private static final String NOME_DO_COOKIE = "INFGMOBIVER";

	/** Valor da query string para mobi. */
	private static final String VERSAO_MOBI = "mobi";

	/** Nome do atributo que disponibilizará no request se é um dispositivo móvel que o leitor está acessando. */
	private static final String ATRIBUTO_PARA_DISPOSITIVO_MOVEL = "isMobileDevice";

	private Publicacao publicacao;

	@Override
	public int doStartTag() throws JspException {

		HttpServletRequest request = (HttpServletRequest) pageContext.getRequest();

		boolean mobiAtivado = VERSAO_MOBI.equals(request.getParameter(QUERY_STRING_VERSAO))
		        || VERSAO_MOBI.equals(request.getParameter(QUERY_STRING_PREVIEW));

		// Seta no request uma variável que será usada no site para identificar se é um mobi.
		if (mobiAtivado || contemCookie(request.getCookies(), VERSAO_MOBI)) {
			request.setAttribute(ATRIBUTO_PARA_DISPOSITIVO_MOVEL, true);
		} else {
			request.removeAttribute(ATRIBUTO_PARA_DISPOSITIVO_MOVEL);
		}
		return super.doStartTag();
	}

	/**
	 * @param array
	 *            com os cookies do site.
	 * @param nome
	 *            do cookie que será buscado.
	 * @return <code>true</code> se contém o cookie foi criado na página, caso contrário <code>false</code>.
	 */
	private boolean contemCookie(Cookie[] array, String nome) {

		if (array != null) {
			String nomePublicacao = getPublicacao().getNome();
			if (isEmpty(nomePublicacao)) {
				return false;
			}
			String nomeCookie = NOME_DO_COOKIE + "_" + nomePublicacao;
			for (Cookie cookie : array) {
				if (nomeCookie.equals(cookie.getName()) && nome.equals(cookie.getValue())) {
					return true;
				}
			}
		}
		return false;
	}

	public Publicacao getPublicacao() {

		Object publicacao = getApplicationBus(pageContext.getServletContext()).lookupSafe("/infoglobo/Publicacao");
		
		if (publicacao != null && publicacao instanceof Publicacao) {
			return (Publicacao) publicacao;
		}
		throw new RuntimeException("Erro ao recuperar a publicacao");
		
	}

	public void setPublicacao(Publicacao publicacao) {

		this.publicacao = publicacao;
	}

}