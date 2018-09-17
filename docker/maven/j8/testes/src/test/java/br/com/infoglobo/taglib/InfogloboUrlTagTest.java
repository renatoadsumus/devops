package br.com.infoglobo.taglib;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import neo.xredsys.presentation.PresentationArticle;

import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;

public class InfogloboUrlTagTest {
	
	private PresentationArticle presentationArticle;
	
	@Before
	public void setup() {
		presentationArticle = mock(PresentationArticle.class);
	}
	
	@Test
	public void testaFormatacaoDeUrlQuandoArticleEhNulo() {
		
		presentationArticle = null;
		String dominioEstatico = "https://ogimg.infoglobo.com.br/";
		String url = InfogloboURLTag.getUrlComDominioEstatico(presentationArticle, dominioEstatico);
		assertTrue(StringUtils.EMPTY.equals(url));
	}
	
	@Test
	public void testFormatacaoDeUrlQuandoOcorreExcecao() {
		
		String dominioEstatico = "https://ogimg.infoglobo.com.br/";
		when(presentationArticle.getFields()).thenReturn(null);
		String url = InfogloboURLTag.getUrlComDominioEstatico(presentationArticle, dominioEstatico);
		assertTrue(StringUtils.EMPTY.equals(url));
		
	}
	
}
