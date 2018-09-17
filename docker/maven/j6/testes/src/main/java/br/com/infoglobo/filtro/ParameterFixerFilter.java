package br.com.infoglobo.filtro;

import static java.lang.Boolean.parseBoolean;
import static org.apache.commons.lang.StringUtils.isNotEmpty;
import static org.apache.commons.lang.StringUtils.trimToEmpty;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import neo.nursery.GlobalBus;

import org.apache.log4j.Logger;

import br.com.infoglobo.common.InfogloboProperties;

public class ParameterFixerFilter implements Filter {

	private static final Logger LOG = Logger.getLogger(ParameterFixerFilter.class);

	private InfogloboProperties infogloboProperties;

	@Override
	public void destroy() {

		infogloboProperties = null;
	}

	@Override
	public void doFilter(ServletRequest pRequest, ServletResponse response, FilterChain chain) throws IOException, ServletException {

		
		boolean workaroundAtivado = parseBoolean(infogloboProperties.getProperty("weblogicParameterWorkaroundEnabled"));
		
		LOG.debug("WorkaroundAtivado: " + workaroundAtivado);
		
		if (!workaroundAtivado) {
			
			chain.doFilter(pRequest, response);
        } else {
        	HttpServletRequest request = ((HttpServletRequest) pRequest);
    		
    		String url = request.getRequestURL().toString();
    		String queryString = trimToEmpty(request.getQueryString());

    		if (request.getParameterMap().isEmpty() && isNotEmpty(queryString)) {

    			LOG.debug("QueryString EMPTY para Url [" + url + "?" + queryString + "]");

    			chain.doFilter(new ParameterFixerHttpServletRequestWrapper(request, queryString), response);
    		} else {

    			LOG.debug("QueryString FULL para Url [" + url + "?" + queryString + "]");

    			chain.doFilter(pRequest, response);
    		}
        }		
	}

	@Override
	public void init(FilterConfig config) throws ServletException {

		infogloboProperties = (InfogloboProperties) GlobalBus.lookupSafe("/Infoglobo");
	}

}
