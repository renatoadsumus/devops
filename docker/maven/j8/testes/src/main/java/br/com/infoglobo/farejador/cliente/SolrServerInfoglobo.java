package br.com.infoglobo.farejador.cliente;

import java.util.Comparator;
import java.util.Date;
import java.util.TreeMap;

import org.apache.log4j.Logger;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;

import br.com.infoglobo.common.InfogloboProperties;
import br.com.infoglobo.farejador.componente.SolrEscenic;
import br.com.infoglobo.farejador.exceptions.ComponenteDesabilitado;
import br.com.infoglobo.farejador.exceptions.SegurancaViolada;
import br.com.infoglobo.farejador.exceptions.TimeoutException;
import br.com.infoglobo.monitoring.FrequencyMonitoring;


public class SolrServerInfoglobo {
	
	private static final Logger LOG = Logger.getLogger(SolrServerInfoglobo.class);

	private static final int VALOR_LIMITE_RESULTADOS_SOLR = 10;
	private static final int TAMANHO_MAX_QUERIES_LENTAS = 50;
	private static final int LIMITE_CARACTERS_REGISTRO = 1000;
	
	private SolrEscenic solrEscenic;
	private FrequencyMonitoring frequencyMonitoring;
	private InfogloboProperties globalProperties;
	
	private Integer tempoMaximoPermitidoParaQuery;
	private Integer limiteMaximoDeResultadosPermitidoParaQuery;
	
	private TreeMap<Long, String> timeoutQueries = new TreeMap<Long, String>(new Comparator<Long>() {
															public int compare(Long o1, Long o2) {
																return o2.compareTo(o1);
															}
														});
	private String queryDeTeste = "*:*";

	public void doStartService() {
		solrEscenic.setTimeoutEmMs(tempoMaximoPermitidoParaQuery);
	}
	
	public synchronized void limpaQueriesLentas() {
		timeoutQueries.clear();
	}
	
	public QueryResponse executarTeste() {
		return pesquisar(new SolrQuery(getQueryDeTeste()));
	}
	
	public QueryResponse pesquisar(SolrQuery query) {
		configuraLimiteMaximoDeResultadosPermitidoParaQuery(query);
		logaQuery(query);
		return executaBusca(query).getResponse();
	}

	private void configuraLimiteMaximoDeResultadosPermitidoParaQuery(SolrQuery query) {
		if (query.getRows() == null) { query.setRows(VALOR_LIMITE_RESULTADOS_SOLR); }
		if (query.getRows() > getLimiteMaximoDeResultadosPermitidoParaQuery()) {
			query.setRows(getLimiteMaximoDeResultadosPermitidoParaQuery());
		}
    }
	
	private Pesquisa executaBusca(SolrQuery query) {
		long inicio = System.currentTimeMillis();
		Pesquisa pesquisa;
		try {
			pesquisa = solrEscenic.pesquisar(query);
		} catch (ComponenteDesabilitado e) {
			LOG.error("[executaBusca] ComponenteDesabilitado.", e);
        	throw new RuntimeException(e);
        } catch (SegurancaViolada e) {
        	LOG.error("[executaBusca] SegurancaViolada.", e);
        	throw new RuntimeException(e);
        } catch (TimeoutException e) {
        	LOG.error("[executaBusca] Timeout.", e);
        	registraTimeout(query, tempoDeExecucao(inicio));
        	logaTimeout(query, tempoDeExecucao(inicio));
        	throw e;
        } finally {
        	atualizaEstatisticas(query, tempoDeExecucao(inicio));
        }
		logaTempoDeExecucao(tempoDeExecucao(inicio));
	    return pesquisa;
    }

	private synchronized void registraTimeout(SolrQuery query, long tempoDeExecucao) {
		String novoRegistro = "{Data:[" + new Date() + "], Query:[" + query.toString() + "]}";
		String registro = timeoutQueries.get(tempoDeExecucao);
		if (registro != null) {
			if (registro.length() < LIMITE_CARACTERS_REGISTRO) {
				novoRegistro = registro + "|" + novoRegistro;
			} else if (!registro.endsWith("(mais)")) {
				novoRegistro = registro + "... (mais)";
			} else {
				novoRegistro = registro;
			}
		}
		timeoutQueries.put(tempoDeExecucao, novoRegistro);
		if (timeoutQueries.size() > TAMANHO_MAX_QUERIES_LENTAS) {
			timeoutQueries.remove(timeoutQueries.lastKey());
		}
	}
	
	private long tempoDeExecucao(long inicio) {
	    return System.currentTimeMillis() - inicio;
    }
	
	private void atualizaEstatisticas(SolrQuery query, long tempoDeExecucao) {
		if (getFrequencyMonitoring() != null) {
			getFrequencyMonitoring().increase();
			getFrequencyMonitoring().addDuration(tempoDeExecucao);
		}
    }
	
	private void logaQuery(SolrQuery query) {
		LOG.debug("Query executada:[" + query + "].");
    }
	
	private void logaTimeout(SolrQuery query, long tempo) {
		LOG.error("Ocorreu timeout para a query:[" + query + "]. " + criaLogDeTempo(tempo));
    }

	private void logaTempoDeExecucao(long tempo) {
		LOG.debug(criaLogDeTempo(tempo));
    }
	
	private String criaLogDeTempo(long tempo) {
	    return "Tempo de Execucao:[" + tempo + "].";
    }

	public SolrEscenic getSolrEscenic() {
    	return solrEscenic;
    }
	
    public void setSolrEscenic(SolrEscenic solrEscenic) {
    	this.solrEscenic = solrEscenic;
    }
    
    public Integer getTempoMaximoPermitidoParaQuery() {
    	return tempoMaximoPermitidoParaQuery;
    }
	
    public void setTempoMaximoPermitidoParaQuery(Integer tempoMaximoPermitido) {
    	this.tempoMaximoPermitidoParaQuery = tempoMaximoPermitido;
    }
    
    public Integer getLimiteMaximoDeResultadosPermitidoParaQuery() {
    	return limiteMaximoDeResultadosPermitidoParaQuery;
    }
	
    public void setLimiteMaximoDeResultadosPermitidoParaQuery(Integer limiteMaximoDeResultadosPermitidoParaQuery) {
    	this.limiteMaximoDeResultadosPermitidoParaQuery = limiteMaximoDeResultadosPermitidoParaQuery;
    }
    
    public TreeMap<Long, String> getTimeoutQueries() {
    	return timeoutQueries;
    }
    
    public FrequencyMonitoring getFrequencyMonitoring() {
	    return frequencyMonitoring;
    }

	public void setFrequencyMonitoring(FrequencyMonitoring frequencyMonitoring) {
	    this.frequencyMonitoring = frequencyMonitoring;
    }
	
    public String getQueryDeTeste() {
    	return queryDeTeste;
    }
	
    public void setQueryDeTeste(String queryDeTeste) {
    	this.queryDeTeste = queryDeTeste;
    }
    
    public InfogloboProperties getGlobalProperties() {
    	return globalProperties;
    }
	
    public void setGlobalProperties(InfogloboProperties properties) {
    	this.globalProperties = properties;
    }
}