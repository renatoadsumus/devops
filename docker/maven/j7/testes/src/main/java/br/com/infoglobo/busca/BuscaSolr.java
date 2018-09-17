package br.com.infoglobo.busca;

import static java.lang.String.format;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

import neo.nursery.GlobalBus;
import neo.xredsys.presentation.PresentationArticle;
import neo.xredsys.presentation.PresentationLoader;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;

import br.com.infoglobo.farejador.cliente.Pesquisa;
import br.com.infoglobo.farejador.cliente.Resultado;
import br.com.infoglobo.farejador.componente.SolrEscenic;

/**
 * Classe que realiza uma busca no solr.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 * 
 */
public class BuscaSolr {

	/** APENAS_PUBLICADOS */
	private static final String APENAS_PUBLICADOS = "state:published";

	/** ID_CONTEUDO_SOLR */
	private static final String ID_CONTEUDO_SOLR = "objectid";

	/** Variável para logar as informações. */
	private static final Logger LOGGER = Logger.getLogger(BuscaSolr.class);
	/** Parametros da Consulta no solr. */
	private SolrParametroBusca parametro;
	/**
	 * 
	 * @param param
	 *            parametros da consulta no solr.
	 */
	public BuscaSolr(SolrParametroBusca param) {

		if (param.getPresentationLoader() == null) {
			throw new IllegalArgumentException(format("O atributo presentation loader da classe [%s] não pode ser nula.",
					param.getClass()));
		}
		this.parametro = param;
	}

	/**
	 * Executa a query no Solr
	 * @return o resultado com os ids, quantidade de resultados e os elementos instânciados.
	 * @throws MalformedURLException
	 *             exceção lançada quando não é possível realizar uma conexão no solr.
	 * 
	 * @throws SolrServerException
	 *             exceção lançada quando não é realizada uma query no solr.
	 */
	public ResultadoBusca executar() throws Exception {


		SolrEscenic solrEscenic = (SolrEscenic) GlobalBus.lookupSafe("/infoglobo/farejador/SolrService");
		LOGGER.debug("utlizada o Solr : " + solrEscenic);
		LOGGER.debug("Ids utlizados na consulta : " + parametro.getBusca());
		
		SolrQuery query = montaQuerySolr();

		Pesquisa response;

		try {
			response = solrEscenic.pesquisar(query);
		} catch (Exception e) {
			LOGGER.error(format("Não foi possivel realizar a query no Solr: [%s]", query));
			throw e;
		}
		LOGGER.debug("Consulta retornada da consulta : " + response);


		ResultadoBusca resultado = new ResultadoBusca();
		resultado.setQtdResultado(response.getEncontrados());

		List<Integer> idsConteudos = montaListaIdsConteudos(response);
		resultado.setIds(idsConteudos);

		if (parametro.isInstanciaConteudo()) {
			resultado.setListaConteudo(instanciarConteudos(parametro.getPresentationLoader(), idsConteudos));
		}

		return resultado;
	}
	/**
	 * Monta a query para o solr 
	 * @return query
	 */
	private SolrQuery montaQuerySolr() {
		SolrQuery query = new SolrQuery(parametro.getBusca())
		.addField(ID_CONTEUDO_SOLR)
		.addFilterQuery(gerarFiltroQuerySolr(parametro.getTipoConteudo()))
		.addFilterQuery(APENAS_PUBLICADOS)
		.addFilterQuery(gerarFiltroPublicacao(parametro.getNomePublicacao()))
		.setRows(parametro.getQtdElementos())
		.setStart(parametro.getIndice());

		if ("asc".equals(parametro.getOrdem())) {
			query.addSortField(parametro.getCampoOrdenacao(), SolrQuery.ORDER.asc);
		} else {
			query.addSortField(parametro.getCampoOrdenacao(), SolrQuery.ORDER.desc);
		}
		return query;
	}
	/**
	 * Monta uma lista com os ids retornados pela consulta feita no solr
	 * @param response resultado da busca
	 * @return lista com os ids
	 */
	private List<Integer> montaListaIdsConteudos(Pesquisa response) {
		List<Integer> idsConteudos = new ArrayList<Integer>();
		
		for (Resultado hit : response.getResultados()) {

			int id = hit.getId();
			if (id > 0) {
				LOGGER.debug("Id adicionado na lista que sera exibida na pagina do topico" + id);
				idsConteudos.add(id);
			}
		}
		return idsConteudos;
	}
	
	/**
	 * 
	 * @param pl presentationLoader
	 * @param ids List<>
	 * @return List<>
	 */
	public List<PresentationArticle> instanciarConteudos(PresentationLoader pl, List<Integer> ids) {

		List<PresentationArticle> listaConteudo = new ArrayList<PresentationArticle>();
		
		for (Integer idConteudo : ids) {
			LOGGER.debug("Instanciando conteudo - idConteudo: " + idConteudo);
			PresentationArticle article = pl.getArticle(idConteudo);
			//Só adicionar conteúdo que esteja ativo
			if (article != null && article.isLive()) {
				listaConteudo.add(article);
			}
		}
		return listaConteudo;
	}
	
	
	/**
	 * MÃ©todo para adequar os paramentos passados na query so Solr
	 * 
	 * @param parametros
	 *            para busca de conteudos no Solr
	 * @return uma String no formato da query
	 */
	private static String gerarFiltroQuerySolr(String[] parametros) {

		String filtro = "";

		for (int i = 0; i < parametros.length; i++) {
			filtro += "contenttype:" + parametros[i];

			if (parametros.length != i + 1) {
				filtro += " OR ";
			}

		}
		return filtro;

	}
	/**
	 * Gera o filtro por publicacao para a query no Solr 
	 * @param publicacao nome da publicacao
	 * @return filtro pela publicacao ou retorna vazio caso o campo publicacao venha como null
	 */
	private static String gerarFiltroPublicacao(String publicacao) {
		String filtro = "";
		StringBuilder sb = new StringBuilder();
		if (!StringUtils.isEmpty(publicacao)) {
			sb.append("publication:");
			sb.append(publicacao);
			filtro = sb.toString();
		}
		return filtro;
	}

}