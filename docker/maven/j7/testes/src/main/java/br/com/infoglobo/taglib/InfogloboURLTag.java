package br.com.infoglobo.taglib;

import static java.lang.String.format;

import java.net.URI;

import neo.xredsys.presentation.PresentationArticle;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.escenic.domain.Link;

public class InfogloboURLTag {
	
	private static final String BINARY_IMG_PATH_PROP = "com.escenic.presentation.internal.BINARY";

	private static final Logger LOG = Logger.getLogger(InfogloboURLTag.class);
	
    public static String getImagemOriginal(PresentationArticle article) {
		String url = "";
		try {
			url = getOriginal(article);
		} catch (Exception e) {
    		LOG.error(format("[getImagemOriginal] erro na busca da url original. articleId:[%d]", article.getArticleId()), e);
    	}
		LOG.debug(format("[getImagemOriginal] URL da Imagem:[%s] para o articleId:[%d]", url, article.getArticleId()));
		return url;
	}

    private static String getOriginal(PresentationArticle article) {
    	Link link = (Link) article.getFields().get(BINARY_IMG_PATH_PROP).getValue();
    	String publicationUrl = article.getPublication().getUrl();
    	if(!publicationUrl.endsWith("/")) {
    		publicationUrl += "/";
    	}
    	return article.getPublication().getUrl() + link.getHref().getPath();
    }
    
    public static String getUrlComDominioEstatico(PresentationArticle article, String dominioEstatico) {
    	
    	if (article == null){
    		return StringUtils.EMPTY;
    	}
    	
    	URI href = null;
    	
    	try {
    		Link link = (Link) article.getFields().get(BINARY_IMG_PATH_PROP).getValue();
    		href = link.getHref();
		} catch (Exception e) {
    		LOG.error(format("[getUrlComDominioEstatico] erro na busca da url com domínio estático. articleId:[%d]", article.getArticleId()), e);
    	}
    	
		if (href == null ){
    		return StringUtils.EMPTY;
    	}
		return dominioEstatico + href.getPath();
    }
}
