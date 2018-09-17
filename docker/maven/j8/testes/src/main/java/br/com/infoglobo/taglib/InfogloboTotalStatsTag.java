package br.com.infoglobo.taglib;

import java.lang.reflect.Method;

import javax.servlet.jsp.JspException;

import neo.xredsys.presentation.PresentationArticle;

import org.apache.log4j.Logger;

import br.com.infoglobo.statistics.InfogloboStatistics;

import com.escenic.analysis.common.Constants;
import com.escenic.analysis.common.util.ArrayUtil;
import com.escenic.analysis.common.util.StringUtil;
import com.escenic.analysis.qs.client.pageview.Total;

/**
 * Tag for retrieving totals statistics from the query service, caching them as necessary.
 * 
 * @author mandrada
 */
public class InfogloboTotalStatsTag extends InfogloboStatisticsBaseTag {

	/** Serial version */
	private static final long serialVersionUID = 7547735056975520791L;

	/** Start date for the search */
	private String from;

	/** End date for the search */
	private String to;

	/** Publication ID */
	private Object pubId;

	private boolean includeContextPubId = true;

	private Object sectionId;

	private Object type;

	private Object meta;

	private Object category;

	private PresentationArticle article;

	private static Logger LOGGER = Logger.getLogger(InfogloboStatisticsTag.class);

	public int doEndTag() throws JspException {

		validate();

		InfogloboStatistics qs = getInfogloboStatistics();

		Total total = new Total();
		int totalPageViews;

		try {
			total = qs.getTotal(article, from, to, getStringArray(this.type), new int[] {article.getHomeSection().getId()},
			        getStringArray(this.category), getStringArray(this.meta), Constants.QUERY_MODE_PAGEVIEW_TOTAL);

			if (total != null) {
				totalPageViews = total.getPageviews();

				if (getId() != null) {
					this.pageContext.setAttribute(getId(), totalPageViews);
				} else {
					this.pageContext.getOut().print(totalPageViews);
				}
			}
		} catch (Exception e) {
			LOGGER.error("Exception: " + e.getMessage(), e);
		} finally {
			reset();
		}

		return EVAL_PAGE;
	}

	public void release() {

		super.release();
		reset();
	}

	public String getFrom() {

		return this.from;
	}

	public void setFrom(String from) {

		this.from = from;
	}

	public String getTo() {

		return this.to;
	}

	public void setTo(String to) {

		this.to = to;
	}

	public Object getPubId() {

		return this.pubId;
	}

	public void setPubId(Object pubId) {

		this.pubId = pubId;
	}

	public boolean isIncludeContextPubId() {

		return this.includeContextPubId;
	}

	public void setIncludeContextPubId(boolean includeContextPubId) {

		this.includeContextPubId = includeContextPubId;
	}

	public Object getSectionId() {

		return this.sectionId;
	}

	public void setSectionId(Object sectionId) {

		this.sectionId = sectionId;
	}

	public Object getType() {

		return this.type;
	}

	public void setType(Object type) {

		this.type = type;
	}

	public Object getMeta() {

		return this.meta;
	}

	public void setMeta(Object meta) {

		this.meta = meta;
	}

	public Object getCategory() {

		return this.category;
	}

	public void setCategory(Object category) {

		this.category = category;
	}

	private void reset() {

		this.pubId = null;
	}

	private void validate() throws JspException {

		if (this.pubId != null) {
			if (this.pubId instanceof Integer) {
				this.pubId = new int[] {((Integer) this.pubId).intValue()};
			} else {
				if ((this.pubId instanceof String) && (((String) this.pubId).trim().equals("")))
					throw new JspException("The attribute 'pubId' must be a number (int/Integer, comma separated String or an int[].");
				if (this.pubId instanceof String)
					this.pubId = StringUtil.convertStringToIntArray((String) this.pubId);
			}
		}
		if ((!(this.pubId instanceof int[]))
		        || ((this.includeContextPubId) && (this.pageContext.getRequest().getAttribute("publication") != null))) {
			Object pub = this.pageContext.getRequest().getAttribute("publication");
			int[] contextPubId = null;
			try {
				Class className = Class.forName("neo.xredsys.api.Publication");
				Method method = className.getMethod("getId", null);
				contextPubId = new int[] {((Integer) method.invoke(pub, null)).intValue()};
				this.pubId = ArrayUtil.mergeIntArrays(contextPubId, (int[]) (int[]) this.pubId);
			} catch (Exception e) {
				System.out.println("Exception occured in MostPopularTag: " + e.getMessage());
			}

		}

		if (this.sectionId != null) {
			if (this.sectionId instanceof Integer) {
				this.sectionId = new int[] {((Integer) this.sectionId).intValue()};
			} else {
				if ((this.sectionId instanceof String) && (((String) this.sectionId).trim().equals("")))
					throw new JspException("The attribute 'sectionId' must be a number (int/Integer, comma separated String or an int[].");
				if (this.sectionId instanceof String)
					this.sectionId = StringUtil.convertStringToIntArray((String) this.sectionId);
			}
		}
		if ((this.sectionId instanceof int[]) && (this.type != null)) {
			if ((this.type instanceof String) && (((String) this.type).trim().equals("")))
				throw new JspException("The attribute 'type' was empty, but must be a String (comma separated) or a String[].");
			if (this.type instanceof String)
				this.type = StringUtil.convertCsvStringToStringArray((String) this.type);
		}
		if ((this.type instanceof String[]) && (this.meta != null)) {
			if ((this.meta instanceof String) && (((String) this.meta).trim().equals("")))
				throw new JspException("The attribute 'meta' was empty, but must be a String (comma separated) or a String[].");
			if (this.meta instanceof String)
				this.meta = StringUtil.convertCsvStringToStringArray((String) this.meta);
		}
		if ((!(this.meta instanceof String[])) || (this.category == null))
			return;
		if ((this.category instanceof String) && (((String) this.category).trim().equals("")))
			throw new JspException("The attribute 'category' was empty, but must be a String (comma separated) or a String[].");
		if (this.category instanceof String)
			this.category = StringUtil.convertCsvStringToStringArray((String) this.category);
		else if (!(this.category instanceof String[]))
			return;
	}

	/**
	 * @return the article
	 */
	public PresentationArticle getArticle() {

		return article;
	}

	/**
	 * @param paramArticle
	 *            the article to set
	 */
	public void setArticle(PresentationArticle paramArticle) {

		article = paramArticle;
	}
}