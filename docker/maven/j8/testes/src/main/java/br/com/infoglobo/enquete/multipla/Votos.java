package br.com.infoglobo.enquete.multipla;

import static java.lang.String.format;

import java.util.List;

import neo.xredsys.api.IOAPI;
import neo.xredsys.api.IOEvent;
import neo.xredsys.api.IOHashKey;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import br.com.infoglobo.enquete.multipla.exception.EnqueteMultiplaException;

import com.escenic.poll.MentometerOption;

public class Votos {

	private List<MentometerOption> votos;

	private int idPublicacao;

	private String mentometerId;

	private String nomePublicacao;

	/** Variável para logar informações do sistema. */
	private static final Logger LOG = Logger.getLogger(Votos.class);

	public Votos(List<MentometerOption> votos, int idPublicacao, String mentometerId, String nomePublicacao) throws EnqueteMultiplaException {

		if (votos == null) {
			throw new EnqueteMultiplaException(format("A lista de votos da publicação : [%s] - retornou como null. Enquete com id : [%s]",
			        nomePublicacao, mentometerId));
		}

		if (votos.size() == 0) {
			throw new EnqueteMultiplaException(format("A lista de votos da publicação : [%s] - retornou vazia. Enquete com id : [%s]",
			        nomePublicacao, mentometerId));
		}

		if (idPublicacao < 0) {
			throw new EnqueteMultiplaException(format("O id da publicação está [%s] , da enquete com o id : [%s] ", idPublicacao, mentometerId));
		}

		if (StringUtils.isEmpty(mentometerId)) {
			throw new EnqueteMultiplaException(format("O id enquete está [%s] , da publicação : [%s] ", mentometerId, idPublicacao));
		}

		if (StringUtils.isEmpty(nomePublicacao)) {
			throw new EnqueteMultiplaException(format("O nome da publicação está [%s] , da enquete com o id : [%s] ", nomePublicacao,
			        mentometerId));
		}

		this.idPublicacao = idPublicacao;
		this.votos = votos;
		this.mentometerId = mentometerId;
		this.nomePublicacao = nomePublicacao;
	}

	public boolean registrar() {

		if (votos != null && votos.size() > 0) {

			for (MentometerOption voto : votos) {

				/*
				 * Registra o voto
				 */
				voto.incVotes();
				IOHashKey objectKey = new IOHashKey(11, Integer.parseInt(voto.getMentometer().getArticleID()), idPublicacao);
				IOEvent event = new IOEvent(this, 3, objectKey);
				event.setParameter("eventAction", "mentometer.incVotes()");
				MentometerOption[] listaOpcoes = voto.getMentometer().getMentometerOption();
				for (int i = 0; i < listaOpcoes.length; i++) {
					if (listaOpcoes[i].getArticleElement().equals(voto.getArticleElement())) {
						event.setParameter("index", new Integer(i));
						break;
					}
				}

				if (LOG.isDebugEnabled()) {
					LOG.debug(format("Publicacao : [%s] - Salvando o evento: [%s] para a enquete múltipla: [%s]", nomePublicacao, event, mentometerId));
				}
				IOAPI.getAPI().getEventManager().postEvent(event, false, true);
			}

		}

		return false;

	}

	/**
	 * @return o valor do <i>field</i> '<b>idPublicacao</b>'
	 */
	public int getIdPublicacao() {

		return idPublicacao;
	}

	/**
	 * @return o valor do <i>field</i> '<b>votos</b>'
	 */
	public List<MentometerOption> getVotos() {

		return votos;
	}

	/**
	 * @return o valor do <i>field</i> '<b>idEnquete</b>'
	 */
	public String getIMentometerId() {

		return mentometerId;
	}

	/**
	 * @return o valor do <i>field</i> '<b>nomePublicacao</b>'
	 */
	public String getNomePublicacao() {

		return nomePublicacao;
	}

}
