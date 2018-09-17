package br.com.infoglobo.api.secao;

import static com.escenic.servlet.ApplicationBus.getApplicationBus;
import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.startsWith;
import static org.apache.commons.lang.StringUtils.trimToEmpty;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.ServletContext;

import neo.xredsys.api.NoSuchObjectException;
import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Publication;
import neo.xredsys.api.Section;

import org.apache.log4j.Logger;

public class BuscaSecao {

	private static final String PAGINA_DE_BLOG = "blog";

	private static final Logger LOG = Logger.getLogger(BuscaSecao.class);

	private static final int STATUS_SECAO_PUBLICADA = 1;

	private ObjectLoader loader;

	public static BuscaSecao instancia(ServletContext context) {

		return (BuscaSecao) getApplicationBus(context).lookupSafe("/infoglobo/api/secao/BuscaSecao");
	}

	public List<Secao> procurar(BuscaSecaoConfig config, Publication publicacao) {

		List<Secao> secoes = new ArrayList<Secao>();

		for (String uniquename : config.getRecuperaAsSecoesAPartirDe()) {
			try {

				Section section = loader.getSectionByUniqueName(publicacao.getId(), trimToEmpty(uniquename));

				if (secaoValida(config, section)) {

					Secao apiSecao = new Secao(section, config);

					apiSecao.setSubSecoes(buscaSubSecao(section.getSubSections(), config, 2));

					secoes.add(apiSecao);
				}

			} catch (NoSuchObjectException e) {

				LOG.error(format("A editoria com uniquename [%s] nao existe", uniquename), e);
				continue;
			}
		}

		if (config.isOrdenar()) {

			Collections.sort(secoes);
		}

		return secoes;
	}

	private List<Secao> buscaSubSecao(Section[] subSections, BuscaSecaoConfig config, int nivel) {

		List<Secao> secoes = new ArrayList<Secao>();

		if (nivel <= config.getNivelMaximo()) {
			for (Section section : subSections) {
				if (secaoValida(config, section)) {

					Secao apiSecao = new Secao(section, config);

					apiSecao.setSubSecoes(buscaSubSecao(section.getSubSections(), config, nivel + 1));

					secoes.add(apiSecao);
				}
			}
		}

		return secoes;
	}

	private boolean secaoValida(BuscaSecaoConfig config, Section secao) {

		if (config.getSecoesIgnoradas().contains(secao.getUniqueName())
		        || (config.isIgnoraBlog() && PAGINA_DE_BLOG.equals(secao.getParameter("tipo.pagina")))
		        || (config.isIgnoraTopico() && startsWith(secao.getUniqueName(), "topico-")) 
		        || secao.getState() != STATUS_SECAO_PUBLICADA) {

			return false;
		}

		return true;
	}

	public ObjectLoader getLoader() {

		return loader;
	}

	public void setLoader(ObjectLoader loader) {

		this.loader = loader;
	}

}
