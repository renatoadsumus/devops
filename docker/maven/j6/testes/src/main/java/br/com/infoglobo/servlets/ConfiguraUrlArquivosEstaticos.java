package br.com.infoglobo.servlets;

import static com.escenic.servlet.Constants.COM_ESCENIC_PUBLICATION_NAME;
import static java.lang.Boolean.parseBoolean;
import static java.lang.String.format;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import neo.xredsys.api.ObjectLoader;
import br.com.infoglobo.common.InfogloboProperties;
import br.com.infoglobo.common.Revision;

import com.escenic.presentation.servlet.GenericProcessor;

public class ConfiguraUrlArquivosEstaticos extends GenericProcessor {

	private static final String DIR_ARQUIVOS_DE_TESTES = "%splataforma/testes/%s";

	private static final String DIR_ARQUIVOS_ESTATICOS = "%splataforma/%s/%s/%s";

	private static final String DIR_ARQUIVOS_ESTATICOS_PADRAO = "%s%s/%s/%s";

	private static final String DIR_ARQUIVOS_MINIFICADOS = "minificados";

	private static final String DIR_ARQUIVOS_ORIGINAIS = "originais";

	private static final String TIPO_DE_ARQUIVO_JS = "js";

	private static final String TIPO_DE_ARQUIVO_CSS = "css";

	private InfogloboProperties infogloboProperties;

	private ObjectLoader loader;

	private Revision revision;

	@Override
	public boolean doBefore(ServletContext context, ServletRequest request, ServletResponse response) throws ServletException, IOException {

		String urlPublicacao = recuperarUrlDaPublicacao(request);

		request.setAttribute("urlJsPlataforma", montarUrlJs(urlPublicacao, DIR_ARQUIVOS_ESTATICOS));
		request.setAttribute("urlCssPlataforma", montarUrlCss(urlPublicacao, DIR_ARQUIVOS_ESTATICOS));
		request.setAttribute("urlDeTestesPlataforma", montarUrlDeTestes(urlPublicacao));

		return true;
	}

	protected String montarUrlDeTestes(String urlPublicacao) {

		return format(DIR_ARQUIVOS_DE_TESTES, urlPublicacao, revision.getVersion());
	}

	protected String montarUrlJs(String urlPublicacao, String caminhoCompleto) {

		if (urlMinificacaoAtivada()) {

			return montarUrl(caminhoCompleto, urlPublicacao, TIPO_DE_ARQUIVO_JS, DIR_ARQUIVOS_MINIFICADOS);
		}

		return montarUrl(caminhoCompleto, urlPublicacao, TIPO_DE_ARQUIVO_JS, DIR_ARQUIVOS_ORIGINAIS);
	}

	protected String montarUrlJs(String urlPublicacao) {

		return montarUrlJs(urlPublicacao, DIR_ARQUIVOS_ESTATICOS_PADRAO);
	}

	protected String montarUrlCss(String urlPublicacao, String caminhoCompleto) {

		if (urlMinificacaoAtivada()) {

			return montarUrl(caminhoCompleto, urlPublicacao, TIPO_DE_ARQUIVO_CSS, DIR_ARQUIVOS_MINIFICADOS);
		}

		return montarUrl(caminhoCompleto, urlPublicacao, TIPO_DE_ARQUIVO_CSS, DIR_ARQUIVOS_ORIGINAIS);
	}

	protected String montarUrlCss(String urlPublicacao) {

		return montarUrlCss(urlPublicacao, DIR_ARQUIVOS_ESTATICOS_PADRAO);
	}

	protected String montarUrl(String caminhoCompleto, String urlPublicacao, String tipoDeArquivo, String diretorio) {

		return format(caminhoCompleto, urlPublicacao, tipoDeArquivo, revision.getVersion(), diretorio);
	}

	protected String recuperarUrlDaPublicacao(ServletRequest request) {

		String nomeDaPublicacao = (String) request.getAttribute(COM_ESCENIC_PUBLICATION_NAME);

		return loader.getPublication(nomeDaPublicacao).getUrl();
	}

	public Revision getRevision() {

		return revision;
	}

	public void setRevision(Revision revision) {

		this.revision = revision;
	}

	public boolean urlMinificacaoAtivada() {

		return parseBoolean(infogloboProperties.getProperty("urlMinificacaoAtivada"));
	}

	public InfogloboProperties getInfogloboProperties() {

		return infogloboProperties;
	}

	public void setInfogloboProperties(InfogloboProperties infogloboProperties) {

		this.infogloboProperties = infogloboProperties;
	}

	public ObjectLoader getLoader() {

		return loader;
	}

	public void setLoader(ObjectLoader loader) {

		this.loader = loader;
	}

}
