package br.com.infoglobo.url;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;


import org.junit.Test;

import br.com.infoglobo.commons.util.ValidadorUrl;

/**
 * 
 * @author Célula Plataforma Digital
 *
 */

public class ValidadorUrlTest {
	
	@Test
	public void testaUrlSemCaracterEspecial() {
		
		String url = "/";
		ValidadorUrl validador = new ValidadorUrl();
		assertTrue(validador.isValida(url));
	}
	
	@Test
	public void testarUrlComCaractereEspecial() {
		
		String url = "/famosos/' + OAS_url + 'adstream_mjx.ads";
		ValidadorUrl validator = new ValidadorUrl();
		assertFalse(validator.isValida(url));
	}
	
	@Test
	public void testaUrlComEspaco() {
		
		String url = "/mulher/corpo/carol-portaluppi-fala-sobre-cuidados-com-aparencia-curiosidade-sobre-corpo-meu-dedao-do-pe-me-faz -calcar-40-12751906.html";
		ValidadorUrl validator = new ValidadorUrl();
		assertFalse(validator.isValida(url));
	}
	
}
