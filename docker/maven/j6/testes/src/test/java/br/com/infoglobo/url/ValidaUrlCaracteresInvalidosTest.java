package br.com.infoglobo.url;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;


/**
 * 
 * @author Célula Plataforma Digital
 *
 */

public class ValidaUrlCaracteresInvalidosTest {
	
	private ServletContext paramServletContext;
	private HttpServletRequest request;
	private HttpServletResponse response;

	@Before
	public void antesDoTeste() {

		paramServletContext = mock(ServletContext.class);
		request = mock(HttpServletRequest.class);
		response = mock(HttpServletResponse.class);
	}
	
	@Test
	public void testaUrlComEspaco() throws ServletException, IOException {
		
		String url = "/incoming/2013/08/22/06-chico/ALTERNATES/FTPaginaFotogaleriaHorizontal/06 CHICO";
		
		when(request.getRequestURI()).thenReturn(url);
		
		ValidaUrlCaracteresInvalidos validaUrl = new ValidaUrlCaracteresInvalidos();
		
		boolean retornoFeito = validaUrl.doBefore(paramServletContext, request, response);
		
		verify(response).sendError(HttpServletResponse.SC_NOT_FOUND);
		
		assertFalse("Aguardo retorno false", retornoFeito);
	}
	
	@Test
	public void testaUrlSemCaracterEspecial() throws ServletException, IOException {
		
		String url = "/";
		
		when(request.getRequestURI()).thenReturn(url);
		
		ValidaUrlCaracteresInvalidos validaUrl = new ValidaUrlCaracteresInvalidos();
		
		boolean retornoFeito = validaUrl.doBefore(paramServletContext, request, response);
		assertTrue("Aguardo retorno true", retornoFeito);
	}

	@Test
	public void testaUrlComCaracterEspecial() throws ServletException, IOException {
		
		String url = "/famosos/' + OAS_url + 'adstream_mjx.ads";
		
		when(request.getRequestURI()).thenReturn(url);
		
		ValidaUrlCaracteresInvalidos validaUrl = new ValidaUrlCaracteresInvalidos();
		validaUrl.setAtivado(true);
		boolean retornoFeito = validaUrl.doBefore(paramServletContext, request, response);
		assertFalse("Aguardo retorno false", retornoFeito);
	}
	
}
