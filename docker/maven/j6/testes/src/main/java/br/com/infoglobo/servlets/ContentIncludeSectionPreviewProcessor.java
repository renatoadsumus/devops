package br.com.infoglobo.servlets;

import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT_SECTION_ID;
import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.EMPTY;
import static org.apache.commons.lang.StringUtils.isNotEmpty;

import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.IOAPI;
import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Section;

import org.apache.log4j.Logger;

import com.escenic.presentation.servlet.GenericProcessor;

public class ContentIncludeSectionPreviewProcessor extends GenericProcessor {

	private static final String SECTION_DEFAULT = "content.include";

	private static final Logger LOG = Logger.getLogger(ContentIncludeSectionPreviewProcessor.class);

	private static final String PREVIEW_URL = "%s?ispid=%s&isid=%s&com.escenic.stale=false&token=%s%s";

	private Map<String, String> prefixMapping = new TreeMap<String, String>();

	private Map<String, String> sectionPreview = new TreeMap<String, String>();

	private ObjectLoader loader = IOAPI.getAPI().getObjectLoader();
	
	public ContentIncludeSectionPreviewProcessor() {

		addSectionPreview(SECTION_DEFAULT, "Content Include Section");
	}

	@Override
	public boolean doBefore(ServletContext context, ServletRequest request, ServletResponse response) throws ServletException, IOException {

		String poolId = request.getParameter("poolId");
		String token = request.getParameter("token");

		if (isNotEmpty(poolId) && isNotEmpty(token)) {

			try {

				Section contextSection = loader.getSection((Integer) request.getAttribute(COM_ESCENIC_CONTEXT_SECTION_ID));

				if (isSectionPreview(contextSection)) {

					Section contentSection = getContentSection(contextSection); 
							
					if (contentSection != null) {

						String newUrl = createNewUrl(contentSection, contextSection, token, poolId);

						((HttpServletResponse) response).sendRedirect(newUrl);

						return false;
					}
				}

			} catch (Exception e) {

				LOG.error("Falha no filtro de preview", e);
			}
		}

		return true;
	}
	
	private Section getContentSection(Section includeSection) {
		
		Section result = null;
		try {
			result = loader.getSectionByUniqueName(includeSection.getOwnerPublicationId(), getContentSectionUniqueName(includeSection));
		} catch (Exception e) {}

		if (result==null) {
			// fallback to front page
			try {
				result = loader.getSectionByUniqueName(includeSection.getOwnerPublicationId(), "ece_frontpage");
			} catch (Exception e) {}
		}
		
		if (LOG.isDebugEnabled()) {
			LOG.debug("for include section " + getSectionInfo(includeSection) + ", preview content section is: " + getSectionInfo(result));
		}
		
		return result;
	}

	private String getSectionInfo(Section s) {
		return (s!=null) ? (s.getUniqueName()+"(id:" + s.getId() + ")") : "(NULL)";
	}
	
	private boolean isSectionPreview(Section contextSection) {

		for (String section : sectionPreview.keySet()) {
			if (contextSection.getUniqueName().startsWith(section)) {

				return true;
			}
		}

		return false;
	}

	private String createNewUrl(Section contentSection, Section contextSection, String token, String poolId) {

		String additionalParam = EMPTY;

		for (String prefix : prefixMapping.keySet()) {
			if (contextSection.getUniqueName().startsWith(prefix)) {

				additionalParam += "&" + prefixMapping.get(prefix);
			}
		}

		return format(PREVIEW_URL, contentSection.getUrl(), poolId, contextSection.getId(), token, additionalParam);
	}

	private String getContentSectionUniqueName(Section section) {

		String uniquename = section.getDeclaredParameter("contentSectionPreview");

		if (isNotEmpty(uniquename)) {

			return uniquename;
		}

		return "ece_frontpage";
	}

	public void addSectionPreview(String sectionUniqueName, String param) {

		sectionPreview.put(sectionUniqueName, param);
	}

	public Map<String, String> getSectionPreviews() {

		return sectionPreview;
	}

	public void addPrefixMapping(String prefix, String param) {

		prefixMapping.put(prefix, param);
	}

	public Map<String, String> getPrefixMappings() {

		return prefixMapping;
	}
}
