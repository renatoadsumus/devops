package br.com.infoglobo.commons.util;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.log4j.Logger;

/**
 * 
 * @author Célula Plataforma Digital
 *
 */

public class ValidadorUrl {

	private Logger log = Logger.getLogger(ValidadorUrl.class);
	
	public boolean isValida(String url) {

		try {
			new URI(url);
		} catch (URISyntaxException e) {
			log.debug("URL inválida!", e);
			return false;
		}
		return true;
	}

}
