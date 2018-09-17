package br.com.infoglobo.paywall;

import static com.escenic.servlet.Constants.COM_ESCENIC_CONTEXT_PUBLICATION;
import static java.lang.String.format;
import static neo.nursery.GlobalBus.getGlobalBus;
import static org.apache.commons.lang.StringUtils.isEmpty;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import neo.xredsys.api.Publication;

import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.actions.DispatchAction;

import br.com.infoglobo.commons.util.JsonUtils;

/**
 * 
 */
public class ControlaAcessoAction extends DispatchAction {

	private static final String CAMINHO_DE_CONFIGURACAO_DO_PAYWALL = "/infoglobo/paywall/%s/ControlaAcesso";

	private static Logger log = Logger.getLogger(ControlaAcessoAction.class);

	private static final String CONTENT_TYPE_JAVASCRIPT = "application/javascript";

	private static final String ENCODE = "UTF-8";

	private static final String CONTENT_TYPE_JSON = "application/json";

	@Override
	public ActionForward execute(ActionMapping mapping, ActionForm formpr, HttpServletRequest request, HttpServletResponse response) {

		String callbackFunctionName = null;
		String produto = null;

		try {

			ControlaAcessoForm form = (ControlaAcessoForm) formpr;
			produto = form.getProduto();

			if (isEmpty(produto)) {
				Publication publicacao = recuperarPublicacao(request);
				produto = publicacao.getName().toLowerCase();
			}

			ControlaAcesso config = getPaywallConfig(produto);

			String jsonRet = JsonUtils.serializar(config, "eventos, queryStringLiberada");
			// monta retorno
			String retorno;
			callbackFunctionName = request.getParameter("callback");

			if (isEmpty(callbackFunctionName)) { // json puro
				response.setContentType(CONTENT_TYPE_JSON);
				retorno = jsonRet;
			} else { // jsonp
				response.setContentType(CONTENT_TYPE_JAVASCRIPT);
				retorno = callbackFunctionName + "(" + jsonRet + ")";
			}

			response.setCharacterEncoding(ENCODE);
			response.getWriter().print(retorno);

		} catch (Exception e) {

			log.error(" callbackFunctionName=" + callbackFunctionName + " produto=" + produto, e);
			response.setStatus(HttpStatus.SC_METHOD_FAILURE);
		}

		return null;
	}

	private ControlaAcesso getPaywallConfig(String produto) throws Exception {

		String path = format(CAMINHO_DE_CONFIGURACAO_DO_PAYWALL, produto);

		ControlaAcesso config = (ControlaAcesso) getGlobalBus().lookupSafe(path);

		if (config == null) {

			throw new Exception(format("Nao existe a configuracao de paywall [%s] para o produto [%s].", path, produto));
		}

		return config;
	}

	private Publication recuperarPublicacao(HttpServletRequest request) {

		return (Publication) request.getAttribute(COM_ESCENIC_CONTEXT_PUBLICATION);
	}
}