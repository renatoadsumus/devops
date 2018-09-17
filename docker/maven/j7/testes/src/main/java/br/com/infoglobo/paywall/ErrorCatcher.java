package br.com.infoglobo.paywall;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.escenic.presentation.servlet.GenericProcessor;

import br.com.infoglobo.util.Publicacao;

public class ErrorCatcher extends GenericProcessor{
	
	private static final Logger LOG = Logger.getLogger(ErrorCatcher.class);

	private boolean ativado;
	
	private Publicacao publicacao;
	
	private ErrorCatcherDao dao;
	
	public boolean doBefore(ServletContext pContext, ServletRequest pRequest, ServletResponse pResponse) throws ServletException, IOException {
		
		HttpServletRequest request = (HttpServletRequest) pRequest;
		
		HttpServletResponse response = (HttpServletResponse) pResponse;
		
		if (!isAtivado()) {
			LOG.debug("Filtro desabilitado");
			return true;
		}
		
		try {
			
			LOG.debug("Entrou no capturador de erros");
			String uri = request.getRequestURI();
			
			String infgwJson = "";
	
			if (!uri.contains("errorCatcher")) {
				return true;
			}
			
			LOG.info("Entrou com erro");
			
			br.com.infoglobo.paywall.Cookie cookie = new br.com.infoglobo.paywall.Cookie(request.getHeader("cookie"));
			infgwJson = "GLBID: " + cookie.get("GLBID") + " INFGW: " + cookie.get("infgw") + "INFGWERR: " + cookie.get("infgwerr");
			
			if (publicacao == null) {
				LOG.error("Não foi possível gravar o erro. json:" + infgwJson + "publicationId: " + publicacao.getId());
				return true;
			}
			
			dao.gravarError(infgwJson, publicacao.getId());
			
			response.setStatus(HttpServletResponse.SC_OK);			
		
		} catch(Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			LOG.error("Não foi possível gravar o erro", e);
		} 
		
		return false;
				
	}
	
	public boolean isAtivado() {
		return ativado;
	}

	public void setAtivado(boolean ativado) {
		this.ativado = ativado;
	}

	public ErrorCatcherDao getDao() {
		return dao;
	}

	public void setDao(ErrorCatcherDao dao) {
		this.dao = dao;
	}

	public Publicacao getPublicacao() {
		return publicacao;
	}

	public void setPublicacao(Publicacao publicacao) {
		this.publicacao = publicacao;
	}

}
