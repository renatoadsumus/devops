package br.com.infoglobo.filtro;

import static org.apache.commons.lang.StringUtils.isBlank;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class ParameterFixerHttpServletRequestWrapper extends HttpServletRequestWrapper {
	private Map<String, String[]> parameters = new TreeMap<String, String[]>();

	public ParameterFixerHttpServletRequestWrapper(final HttpServletRequest request, final String queryString) {
		super(request);
		this.addParameters(queryString);
		this.parameters = Collections.unmodifiableMap(this.parameters);
	}
	
	private void addParameters(final String queryString) {
		final Map<String, List<String>> parametersMap = new TreeMap<String, List<String>>();
		for(String termo : queryString.split("&")) {
			
			if (isBlank(termo)) {
	            continue;
            }
			
			String[] chaveValor = termo.split("=");
			String parametro = chaveValor[0];
			String valor = chaveValor.length == 1 ? null : chaveValor[1]; 
			
			if(parametersMap.containsKey(chaveValor[0])) {
				parametersMap.get(parametro).add(valor);
			} else {
				List<String> valores = new ArrayList<String>();
				valores.add(valor);
				parametersMap.put(parametro, valores);
			}
		}
		
		for(String chave : parametersMap.keySet()) {
			String[] valores = parametersMap.get(chave).toArray(new String[parametersMap.get(chave).size()]);
			parameters.put(chave, valores);
		}
	}

	@Override
	public String getParameter(String name) {
		String[] parameter = this.parameters.get(name);
		if (parameter != null) {
			return parameter[0];
		} else {
			return null;
		}
	}

	@Override
	public Map<String, String[]> getParameterMap() {
		return this.parameters;
	}

	@Override
	public Enumeration<String> getParameterNames() {
		return (new Vector<String>(this.parameters.keySet())).elements();
	}

	@Override
	public String[] getParameterValues(String name) {
		return this.parameters.get(name);
	}
}
