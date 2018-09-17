package br.com.infoglobo.servlets;

import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.isEmpty;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.Publication;

import org.apache.log4j.Logger;

import br.com.infoglobo.common.InfogloboProperties;
import br.com.infoglobo.util.EscenicUtil;
import br.com.infoglobo.util.Publicacao;

import com.escenic.presentation.servlet.GenericProcessor;

/**
 * Filtro para tratamento para detecção e redirect de acordo com a versão do site: mobi ou web. 
 * @author Célula Plataforma Digital
 *
 */
public class SiteVersionRedirectProcessor extends GenericProcessor {

	private static final Logger LOG = Logger.getLogger(SiteVersionRedirectProcessor.class);
	
	private static final String VERSAO_SITE_COOKIE = "INFGMOBIVER";
	
	private static final String VERSAO_MOBILE = "mobi";
	private static final String VERSAO_WEB = "web";
	
	/** Data de expiração por mês em segundos. */ 
	private static final int EXPIRACAO_MENSAL_EM_SEGUNDOS = 30 * 24 * 60 * 60;
	
	private static final String PROPRIEDADE_DOMINIO = "mobi.cookie.dominio";
	
	private static final String PROPRIEDADE_URL_MOBI = "mobiUrl";
	
	/** Dominio padrão do cookie. */
	private static final String DOMINIO_PADRAO = ".globo.com";
		
	private static final String PARAMETRO_VERSAO = "versao";
	
	private static final String ATTRIBUTO_NOME_PUBLICACAO = "com.escenic.publication.name";
	
	private InfogloboProperties properties;
	
	private Publicacao publicacao;
		
	/**
	 * Metódo hook para tratamento do filtro
	 */
	@Override
	public boolean doBefore(ServletContext pContext, ServletRequest pRequest, ServletResponse pResponse) throws ServletException,
	        IOException {
		HttpServletRequest request = (HttpServletRequest) pRequest;
		HttpServletResponse response = (HttpServletResponse) pResponse;
		
		LOG.debug(format("[doBefore] URL acessada:[%s?%s]", request.getRequestURL(), request.getQueryString()));
		
		if (!temCookieMobi(request) && temParametroMobi(request) 
				&& publicacao != null && !isEmpty(publicacao.getNome())) {
			LOG.debug("[doBefore] Detectado redirect para versão mobi");
			criarCookie(response, VERSAO_MOBILE, publicacao.getNome());
			redirecionaResposta(urlVersaoMobi(request), response);
			return false;
		}
		
		if (!temCookieWeb(request) && temParametroWeb(request) && !isEmpty(publicacao.getNome())) {
			LOG.debug("[doBefore] Detectado redirect para versão web");
			criarCookie(response, VERSAO_WEB, publicacao.getNome());
			redirecionaResposta(urlVersaoWeb(request), response);
			return false;
		}
		
		LOG.debug("[doBefore] redirect não foi detectado");
	    return true;
	}

	/**
	 * Verifica se existe parâmetro (query string) mobi na requisição
	 * @param request
	 * @return true caso exista e false em caso contrário
	 */
	private boolean temParametroMobi(HttpServletRequest request) {
	    return VERSAO_MOBILE.equals(request.getParameter(PARAMETRO_VERSAO));
    }

	/**
	 * Verifica se existe cookie com versão mobi
	 * @param request instância de HttpServletRequest
	 * @return true caso exista e false em caso contrário
	 */
	private boolean temCookieMobi(HttpServletRequest request) {
		return VERSAO_MOBILE.equals(buscaValorDoCookieVersaoSite(request.getCookies()));
    }

	/**
	 * Verifica se existe parâmetro (query string) web na requisição
	 * @param request instância de HttpServletRequest
	 * @return true caso exista e false em caso contrário
	 */
	private boolean temParametroWeb(HttpServletRequest request) {
	    return VERSAO_WEB.equals(request.getParameter(PARAMETRO_VERSAO));
    }

	/**
	 * Verifica se existe cookie com versão web
	 * @param request
	 * @return true caso exista e false em caso contrário
	 */
	private boolean temCookieWeb(HttpServletRequest request) {
		return VERSAO_WEB.equals(buscaValorDoCookieVersaoSite(request.getCookies()));
    }

	/**
	 * Busca o valor do cookie VersaoSite
	 * @param array com os cookies do site
	 * @return valor do cookie VersaoSite ou null caso não exista
	 */
	private String buscaValorDoCookieVersaoSite(Cookie[] array) {
		if (array != null) {
			for (Cookie cookie : array) {
				if (montaNomeCookie().equalsIgnoreCase(cookie.getName())) {
					return cookie.getValue();
				}
			}
        }
		return null;
	}
	
	/**
	 * Marca a requisição para ser redirecionada
	 * @param urlParaRedirecionamento url para redirecionamento
	 * @param response instância de HttpServletResponse
	 * @throws IOException
	 */
	private void redirecionaResposta(String urlParaRedirecionamento, HttpServletResponse response) throws IOException {
		LOG.debug(format("[redirecionaResposta] URL de redirect:[%s]", urlParaRedirecionamento));
		response.sendRedirect(urlParaRedirecionamento);
    }
	
	/**
	 * Cria a url para redirecionamento da versão web 
	 * @param request instância de HttpServletRequest
	 */
	private String urlVersaoWeb(HttpServletRequest request) {
		Publication publication = EscenicUtil.getPublicacao((String) request.getAttribute(ATTRIBUTO_NOME_PUBLICACAO));
		return ajustaURLBase(publication.getUrl()) + ajustaPath(request.getRequestURI());
    }
	
	/**
	 * Cria a url para redirecionamento da versão mobi 
	 * @param request instância de HttpServletRequest
	 */
	private String urlVersaoMobi(HttpServletRequest request) {
		return ajustaURLBase(properties.getProperty(PROPRIEDADE_URL_MOBI)) + ajustaPath(request.getRequestURI());
    }

	/**
	 * Ajusta a url para ser concatenada. 
	 * Nos arquivos de properties a url pode ter o "/" no final da url ou não. Atualmente a lógica deste método
	 * é para tratar essa possível variação.
	 * @param urlBase exemplo http://www.publication.com/
	 * @return nova url
	 */
	private String ajustaURLBase(String urlBase) {
		String url = urlBase;
		if (url.endsWith("/")) {
			url = url.substring(0, url.length() - 1);
		}
		return url;
    }
	
	/**
	 * Ajusta o path. 
	 * O padrão é termos /Publicacao/secao/blablabla. Removemos a Publicacao do path para fazer o redirect. 
	 * @param path exemplo /Publicacao/secao/blablabla
	 * @return novo path
	 */
	private String ajustaPath(String path) {
		// Remove o contexto da Publicação /Extra/, /OGlobo/, /Ela/ e etc
		return path.replaceFirst("^/[^/]*", "");
    }
		
	/**
	 * Cria o cookie que identificará a versão de navegação que será exibida para o leitor
	 * @param response instância de HttpServletResponse
	 * @param valor valor que será informado no cookie.
	 */
	private void criarCookie(HttpServletResponse response, String valor, String nomePublicacao ) {
		Cookie cookie = new Cookie(montaNomeCookie(), valor);
		cookie.setMaxAge(EXPIRACAO_MENSAL_EM_SEGUNDOS);
		String dominio = properties.getProperty(PROPRIEDADE_DOMINIO);
		if (dominio == null) {
			dominio = DOMINIO_PADRAO;
		}
		cookie.setDomain(dominio);
		cookie.setPath("/");
		response.addCookie(cookie);
	}

	private String montaNomeCookie() {

	    return VERSAO_SITE_COOKIE + "_" + publicacao.getNome();
    }

	/**
	 * Setter da propriedade "properties"
	 * @param properties instância de InfogloboProperties 
	 */
	public void setProperties(InfogloboProperties properties) {
		this.properties = properties;
	}

	/**
	 * Getter da propriedade "properties"
	 * @return  instância de InfogloboProperties
	 */
	public InfogloboProperties getProperties() {
		return properties;
	}

	public Publicacao getPublicacao() {

	    return publicacao;
    }

	public void setPublicacao(Publicacao publicacao) {

	    this.publicacao = publicacao;
    }
}