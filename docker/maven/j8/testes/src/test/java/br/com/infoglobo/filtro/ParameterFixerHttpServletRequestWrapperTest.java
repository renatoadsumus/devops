package br.com.infoglobo.filtro;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

import javax.servlet.http.HttpServletRequest;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

public class ParameterFixerHttpServletRequestWrapperTest {

	private HttpServletRequest requestMocado;

	@Before
	public void setup() {

		requestMocado = Mockito.mock(HttpServletRequest.class);
	}

	@Test
	public void testaQueryStringSemEComercial() {

		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=1");

		String esperado = "1";

		assertEquals(esperado, parameterFixer.getParameter("a"));
	}

	@Test(expected = UnsupportedOperationException.class)
	public void testaSeOParametroEImutavel() {

		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=1");

		parameterFixer.getParameterMap().clear();
	}
	
	@Test
	public void testaMaisDeUmParametro() {
		
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=1&b=2");
		
		assertEquals("1", parameterFixer.getParameter("a"));	
		assertEquals("2", parameterFixer.getParameter("b"));	
		
		assertEquals(true, parameterFixer.getParameterMap().containsKey("a"));
		assertEquals(true, parameterFixer.getParameterMap().containsKey("b"));
	}
	
	@Test
	public void testaQueryStringSomenteComEComercialEChave() {
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "&bla");
		
		assertEquals(null, parameterFixer.getParameter("a"));
	}
	
	@Test
	public void testaQueryStringInexistente() {
		
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=1&b=2");
		
		assertEquals(null, parameterFixer.getParameter("c"));
	}
	
	@Test
	public void testaQueryStringRepetidas() {
		
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=1&a=2");
		
		assertEquals("1", parameterFixer.getParameter("a"));
		
		assertArrayEquals(new String [] {"1", "2"},  parameterFixer.getParameterValues("a"));
	}
	
	@Test
	public void testaQueryStringSomenteComChave() {
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a");
		
		assertEquals(null, parameterFixer.getParameter("a"));
		assertEquals(true, parameterFixer.getParameterMap().containsKey("a"));
		assertEquals(1, parameterFixer.getParameterMap().get("a").length);
	}
	
	@Test
	public void testaQueryStringComParametrosSemValor() {
		
		ParameterFixerHttpServletRequestWrapper parameterFixer = new ParameterFixerHttpServletRequestWrapper(requestMocado, "a=&b=");
		
		assertEquals(true, parameterFixer.getParameterMap().containsKey("a"));
		assertEquals(null, parameterFixer.getParameter("a"));
		
		assertEquals(true, parameterFixer.getParameterMap().containsKey("b"));
		assertEquals(null, parameterFixer.getParameter("b"));
	}
	
}
