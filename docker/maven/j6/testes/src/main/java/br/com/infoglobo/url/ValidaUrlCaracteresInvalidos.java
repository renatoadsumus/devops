package br.com.infoglobo.url;

import java.io.IOException;
import java.net.URLDecoder;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.infoglobo.commons.util.ValidadorUrl;

import com.escenic.presentation.servlet.GenericProcessor;

/**
 * 
 * @author Célula Plataforma Digital
 *
 */
public class ValidaUrlCaracteresInvalidos extends GenericProcessor  {
	
	private boolean ativado = true;

	@Override
	public boolean doBefore(ServletContext paramServletContext, ServletRequest request, ServletResponse response)
			throws ServletException, IOException {

		if (isAtivado()) {
			mLogger.debug("Filtro ATIVADO");
			String uri = ((HttpServletRequest) request).getRequestURI();
			String uriDecode = URLDecoder.decode(uri, "UTF-8"); 
			
			ValidadorUrl validadorUrl = new ValidadorUrl();
			
			if (validadorUrl.isValida(uriDecode)) {
				mLogger.debug("Url Válida: " + uriDecode);
				return true;
			} 
			mLogger.debug("Url Inválida: " + uriDecode);
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			httpResponse.sendError(404);
			return false;
		}
		
		return true;

	}

	public boolean isAtivado() {

	    return ativado;
    }

	public void setAtivado(boolean ativado) {

	    this.ativado = ativado;
    }


}
