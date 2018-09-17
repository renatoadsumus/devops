package br.com.infoglobo.statistics;

import static com.escenic.analysis.common.util.DateUtil.convertDateToString;
import static com.escenic.analysis.common.util.DateUtil.convertStringToDate;
import static java.util.Calendar.HOUR_OF_DAY;
import static java.util.Calendar.MINUTE;
import static org.apache.commons.lang.StringUtils.isEmpty;
import static org.apache.commons.lang.StringUtils.trimToEmpty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import neo.xredsys.presentation.PresentationArticle;
import neo.xredsys.presentation.PresentationLoader;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.escenic.analysis.qs.client.pageview.Total;

/**
 * Class to be used by components that need to retrieve statistics information from the eae query service.
 * 
 * @author mandrada
 * 
 * 
 * @deprecated  Usar a nova lib infoglobo-statistcs 
 */
@Deprecated
public class InfogloboStatistics {

	/** Maior hora de um dia. */
	private static final int MAIOR_HORA_DE_UM_DIA = 23;

	/** Maior minuto de uma hora. */
	private static final int MAIOR_MINUTO_DE_UMA_HORA = 59;

	/** Maior segundo de um minuto. */
	private static final int MAIOR_SEGUNDO_DE_UM_MINUTO = 59;

	/** The query service being used */
	private InfogloboStatisticsQueryService queryService;

	/** Presentation Loader of the publication context */
	private PresentationLoader presentationLoader;

	/** Variável para logar as informações. */
	private static final Logger LOGGER = Logger.getLogger(InfogloboStatistics.class);

	/**
	 * Returns the most read contents for the publication.
	 * 
	 * @param horas
	 *            Number of hours for the search
	 * @param minutos
	 *            Number of minutes for the search
	 * @param includeRest
	 *            Include Rest PageviewQueryManager parameter
	 * @param tiposConteudo
	 *            Content types to be searched
	 * @param contextIds
	 *            Context IDs
	 * @param publicationIds
	 *            Publication IDs
	 * @param categorias
	 *            Categories
	 * @param metas
	 *            Types of items to be counted - news, quiz, etc...
	 * @param modo
	 *            Search mode
	 * @param agruparPorPublicacao
	 *            Sets if the results should be grouped by publication
	 * @param qtdMax
	 *            Maximum number of elements returned
	 * @return List of StatisticsElement
	 * @throws Exception
	 *             Exception thrown in case of error
	 */
	public List<PresentationStatisticsElement> getAsMais(int horas, int minutos, boolean includeRest, String[] tiposConteudo,
	        int[] contextIds, int[] publicationIds, String[] categorias, String[] metas, int modo, boolean agruparPorPublicacao, int qtdMax)
	        throws Exception {

		try {
			List<PresentationStatisticsElement> stats = new ArrayList<PresentationStatisticsElement>();
			PresentationStatisticsElement presentationElement;
			PresentationArticle article;

			List<StatisticsElement> result = queryService.getAsMais(horas, minutos, includeRest, tiposConteudo, contextIds, publicationIds,
			        categorias, metas, modo, agruparPorPublicacao);

			if (result != null) {
				for (StatisticsElement element : result) {
					if (stats.size() < qtdMax) {
						article = presentationLoader.getArticle(element.getObjId());

						if (article.isLive()) {
							presentationElement = new PresentationStatisticsElement();

							presentationElement.setObjId(element.getObjId());
							presentationElement.setPageviews(element.getPageviews());
							presentationElement.setArticle(article);

							stats.add(presentationElement);
						}
					}
				}
			}
			
			if (LOGGER.isDebugEnabled()) {
				logaQueryResultado(horas, minutos, includeRest, tiposConteudo, contextIds, publicationIds,
									categorias, metas, modo, agruparPorPublicacao, qtdMax, stats);
			}

			return stats;
		} catch (Throwable e) {
			LOGGER.error(
			        "Error occured while getting AsMais with parameters: "
			                + formatParamsForError(horas, minutos, includeRest, tiposConteudo, contextIds, publicationIds, categorias,
			                        metas, modo, agruparPorPublicacao, qtdMax), e);

			return new ArrayList<PresentationStatisticsElement>();
		}
	}
	
	private void logaQueryResultado(int horas, int minutos, boolean includeRest, String[] tiposConteudo, int[] contextIds, int[] publicationIds,
			String[] categorias, String[] metas, int modo, boolean agruparPorPublicacao, int qtdMax, List<PresentationStatisticsElement> resultado) {
		StringBuilder resultadoBuilder = new StringBuilder(); 
		for (PresentationStatisticsElement element : resultado) {
			resultadoBuilder.append(String.format("{articleId:[%d], pageviews:[%d]},", element.getObjId(), element.getPageviews()));
		}
		
		String messagem = String.format("[getAsMais] horas:[%d], minutos:[%d], includeRest:[%s], tiposConteudo:[%s], contextIds:[%s], publicationIds:[%s]", 
										horas, minutos, includeRest, Arrays.toString(tiposConteudo), Arrays.toString(contextIds), Arrays.toString(publicationIds));
		messagem += String.format("categorias:[%s], metas:[%s], modo:[%d], agruparPorPublicacao:[%s], qtdMax:[%d], resultado:[%s]",
								Arrays.toString(categorias), Arrays.toString(metas), modo, agruparPorPublicacao, qtdMax, resultadoBuilder);
		LOGGER.debug(messagem);
	}

	/**
	 * Formats the parameters to display in an error message.
	 * 
	 * @param horas
	 *            Number of hours for the search
	 * @param minutos
	 *            Number of minutes for the search
	 * @param includeRest
	 *            Include Rest PageviewQueryManager parameter
	 * @param tiposConteudo
	 *            Content types to be searched
	 * @param contextIds
	 *            Context IDs
	 * @param publicationIds
	 *            Publication IDs
	 * @param categorias
	 *            Categories
	 * @param metas
	 *            Types of items to be counted - news, quiz, etc...
	 * @param modo
	 *            Search mode
	 * @param agruparPorPublicacao
	 *            Sets if the results should be grouped by publication
	 * @param qtdMax
	 *            Maximum number of elements returned
	 * @return String to be added to the error message
	 */
	private String formatParamsForError(int horas, int minutos, boolean includeRest, String[] tiposConteudo, int[] contextIds,
	        int[] publicationIds, String[] categorias, String[] metas, int modo, boolean agruparPorPublicacao, int qtdMax) {

		StringBuffer errorMessage = new StringBuffer();

		errorMessage.append("horas: " + horas);
		errorMessage.append("minutos: " + minutos);
		errorMessage.append("includeRest: " + includeRest);
		errorMessage.append("tiposConteudo: " + StringUtils.join(tiposConteudo, ","));
		errorMessage.append("contextIds: " + getStringFromIntArray(contextIds));
		errorMessage.append("publicationIds: " + getStringFromIntArray(publicationIds));
		errorMessage.append("categorias: " + StringUtils.join(categorias, ","));
		errorMessage.append("metas: " + StringUtils.join(metas, ","));
		errorMessage.append("modo: " + modo);
		errorMessage.append("agruparPorPublicacao: " + agruparPorPublicacao);
		errorMessage.append("qtdMax: " + qtdMax);

		return errorMessage.toString();
	}

	/**
	 * Formats the parameters to display in an error message.
	 * 
	 * @param objId
	 *            ID of the object being counted
	 * @param from
	 *            Start date to search
	 * @param to
	 *            Start date to search
	 * @param tiposConteudo
	 *            Content types to be searched
	 * @param contextIds
	 *            Context IDs
	 * @param publicationIds
	 *            Publication IDs
	 * @param categorias
	 *            Categories
	 * @param metas
	 *            Types of items to be counted - news, quiz, etc...
	 * @param modo
	 *            Search mode
	 * @return String to be added to the error message
	 */
	private String formatParamsForError(int objId, String from, String to, String[] tiposConteudo, int[] contextIds, int[] publicationIds,
	        String[] categorias, String[] metas, int modo) {

		StringBuffer errorMessage = new StringBuffer();

		errorMessage.append("objId: " + objId);
		errorMessage.append("from: " + from);
		errorMessage.append("to: " + to);
		errorMessage.append("tiposConteudo: " + StringUtils.join(tiposConteudo, ","));
		errorMessage.append("contextIds: " + getStringFromIntArray(contextIds));
		errorMessage.append("publicationIds: " + getStringFromIntArray(publicationIds));
		errorMessage.append("categorias: " + StringUtils.join(categorias, ","));
		errorMessage.append("metas: " + StringUtils.join(metas, ","));
		errorMessage.append("modo: " + modo);

		return errorMessage.toString();
	}

	/**
	 * Converts an int array as a formatted String with the elements separated by commas.
	 * 
	 * @param intArray
	 *            int array
	 * @return String with the elements separated by commas
	 */
	private String getStringFromIntArray(int[] intArray) {

		if (intArray == null) {
			return null;
		}

		Integer[] stringArray = new Integer[intArray.length];

		for (int i = 0; i < intArray.length; i++) {
			stringArray[i] = intArray[i];
		}

		return StringUtils.join(stringArray, ",");
	}

	/**
	 * Returns the most read contents for the publication. Returns null if an Exception occurs.
	 * 
	 * @param conteudo
	 *            a ser consultado.
	 * @param from
	 *            Start date to search
	 * @param to
	 *            Start date to search
	 * @param tiposConteudo
	 *            Content types to be searched
	 * @param contextIds
	 *            Context IDs
	 * @param categorias
	 *            Categories
	 * @param metas
	 *            Types of items to be counted - news, quiz, etc...
	 * @param modo
	 *            Search mode
	 * @return List of StatisticsElement. Returns null if an Exception occurs.
	 * @throws Exception
	 *             Exception thrown in case of error
	 */
	public Total getTotal(PresentationArticle conteudo, String from, String to, String[] tiposConteudo, int[] contextIds,
	        String[] categorias, String[] metas, int modo) throws Exception {

		try {

			return queryService.getTotal(conteudo.getId(), formatoDeDataAceito(from, conteudo.getCreatedDateAsDate()),
			        formatoDeDataAceito(to, dataMaximaDeHoje()), tiposConteudo, contextIds, new int[] {conteudo.getPublicationId()},
			        categorias, metas, modo);

		} catch (Exception e) {
			LOGGER.error(
			        "Error occured while getting Total with parameters: "
			                + formatParamsForError(conteudo.getId(), from, to, tiposConteudo, contextIds,
			                        new int[] {conteudo.getPublicationId()}, categorias, metas, modo), e);

			return null;
		}

	}

	/**
	 * @return a data máxima de hoje. Ex: 08/06/2012 23:59:59
	 */
	private static Date dataMaximaDeHoje() {

		Calendar calendar = Calendar.getInstance();

		calendar.set(HOUR_OF_DAY, MAIOR_HORA_DE_UM_DIA);
		calendar.set(MINUTE, MAIOR_MINUTO_DE_UMA_HORA);
		calendar.set(MINUTE, MAIOR_SEGUNDO_DE_UM_MINUTO);

		return calendar.getTime();

	}

	/**
	 * @param data
	 *            a ser checada o formato.
	 * @param valorPadrao
	 *            caso o primeiro valor não esteja no formato aceito.
	 * @return a data formatada no formato "yyyy-MM-dd HH:mm".
	 */
	private String formatoDeDataAceito(String data, Date valorPadrao) {

		data = trimToEmpty(data);

		if (isEmpty(data)) {

			return convertDateToString(valorPadrao);
		}

		try {

			convertStringToDate(data);

		} catch (Exception e) {

			return convertDateToString(valorPadrao);
		}

		return data;

	}

	/**
	 * @return the queryService
	 */
	public InfogloboStatisticsQueryService getQueryService() {

		return queryService;
	}

	/**
	 * @param paramQueryService
	 *            the queryService to set
	 */
	public void setQueryService(InfogloboStatisticsQueryService paramQueryService) {

		queryService = paramQueryService;
	}

	/**
	 * @return the presentationLoader
	 */
	public PresentationLoader getPresentationLoader() {

		return presentationLoader;
	}

	/**
	 * @param paramPresentationLoader
	 *            the presentationLoader to set
	 */
	public void setPresentationLoader(PresentationLoader paramPresentationLoader) {

		presentationLoader = paramPresentationLoader;
	}

}
