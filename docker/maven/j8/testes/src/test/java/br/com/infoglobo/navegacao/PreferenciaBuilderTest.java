package br.com.infoglobo.navegacao;

import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import br.com.infoglobo.navegacao.PreferenciaBuilder.Versao;

public class PreferenciaBuilderTest {

	private Map<String, String> versoes = new HashMap<String, String>();

	private PreferenciaBuilder preferencia;

	public PreferenciaBuilderTest() {

		preferencia = new PreferenciaBuilder();

		versoes.put("mobi", "m.oglobo.globo.com");
		versoes.put("classico", "oglobo.globo.com");
		versoes.put("webapp", "webapp.oglobo.globo.com");
		versoes.put("ipad", "ipad.oglobo.globo.com");
	}

	@Test(expected = IllegalArgumentException.class)
	public void testaVersoesNula() {

		preferencia.construir();
	}

	@Test(expected = IllegalArgumentException.class)
	public void testaUrlNulaOuVazia() {

		preferencia.setPreferencias(versoes);
		preferencia.construir();
	}

	@Test
	public void testaPreviewSiteMobi() {

		String serverName = "oglobo.globo.com";

		String preview = "mobi";

		preferencia.setPreferencias(versoes);
		preferencia.setServerName(serverName);
		preferencia.setPreview(preview);
		preferencia.setDominioDoCookie(".oglobo.globo.com");
		
		Versao versao = (Versao) preferencia.construir().get("mobi");

		assertTrue(versao.isAtivo());
	}

	@Test
	public void testaPreviewSiteClassico() {

		String url = "oglobo.globo.com";

		String preview = "classico";

		preferencia.setPreferencias(versoes);
		preferencia.setServerName(url);
		preferencia.setPreview(preview);
		preferencia.setDominioDoCookie(".oglobo.globo.com");
		
		Versao versao = (Versao) preferencia.construir().get("classico");

		assertTrue(versao.isAtivo());
	}

	@Test
	public void testaPaginaMobi() {

		String url = "m.oglobo.globo.com";

		preferencia.setPreferencias(versoes);
		preferencia.setServerName(url);
		preferencia.setDominioDoCookie(".oglobo.globo.com");
		
		Versao versao = (Versao) preferencia.construir().get("mobi");

		assertTrue(versao.isAtivo());
	}

	@Test
	public void testaSiteClassico() {

		String url = "oglobo.globo.com";

		preferencia.setPreferencias(versoes);
		preferencia.setServerName(url);
		preferencia.setDominioDoCookie(".oglobo.globo.com");
		
		Versao versao = (Versao) preferencia.construir().get("classico");

		assertTrue(versao.isAtivo());
	}

}
