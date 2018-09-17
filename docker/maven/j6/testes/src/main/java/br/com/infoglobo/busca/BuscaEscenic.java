package br.com.infoglobo.busca;

import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.isNotEmpty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import neo.xredsys.api.LatestArticlesQuery;
import neo.xredsys.api.Publication;
import neo.xredsys.presentation.PresentationArticle;
import br.com.infoglobo.util.EscenicUtil;

/**
 * Classe que realiza uma consulta no escenic, ela tem o comportamento parecido com o
 * article list da escenic.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 *
 */
@Deprecated
public class BuscaEscenic {
	
	/** Parametros da Consulta no escenic. */
	private EscenicParametroBusca parametro;

	/**
	 * 
	 * @param param
	 *            parametros da consulta no solr.
	 */
	public BuscaEscenic(EscenicParametroBusca param) {

		if (param.getIdPublicacao() < 1 && param.getNomePublicacao() == null) {
			throw new IllegalArgumentException(format(
			        "Os atributos nomePublicacao ou idPublicacao da classe [%s] não pode ser nula ou nem menor que 1 respectivamente.",
			        param.getClass()));
		}

		if (param.getPresentationLoader() == null) {
			throw new IllegalArgumentException(format("O atributo presentation loader da classe [%s] não pode ser nula.",
					param.getClass()));
		}
		
		if (param.getTipoConteudo() == null) {
			throw new IllegalArgumentException(format("O atributo tipo conteúdo da classe [%s] não pode ser nula.", param.getClass()));
		}
		
		this.parametro = param;
	}
	
	/**
	 * @return a lista dos presentation articles encontrados no escenic.
	 */
	@SuppressWarnings("unchecked")
    public List<PresentationArticle> executar() {

		Publication publication;

		if (parametro.getIdPublicacao() > 0) {
			publication = EscenicUtil.getPublicacao(parametro.getIdPublicacao());
		} else {
			publication = EscenicUtil.getPublicacao(parametro.getNomePublicacao());
		}
		
		LatestArticlesQuery query = new LatestArticlesQuery(publication.getId());

		if (isNotEmpty(parametro.getBusca())) {
			query.setExpression(parametro.getBusca());
		}

		if (parametro.getQtdElementos() > 0 || parametro.getQtdElementos() == -1) {
			query.setMax(parametro.getQtdElementos());
		}

		if (parametro.getIdsSecao() != null) {
			query.setSectionIds(parametro.getIdsSecao());
		} else {
			query.setSectionIds(new int[] {publication.getRootSection().getId()});
		}

		if (isNotEmpty(parametro.getCampoOrdenacao())) {
			query.setField(parametro.getCampoOrdenacao());
		}

		if (isNotEmpty(parametro.getDataInicial())) {
			query.setFromDate(parametro.getDataInicial());
		}

		if (isNotEmpty(parametro.getDataFinal())) {
			query.setToDate(parametro.getDataFinal());
		}

		query.setOrderBy(parametro.getCampoOrdenacao());

		query.setHomeSectionOnly(parametro.isApenasSecaoPrincipal());
		query.setOnlyLive(parametro.isSomentePublicados());
		query.setIncludeSubSections(parametro.isIncluirSubSecoes());
		query.setDescending(parametro.isDescendente());

		query.setIncludeArticleTypes(Arrays.asList(parametro.getTipoConteudo()));

		List<PresentationArticle> listaUltimas = parametro.getPresentationLoader().getLatestArticles(query);

		if (listaUltimas == null) {
			return new ArrayList<PresentationArticle>();
		}

		return listaUltimas;
	}
	
	/**
	 * Método genérico para retornar uma lista de decorator na busca do escenic.
	 * @param <T>
	 * Tipo que será retornado.
	 * @param clazz
	 * classe do decorator que irá ser retornado.
	 * @return a lista de um decorator de acordo com o parametro informado.
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> executar(Class<T> clazz) {
		List<T> lista = new ArrayList<T>(); 

		for (PresentationArticle pa : executar()) {
			if (clazz.isInstance(pa)) {
				lista.add((T) pa);
			}
		}
		return lista;
	}
	
	/**
	 * 
	 * @param <T>
	 * Tipo que será retornado.
	 * @param clazz classe generica
	 * @param imagemPrincipal true para retornar lista apenas com imagens validas
	 * @param nomeArea nome da área para das imagens
	 * @return recupera uma lista valida baseada na regra passada
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> executar(Class<T> clazz, boolean imagemPrincipal, String nomeArea) {
		
		
		List<T> lista = new ArrayList<T>(); 

		for (PresentationArticle pa : executar()) {
			if (clazz.isInstance(pa)) {
				if (imagemPrincipal) {
					if (pa.getRelatedElements().get(nomeArea) != null) {
						lista.add((T) pa);
					}
				} else {
					lista.add((T) pa);
				}
			}
		}
		return lista;
	}

}
