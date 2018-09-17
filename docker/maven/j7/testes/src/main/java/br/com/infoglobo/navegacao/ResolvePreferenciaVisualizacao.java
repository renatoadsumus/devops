package br.com.infoglobo.navegacao;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import com.escenic.presentation.servlet.GenericProcessor;

public class ResolvePreferenciaVisualizacao extends GenericProcessor {

	private static final String ATRIBUTO_DE_PREFERENCIA = "preferencia";

	private static final String PARAMETRO_DE_PREVIEW = "preview";

	private PreferenciaVisualizacao preferenciaVisualizacao;

	private boolean ativado = true;

	@Override
	public boolean doBefore(ServletContext context, ServletRequest pRequest, ServletResponse response) throws ServletException, IOException {

		if (ativado) {

			HttpServletRequest request = (HttpServletRequest) pRequest;

			String nomeDoPreview = request.getParameter(PARAMETRO_DE_PREVIEW);

			String serverName = request.getServerName();

			PreferenciaBuilder preferencia = new PreferenciaBuilder();

			preferencia.setPreferencias(preferenciaVisualizacao.getVersoes());
			preferencia.setServerName(serverName);
			preferencia.setPreview(nomeDoPreview);
			preferencia.setDominioDoCookie(preferenciaVisualizacao.getDominioDoCookie());

			request.setAttribute(ATRIBUTO_DE_PREFERENCIA, preferencia.construir());
		}

		return super.doBefore(context, pRequest, response);
	}

	public boolean isAtivado() {

		return ativado;
	}

	public void setAtivado(boolean ativado) {

		this.ativado = ativado;
	}

	public PreferenciaVisualizacao getPreferenciaVisualizacao() {

		return preferenciaVisualizacao;
	}

	public void setPreferenciaVisualizacao(PreferenciaVisualizacao preferenciaVisualizacao) {

		this.preferenciaVisualizacao = preferenciaVisualizacao;
	}

}
