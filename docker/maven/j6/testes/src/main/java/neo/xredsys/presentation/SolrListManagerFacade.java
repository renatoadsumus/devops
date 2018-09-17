package neo.xredsys.presentation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import neo.xredsys.api.IOAPI;
import neo.xredsys.api.LatestArticlesQuery;
import neo.xredsys.api.Type;
import neo.xredsys.presentation.list.ListManagerFacade;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import org.apache.log4j.Logger;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;

import br.com.infoglobo.farejador.cliente.Pesquisa;
import br.com.infoglobo.farejador.cliente.Resultado;
import br.com.infoglobo.farejador.componente.SolrEscenic;


public class SolrListManagerFacade extends ListManagerFacade {

	private Logger LOG = Logger.getLogger(getClass());
	private SolrEscenic solrService;
	private boolean solrEnabled = false; 
	
	@Override
	public List<PresentationArticle> getArticles(LatestArticlesQuery pLatestArticlesQuery) {
	
		if (solrEnabled && pLatestArticlesQuery.getField()==null && pLatestArticlesQuery.getExpression()==null) {
		    try {
	
				SolrQuery query = new SolrQuery();
	
				query.setQuery("*:*");
				
				String publicationName = IOAPI.getAPI().getObjectLoader().getPublicationById(pLatestArticlesQuery.getPublicationId()).getName();

				List<String> articleTypes = new ArrayList<String>();
				for (int articleTypeId : (List<Integer>)pLatestArticlesQuery.getIncludeArticleTypes()) {
					try {
						Type t = IOAPI.getAPI().getTypeManager().getType(Type.ArticleType, articleTypeId);
						articleTypes.add(t.getName());
					} catch (Exception e) {
						LOG.error("failed with article type " + articleTypeId, e);
					}
				}
				
				query.addFilterQuery("publication:\"" + publicationName + "\"");
				query.addFilterQuery("state:published");
				if (!articleTypes.isEmpty()) {
					query.addFilterQuery("contenttype:(" + StringUtils.join(articleTypes, " OR ") + ")");
				}
				
				// there are 4 cases:
				//
				// 1. only home section, no subsections --> home_section
				// 2. only home section, with subsections --> homesection_path
				// 3. assigned sections, no subsection --> assignedsections_path
				// 4. assigned sections, with subsections --> section
				
				if (pLatestArticlesQuery.getHomeSectionOnly() && !pLatestArticlesQuery.getIncludeSubSections()) {
					query.addFilterQuery("home_section:(" + toQueryValue(pLatestArticlesQuery.getSectionIds()) + ")");
				}
				if (pLatestArticlesQuery.getHomeSectionOnly() && pLatestArticlesQuery.getIncludeSubSections()) {
					query.addFilterQuery("homesection_path:(" + toQueryValue(pLatestArticlesQuery.getSectionIds()) + ")");
				}
				if (!pLatestArticlesQuery.getHomeSectionOnly() && !pLatestArticlesQuery.getIncludeSubSections()) {
					query.addFilterQuery("assignedsections_path:(" + toQueryValue(pLatestArticlesQuery.getSectionIds()) + ")");
				}
				if (!pLatestArticlesQuery.getHomeSectionOnly() && pLatestArticlesQuery.getIncludeSubSections()) {
					query.addFilterQuery("section:(" + toQueryValue(pLatestArticlesQuery.getSectionIds()) + ")");
				}
				
				
				if (pLatestArticlesQuery.getOrderBy()!=null) {
					query.setSortField(pLatestArticlesQuery.getOrderBy().toLowerCase(), pLatestArticlesQuery.getDescending() ? ORDER.desc : ORDER.asc);
				}
				
				query.setRows( Math.max(20, pLatestArticlesQuery.getMax()) );
				
				if (pLatestArticlesQuery.getFromDate()!=null || pLatestArticlesQuery.getToDate()!=null) {
					
					query.addFilterQuery(
							"publishdate:[" +
							(pLatestArticlesQuery.getFromDate()!=null ? DateFormatUtils.ISO_DATETIME_TIME_ZONE_FORMAT.format(pLatestArticlesQuery.getFromDate().getTime()) : "*") +
							" TO " +  
							(pLatestArticlesQuery.getToDate()!=null ? DateFormatUtils.ISO_DATETIME_TIME_ZONE_FORMAT.format(pLatestArticlesQuery.getToDate().getTime()) : "NOW") +
							"]");
				}
				
				// return only id
				query.setFields( "objectid" );
				
				
				Pesquisa pa = solrService.pesquisar(query);
				
				
				ArrayList<PresentationArticle> result = new ArrayList<PresentationArticle>();
				
				if (pa!=null && pa.getResultados()!=null && pa.getResultados().size()>0) {
					
					for (Resultado res : pa.getResultados()) {
						
						PresentationArticle pArticle = getArticlePresentationManager().getFromCache(res.getId());
						
						if (pArticle!=null && pArticle.isLive()) {
							result.add(pArticle);
						}
						
						if (result.size()==pLatestArticlesQuery.getMax()) {
							break;
						}
					}
				}
				
				return result;
				
		    } catch (Exception e) {
		    	LOG.error("failed in solr search(article:list). query: " + pLatestArticlesQuery, e);
		    }
		}
	    
	    return super.getArticles(pLatestArticlesQuery);
	}

	protected String toQueryValue(int[] iarray) {
		return Arrays.toString(iarray).replace(",  ", " OR ").replace("[", "").replace("]", "");
	}
	
	
	public SolrEscenic getSolrService() {

	    return solrService;
    }

	public void setSolrService(SolrEscenic solrService) {

	    this.solrService = solrService;
    }

	public boolean isSolrEnabled() {

	    return solrEnabled;
    }

	public void setSolrEnabled(boolean solrEnabled) {

	    this.solrEnabled = solrEnabled;
    }
}
