package br.com.infoglobo.statistics;

import neo.xredsys.presentation.PresentationArticle;

/**
* @deprecated  Usar a nova lib infoglobo-statistcs 
*/
@Deprecated
public class PresentationStatisticsElement extends StatisticsElement {
	private PresentationArticle article;

	/**
	 * @return the article
	 */
	public PresentationArticle getArticle() {
		return article;
	}

	/**
	 * @param paramArticle the article to set
	 */
	public void setArticle(PresentationArticle paramArticle) {
		article = paramArticle;
	}
}
