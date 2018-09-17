package br.com.infoglobo.url;

import static org.apache.commons.lang.StringUtils.EMPTY;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Publication;
import neo.xredsys.presentation.PresentationArticleImpl;
import neo.xredsys.presentation.PresentationLoader;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

public class ProcessaUrlConteudoTest {

	private static final String CONTEXT_PATH = "/Teste";
	
	private static final String DOMINIO = "http://teste.globo.com/";

	private ServletContext context;

	private HttpServletRequest request;

	private HttpServletResponse response;

	private PresentationLoader presentationLoader;

	private List<TesteUrl> urlsInvalidas = new ArrayList<TesteUrl>();

	private List<TesteUrl> urlsValidas = new ArrayList<TesteUrl>();

	private List<TesteUrl> urls301 = new ArrayList<TesteUrl>();

	private ProcessaUrlConteudo processaUrlConteudo = new ProcessaUrlConteudo();

	private ObjectLoader objectLoader;

	public ProcessaUrlConteudoTest() {

		urlsValidas.add(new TesteUrl(CONTEXT_PATH + "/noticias/rio/receitas/nada-de-refrigerante-aprenda-fazer-sucos-deixe-seu-almoco-mais-saudavel-24573.html", true));
		
		urlsValidas.add(new TesteUrl(CONTEXT_PATH + "/mulher/receitas/nada-de-refrigerante-aprenda-fazer-sucos-deixe-seu-almoco-mais-saudavel-24573.html", true));
		
		
		urlsValidas.add(new TesteUrl(CONTEXT_PATH + "/noticias/saude-e-ciencia/saude-bucal/clareamento-dentario-especialistas-tiram-duvidas-sobre-tecnicas-caseiras-profissionais-9994546.html", true));
		
		
		urlsInvalidas.add(new TesteUrl(CONTEXT_PATH, true));
	
		urlsInvalidas.add(new TesteUrl(CONTEXT_PATH + "/incoming/9381956-a78-a6b/w640h360-PROP/foto.JPG", true));
		urlsInvalidas.add(new TesteUrl(CONTEXT_PATH + "/teste/aaaa.json", false));

		urlsValidas.add(new TesteUrl(CONTEXT_PATH + "/casos-de-policia/novo-comandante-da-pm-diz-que-vai-revogar-decreto-que-perdoava-policiais-por-faltas-disciplinares-9381957.html", true));
		
		urlsValidas.add(new TesteUrl(CONTEXT_PATH + "/rio/novo-comandante-da-pm-vai-revogar-anistia-punicoes-administrativas-9383047", false));
		urlsValidas.add(new TesteUrl("/Promocoes" + "/talento-carioca-123.html", true));


		urls301.add(new TesteUrl(CONTEXT_PATH + "/saude/mesmo-titulo-123", DOMINIO + "economia/mesmo-titulo-123", false));
		urls301.add(new TesteUrl(CONTEXT_PATH + "/esportes/titulo-novo-123.html", DOMINIO + "secao-nao-existente/titulo-antigo-123.html", true));
			 
	}

	@Before
	public void setup() {

		context = mock(ServletContext.class);
		request = mock(HttpServletRequest.class);
		response = mock(HttpServletResponse.class);
		presentationLoader = mock(PresentationLoader.class);
		
		objectLoader = mock(ObjectLoader.class);

	}
	
	@Test
	public void testaExtracaoDeIdDaUrl() {

		String path = "secao/governo-libera-r-23412-de-bilhoes-9381957";

		assertEquals(9381957, processaUrlConteudo.extrairIdDaUrl(path, false));

		path += ".html";

		assertEquals(9381957, processaUrlConteudo.extrairIdDaUrl(path, true));
	}

	@Test(expected = NumberFormatException.class)
	public void testaExtracaoDeIdDaUrlComIdInvalido() {

		String urlInvalida = "secao/governo-libera-r-23412-de-bilhoes-9381957-asdf";

		processaUrlConteudo.extrairIdDaUrl(urlInvalida, false);
	}

	@Test(expected = NumberFormatException.class)
	public void testaExtracaoDeIdComIdIgualAZero() {

		String urlInvalida = "secao/governo-libera-r-23412-de-bilhoes-0";

		processaUrlConteudo.extrairIdDaUrl(urlInvalida, false);
	}

	@Test
	public void testaUrlsValidas() throws ServletException, IOException {

		for (TesteUrl teste : urlsValidas) {

			mocar(teste.urlConteudo, teste.uriRequisicao);

			processaUrlConteudo.setUsarExtensao(teste.temExtensao);

			assertTrue(processaUrlConteudo.doBefore(context, request, response));
		}
	}

	@Test
	public void testaUrlsInvalidas() throws ServletException, IOException {

		for (TesteUrl teste : urlsInvalidas) {

			mocar(teste.urlConteudo, teste.uriRequisicao);

			processaUrlConteudo.setUsarExtensao(teste.temExtensao);

			assertTrue(processaUrlConteudo.doBefore(context, request, response));
		}
	}
	
	@Test
	public void redirecionamentoMantemQueryStringDoRequest() throws ServletException, IOException, URISyntaxException {
			
		URL urlDaRequisicao = new URL ("http://m.extra.globo.com/Extra/secao/nome-materia-1234.html?teste=QueryString");
		
		mocar2("http://extra.globo.com/secao/nome-materia-alterado-1234.html", urlDaRequisicao, "/Extra");
		
		processaUrlConteudo.setUsarExtensao(true);
		
		boolean retorno = processaUrlConteudo.doBefore(context, request, response);
		
		assertFalse(retorno);
		
		Mockito.verify(response).setHeader("Location", "http://m.extra.globo.com/secao/nome-materia-alterado-1234.html?teste=QueryString");
		
	}
	
	
	@Test
	public void testaRedirectMantemHostnameDoRequest() throws ServletException, IOException, URISyntaxException {
			
		URL urlDaRequisicao = new URL ("http://m.extra.globo.com/Extra/secao/nome-materia-1234.html");
		
		mocar2("http://extra.globo.com/secao/nome-materia-alterado-1234.html", urlDaRequisicao, "/Extra");
		
		processaUrlConteudo.setUsarExtensao(true);
		
		boolean retorno = processaUrlConteudo.doBefore(context, request, response);
		
		assertFalse(retorno);
		
		Mockito.verify(response).setHeader("Location", "http://m.extra.globo.com/secao/nome-materia-alterado-1234.html");
		
	}
	
	@Test
	public void testaPortNumberForaDoPadraoHTTP() throws ServletException, IOException, URISyntaxException {
		
		URL urlDaRequisicao = new URL ("http://m.extra.globo.com:8081/Extra/secao/nome-materia-1234.html");
		
		mocar2("http://extra.globo.com/secao/nome-materia-alterado-1234.html", urlDaRequisicao, "/Extra");
		
		processaUrlConteudo.setUsarExtensao(true);
		
		boolean retorno = processaUrlConteudo.doBefore(context, request, response);
		
		assertFalse(retorno);
		
		Mockito.verify(response).setHeader("Location", "http://m.extra.globo.com:8081/secao/nome-materia-alterado-1234.html");
		
	}	
	
	@Test
	public void testaPortNumberForaDoPadraoHTTPS() throws ServletException, IOException, URISyntaxException {
		
		URL urlDaRequisicao = new URL ("https://m.extra.globo.com:442/Extra/secao/nome-materia-1234.html");
			
		mocar2("http://extra.globo.com/secao/nome-materia-alterado-1234.html", urlDaRequisicao, "/Extra");
		
		processaUrlConteudo.setUsarExtensao(true);
		
		boolean retorno = processaUrlConteudo.doBefore(context, request, response);
		
		assertFalse(retorno);
		
		Mockito.verify(response).setHeader("Location", "https://m.extra.globo.com:442/secao/nome-materia-alterado-1234.html");
		
	}		

	@Test
	public void testaUrls301() throws ServletException, IOException {

		for (TesteUrl teste : urls301) {

			mocar(teste.urlConteudo, teste.uriRequisicao);

			processaUrlConteudo.setUsarExtensao(teste.temExtensao);

			assertFalse(processaUrlConteudo.doBefore(context, request, response));
		}
	}
	
	private void mocar(String urlConteudo, String uriRequisicao) {
		
		mocar(urlConteudo, uriRequisicao, DOMINIO);
	}

	private void mocar(String urlConteudo, String uriRequisicao, String dominioRequisicao) {

		when(request.getRequestURI()).thenReturn(uriRequisicao);
		when(request.getRequestURL()).thenReturn(new StringBuffer(dominioRequisicao + uriRequisicao));
		when(request.getContextPath()).thenReturn(CONTEXT_PATH);
		
		PresentationArticleImpl conteudo = mock(PresentationArticleImpl.class);
		Publication publicacao = mock(Publication.class);

		when(publicacao.getName()).thenReturn("Teste");
		
		when(conteudo.getUrl()).thenReturn(urlConteudo);
		when(conteudo.getPublication()).thenReturn(publicacao);
		
		when(presentationLoader.getArticle(Mockito.anyInt(), Mockito.any(Publication.class))).thenReturn(conteudo);

		processaUrlConteudo.setPresentationLoader(presentationLoader);
		processaUrlConteudo.setObjectLoader(objectLoader);
	}
	
	private void mocar2(String urlConteudo, URL urlDaRequisicao, String contextPath) throws URISyntaxException {

		
		String url = urlDaRequisicao.toString();
		String uri = urlDaRequisicao.getPath();
		if (url.contains("?")) {
			url = url.substring(0, url.indexOf('?'));
		}
		
		when(request.getRequestURI()).thenReturn(uri);
		when(request.getRequestURL()).thenReturn(new StringBuffer(url));
		when(request.getQueryString()).thenReturn(urlDaRequisicao.getQuery());
		when(request.getScheme()).thenReturn(urlDaRequisicao.getProtocol());
		when(request.getServerName()).thenReturn(urlDaRequisicao.getHost());
		
		int port = urlDaRequisicao.getPort() != -1 ? urlDaRequisicao.getPort() : urlDaRequisicao.getDefaultPort();
		when(request.getServerPort()).thenReturn(port);
		when(request.getContextPath()).thenReturn(contextPath);
		
		PresentationArticleImpl conteudo = mock(PresentationArticleImpl.class);
		Publication publicacao = mock(Publication.class);

		when(publicacao.getName()).thenReturn("Teste");
		
		when(conteudo.getUrl()).thenReturn(urlConteudo);
		when(conteudo.getPublication()).thenReturn(publicacao);
		
		when(presentationLoader.getArticle(Mockito.anyInt(), Mockito.any(Publication.class))).thenReturn(conteudo);

		processaUrlConteudo.setPresentationLoader(presentationLoader);
		processaUrlConteudo.setObjectLoader(objectLoader);
	}	

	private class TesteUrl {

		private String urlConteudo;

		private String uriRequisicao;

		private boolean temExtensao;

		public TesteUrl(String uriRequisicao, String urlConteudo, boolean temExtensao) {

			this.uriRequisicao = uriRequisicao;
			this.urlConteudo = urlConteudo;
			this.temExtensao = temExtensao;
		}

		public TesteUrl(String uriRequisicao, boolean temExtensao) {

			this.uriRequisicao = uriRequisicao;
			this.urlConteudo = new String(DOMINIO + uriRequisicao).replace(CONTEXT_PATH, "");
			this.temExtensao = temExtensao;
		}

	}
	
	
	public static void main(String[] args) {
		
		// ^(\/[^\/]+)(.+)$, '$2'
		
		 String REGEX_NOME_PUBLICACAO_NA_URL = "^(/[^/]+)";

	    String url = "/Teste/mulher/receitas/nada-de-refrigerante-aprenda-fazer-sucos-deixe-seu-almoco-mais-saudavel-24573.html";
	    
	    System.out.println(url.replaceAll(REGEX_NOME_PUBLICACAO_NA_URL, EMPTY));
    }

}
