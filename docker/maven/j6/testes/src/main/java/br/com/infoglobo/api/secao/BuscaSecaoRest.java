package br.com.infoglobo.api.secao;

import static br.com.infoglobo.commons.util.JsonUtils.serializarSomente;
import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT_PUBLICATION;
import static java.lang.String.format;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.Publication;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;

import br.com.infoglobo.api.util.ConfiguracaoNaoEncontrada;
import br.com.infoglobo.api.util.RecuperaConfiguracaoSecao;

public class BuscaSecaoRest extends DispatchAction {

	private static final Logger LOG = Logger.getLogger(BuscaSecaoRest.class);

	private static final String CONTENT_TYPE_JSON = "application/json";

	private static final String ENCODE = "UTF-8";

	public ActionForward lista(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) {

		try {

			BuscaSecaoForm buscaSecaoForm = (BuscaSecaoForm) form;

			Publication publicacao = recuperarPublicacao(request);

			BuscaSecaoConfig config = new RecuperaConfiguracaoSecao(publicacao.getName(), buscaSecaoForm.getApp(),
			        buscaSecaoForm.getConfig()).config();

			BuscaSecao busca = BuscaSecao.instancia(getServlet().getServletContext());

			List<Secao> resultado = busca.procurar(config, publicacao);

			response.getWriter().print(serializarSomente(resultado, config.getCamposDeExibicaoPadrao()));

			response.setContentType(CONTENT_TYPE_JSON);
			response.setCharacterEncoding(ENCODE);

			// response.setHeader("Cache-Control", "max-age = 180");
			// response.setDateHeader("Expires", 180);

		} catch (ConfiguracaoNaoEncontrada e) {

			LOG.debug(e);
			response.setStatus(SC_NOT_FOUND);
			geraMensagemDeErro(response, "Pagina não encontrada.");
		} catch (Exception e) {

			LOG.error("Nao foi possivel gerar o json para a resposta.", e);
		}

		return null;
	}

	protected void geraMensagemDeErro(HttpServletResponse response, String mensagem) {

		String mensagemJson = format("{mensagemDeErro: '%s'}", mensagem);

		try {

			response.getWriter().print(mensagemJson);
		} catch (IOException e) {

			LOG.error(format("[geraMensagemDeErro] não possível adicionar a mensagem [%s] no response", mensagemJson), e);
		}
	}

	protected Publication recuperarPublicacao(HttpServletRequest request) {

		return (Publication) request.getAttribute(COM_ESCENIC_CONTEXT_PUBLICATION);
	}
}
