package br.com.infoglobo.url;

import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT;
import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT_ARTICLE_ID;
import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT_PATH;
import static java.lang.Integer.parseInt;
import static java.lang.String.format;
import static java.net.URLDecoder.decode;
import static javax.servlet.http.HttpServletResponse.SC_MOVED_PERMANENTLY;
import static org.apache.commons.lang.StringUtils.EMPTY;
import static org.apache.commons.lang.StringUtils.contains;
import static org.apache.commons.lang.StringUtils.endsWith;
import static org.apache.commons.lang.StringUtils.isNotEmpty;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Publication;
import neo.xredsys.presentation.PresentationArticle;
import neo.xredsys.presentation.PresentationLoader;

import org.apache.log4j.Logger;

import com.escenic.presentation.servlet.GenericProcessor;

public class ProcessaUrlConteudo extends GenericProcessor {

	private static final String CODIFICACAO_DA_URL = "UTF-8";

	private static final boolean CONTINUA_EXECUCAO_DOS_PROXIMOS_FILTROS = true;

	private static final boolean PARA_EXECUCAO_DOS_PROXIMOS_FILTROS = false;

	private static final Logger LOG = Logger.getLogger(ProcessaUrlConteudo.class);
	
	private String extensao = ".html";

	private boolean usarExtensao = false;

	private PresentationLoader presentationLoader;

	private ObjectLoader objectLoader;

	@Override
	public boolean doBefore(ServletContext pContext, ServletRequest request, ServletResponse response) throws ServletException, IOException {

		String url = null;

		try {

			url = decode(((HttpServletRequest) request).getRequestURI(), CODIFICACAO_DA_URL);

			LOG.debug(format("Iniciando o processamento da url [%s].", url));

			if (isNotEmpty(url) && url.indexOf("-") > 0) {

				if (usarExtensao && !endsWith(url, extensao)) {

					return CONTINUA_EXECUCAO_DOS_PROXIMOS_FILTROS;
				}

				try {

					int idDoConteudo = extrairIdDaUrl(url, usarExtensao);

					LOG.debug(format("Extraido o id do conteudo [%s] da url.", idDoConteudo));

					PresentationArticle conteudo = presentationLoader.getArticle(idDoConteudo, getPublication(request));

					if (conteudo == null) {

						return CONTINUA_EXECUCAO_DOS_PROXIMOS_FILTROS;
					}

					if ( urlNaoEIgualAoCadastrado(url, ((HttpServletRequest) request).getContextPath(), conteudo) ) {

						inserirInfoDeRedirecionamento((HttpServletRequest)request, (HttpServletResponse)response, conteudo);

						return PARA_EXECUCAO_DOS_PROXIMOS_FILTROS;
					}

					inserirAtributosDeArtigo(request, idDoConteudo);

				} catch (NumberFormatException e) {

					LOG.debug(format("A url [%s] não contem um id valido.", url), e);
				}

			}
		} catch (Exception e) {

			LOG.error(format("Falha ao processar a url [%s].", url), e);
		}

		return CONTINUA_EXECUCAO_DOS_PROXIMOS_FILTROS;
	}

	private Publication getPublication(ServletRequest request) {

		String nomePublicacao = (String) request.getAttribute("com.escenic.publication.name");
		Publication publication = getObjectLoader().getPublication(nomePublicacao);

		return publication;
	}

	private void inserirAtributosDeArtigo(ServletRequest request, int idDoConteudo) {

		request.setAttribute(COM_ESCENIC_CONTEXT, "art");
		request.setAttribute(COM_ESCENIC_CONTEXT_ARTICLE_ID, new Integer(idDoConteudo));
		request.setAttribute(COM_ESCENIC_CONTEXT_PATH, "");
	}

	public void inserirInfoDeRedirecionamento(HttpServletRequest request, HttpServletResponse response, PresentationArticle conteudo) throws MalformedURLException {

		String locationHeader = null;

		/* Recuperando o scheme + hostName + portNumber do objeto HttpServletRequest */
		String scheme = request.getScheme();
		String hostName = request.getServerName();
		Integer portNumber = request.getServerPort();

		String url = scheme + "://" + hostName;

		/* Se scheme for "http" e portNumber for "80", nao inserir portNumber na URL.
		 * Se scheme for "https" e portNumber for "443", nao inserir portNumber na URL.
		 * Só insere o portNumber se ele for diferente de 80 ou 443.
		 */

		if (!("http".equals(scheme) && portNumber == 80) && (!("https".equals(scheme) && portNumber == 443))) 
			url += ":" + portNumber;

		/* Verificando o caminho correto do conteúdo */
		String urlConteudo = conteudo.getUrl();
		URL conteudoURLCompleta = new URL(urlConteudo);
		String conteudoURLRelativa = conteudoURLCompleta.getPath(); 

		locationHeader = url + conteudoURLRelativa;
		
		
		if (request.getQueryString() != null) {
			locationHeader += "?" + request.getQueryString();
		}

		response.setStatus(SC_MOVED_PERMANENTLY);
		response.setHeader("Location", locationHeader);

		LOG.debug("Informacoes de redirecionamento inseridos no cabecalho da resposta: status ["+SC_MOVED_PERMANENTLY+"], Location ["+locationHeader+"]");
	}

	public boolean urlNaoEIgualAoCadastrado(String url, String contextPath, PresentationArticle conteudo) throws UnsupportedEncodingException {	
		// remover o nome da publicacao que aparece no inicio da URL, ex: /Extra, 
		// para fazer funcionar a comparacao com "conteudo.getUrl()", ja que este metodo
		// retorna uma URL *SEM* o nome da publicacao
		String urlSemNomeDaPublicacao = url.replaceAll(contextPath, EMPTY);

		LOG.debug(format("Verificando se a url da requisicao [%s] eh diferente da url cadastrada [%s].", url, conteudo.getUrl()));

		return !contains(conteudo.getUrl(), urlSemNomeDaPublicacao);
	}

	public int extrairIdDaUrl(String url, boolean temExtensao) throws NumberFormatException {

		int indiceInicial = url.lastIndexOf("-") + 1;
		int indiceFinal = url.length();

		if (temExtensao) {

			indiceFinal = url.lastIndexOf(".");
		}

		int id = parseInt(url.substring(indiceInicial, indiceFinal));

		if (id > 0) {

			return id;
		}

		throw new NumberFormatException(format("O id [%s] contido na url deve ser maior que 0.", id));
	}

	public String getExtensao() {

		return extensao;
	}

	public void setExtensao(String extensao) {

		this.extensao = extensao;
	}

	public boolean isUsarExtensao() {

		return usarExtensao;
	}

	public void setUsarExtensao(boolean usarExtensao) {

		this.usarExtensao = usarExtensao;
	}

	public PresentationLoader getPresentationLoader() {

		return presentationLoader;
	}

	public void setPresentationLoader(PresentationLoader presentationLoader) {

		this.presentationLoader = presentationLoader;
	}

	/**
	 * @return o valor do <i>field</i> '<b>objectLoader</b>'
	 */
	public ObjectLoader getObjectLoader() {

		return objectLoader;
	}

	/**
	 * @param objectLoader o objeto a ser setado em '<b>objectLoader</b>'
	 */
	public void setObjectLoader(ObjectLoader objectLoader) {

		this.objectLoader = objectLoader;
	}
}
