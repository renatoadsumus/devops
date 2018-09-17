package br.com.infoglobo.pool;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import neo.xredsys.api.IOAPI;
import neo.xredsys.api.IOHashKey;
import neo.xredsys.api.Layout;
import neo.xredsys.api.NoSuchObjectException;
import neo.xredsys.api.Publication;
import neo.xredsys.api.Section;
import neo.xredsys.presentation.PoolElement;
import neo.xredsys.presentation.PresentationArticle;
import neo.xredsys.presentation.PresentationElement;
import neo.xredsys.presentation.PresentationLoader;
import neo.xredsys.presentation.PresentationPool;
import neo.xredsys.presentation.PresentationProperty;
import neo.xredsys.presentation.PresentationRelation;
import neo.xredsys.presentation.PresentationRelationArticle;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;


public class WrappedPresentationPool implements PresentationPool {

	protected static final String GROUP_INCLUDE_NAME = "INCLUDE_REF";
	protected static final String OPTION_INCLUDE_SECTION = "INCLUDE_SECTION";
	protected static Logger LOG = Logger.getLogger(WrappedPresentationPool.class);
	
    private static final long serialVersionUID = 1L;
	private PresentationPool pool;
	private PresentationLoader loader;
	private int previewIncludeSectionId = -1;
	private int previewIncludeSectionPoolId = -1;
    
    public WrappedPresentationPool(PresentationPool pool, PresentationLoader loader, String includeSectionId, String includeSectionPoolId) {

    	this.pool = pool;
    	this.loader = loader;
    	try { 
    		this.previewIncludeSectionId = Integer.parseInt(includeSectionId);
    		this.previewIncludeSectionPoolId = Integer.parseInt(includeSectionPoolId);
    	} catch (Exception e) {
    		LOG.debug(e);
    	}
    }

    public PresentationLoader getLoader() {
        
    	return loader;
    }

	
    public int getPreviewIncludeSectionId() {
    
    	return previewIncludeSectionId;
    }

	
    public int getPreviewIncludeSectionPoolId() {
    
    	return previewIncludeSectionPoolId;
    }

	@Override
	public IOHashKey getHashKey() {

		return pool.getHashKey();
	}

	@Override
	public int getId() {

		return pool.getId();
	}

	@Override
	public int getPoolId() {

		return pool.getPoolId();
	}

	@Override
	public String getPoolTypeName() {

		return pool.getPoolTypeName();
	}

	@Override
	public String getRuleTypeName() {

		return pool.getRuleTypeName();
	}

	@Override
	public Date getActivateDate() {

		return pool.getActivateDate();
	}

	@Override
	public Date getExpireDate() {

		return pool.getExpireDate();
	}

	@Override
	public Date getCreationDate() {

		return pool.getCreationDate();
	}

	@Override
	public Date getChangedDate() {

		return pool.getChangedDate();
	}

	@Override
	public int getSectionId() {

		return pool.getSectionId();
	}

	@Override
	public int getPublicationId() {

		return pool.getPublicationId();
	}

	@Override
	public Section getSection() {

		return pool.getSection();
	}

	@Override
	public Layout getFrontpageLayout() {

		return pool.getFrontpageLayout();
	}

	@Override
	public PresentationRelationArticle getArticle(int paramInt) {

		return pool.getArticle(paramInt);
	}

	@Override
	public boolean inPool(int paramInt) {

		return pool.inPool(paramInt);
	}

	@Override
	public List getPoolElements(String paramString) {

		return pool.getPoolElements(paramString);
	}

	@Override
	public PoolElement getPoolElement(String paramString) {

		return pool.getPoolElement(paramString);
	}

	@Override
	public Publication getPublication() {

		return pool.getPublication();
	}

	@Override
	public int getArticleCount() {

		return pool.getArticleCount();
	}

	@Override
	public List getPresentationArticles() {

		return pool.getPresentationArticles();
	}

	@Override
	public boolean hasElements(String paramString) {

		return pool.hasElements(paramString);
	}

	@Override
	public List getElementGroupNames() {

		return pool.getElementGroupNames();
	}

	@Override
	public List getElements() {

		return pool.getElements();
	}

	@Override
	public PresentationElement getRootElement() {

		return new WrappedPresentationElement(pool.getRootElement(), this);
	}

	
	class WrappedPresentationElement implements PresentationElement {

        private static final long serialVersionUID = 1L;
		private PresentationElement element;
		private Map<String, PresentationElement> areas;
		private List<PresentationElement> items;
		private WrappedPresentationPool parentPool;
        
        public WrappedPresentationElement(PresentationElement element, WrappedPresentationPool parentPool) {
        	this.element = element;
        	this.parentPool = parentPool;
        }

		@Override
        public PresentationArticle getContent() {

	        return element.getContent();
        }

		@Override
        @Deprecated
        public PresentationRelation getLegacyContent() {

	        return element.getLegacyContent();
        }

		@Override
        public Map<String, PresentationElement> getAreas() {

			// wrap all areas, they could have a include group in them

			if (areas==null && element.getAreas()!=null) {
				
				areas = new LinkedHashMap<String, PresentationElement>();
				for (String key : element.getAreas().keySet()) {
					areas.put(key, new WrappedPresentationElement(element.getAreas().get(key), parentPool));
				}
			}
			
	        return areas;
        }

		@Override
        public Map<String, Object> getOptions() {

	        return element.getOptions();
        }

		@Override
        public List<PresentationElement> getItems() {

			// wrap all items of the list, could be an include group in there
			
			if (items==null && element.getItems()!=null) {
				items = new ArrayList<PresentationElement>();
				
				for (PresentationElement pe : element.getItems()) {
					
					// items may contain an include group 
					if (pe.getAreas()!=null && pe.getType()!=null && GROUP_INCLUDE_NAME.equalsIgnoreCase(pe.getType())) {
						
						// read include section from group options
						String includeSectionUniqueName = StringUtils.trim((String)pe.getOptions().get(OPTION_INCLUDE_SECTION));
						
						if (StringUtils.isBlank(includeSectionUniqueName)) {
							continue;
						}
							
						try {
							
							Section includeSection = IOAPI.getAPI().getObjectLoader().getSectionByUniqueName(parentPool.getPublicationId(), includeSectionUniqueName);
							
							PresentationPool includedPool = (parentPool.getPreviewIncludeSectionId()>0 && parentPool.getPreviewIncludeSectionPoolId()>0 && includeSection.getId()==parentPool.getPreviewIncludeSectionId()) ?
									loader.getPool(includeSection.getId(), parentPool.getPreviewIncludeSectionPoolId(), parentPool.getPublicationId()) : 
									loader.getPool(includeSection);
							
							if (includedPool!=null) {
								
								// TODO: which areas to include? for now, just the first, should be only one anyway
								PresentationElement area = includedPool.getRootElement().getAreas().values().iterator().next();
								
								items.addAll( area.getItems() );
								
							}
						} catch (NoSuchObjectException e) {
							LOG.debug("failed to get included section " + includeSectionUniqueName + ": " + e.getMessage());
						}						
						catch (Exception e) {
							LOG.error("Ative o log de debug para mais detalhes. Ocorreu o erro " + e.getMessage());
							LOG.debug("Trace", e);
						}
						
					} else {
						
						items.add( new WrappedPresentationElement(pe, parentPool) );
					}
				}
			}
			
	        return items;
        }

		@Override
        public List<String> getKeys() {

	        return element.getKeys();
        }

		@Override
        public Map<String, PresentationProperty<?>> getFields() {

	        return element.getFields();
        }

		@Override
        public PresentationElement getParent() {

	        return element.getParent();
        }

		@Override
        public String getType() {

	        return element.getType();
        }
	}
}
