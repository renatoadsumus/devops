package br.com.infoglobo.pool;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import neo.xredsys.presentation.PresentationPool;
import br.com.infoglobo.util.InfogloboUtil;
import br.com.infoglobo.util.WebAppBusUtil;


public class PoolWrapper {

	protected static Logger LOG = Logger.getLogger(PoolWrapper.class);
	
	public static PresentationPool ensureWrappedPool(PresentationPool pool, HttpServletRequest request) {
		
		if ( !(pool instanceof WrappedPresentationPool)) {
			try {
				
				String includeSectionId = request.getParameter("isid");
				String includeSectionPoolId = request.getParameter("ispid");
				
		        return new WrappedPresentationPool(pool, WebAppBusUtil.getPresentationLoader(InfogloboUtil.getPublicacao(request).getName()), includeSectionId, includeSectionPoolId);
		        
	        } catch (Exception e) {
	        	
	        	LOG.error("failed to wrap pool", e);
	        }
		}
		return pool;
	}
}
