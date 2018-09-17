package gerenciador.proxy.classificados

import grails.transaction.Transactional
import grails.plugins.rest.client.RestBuilder
import org.springframework.http.MediaType

@Transactional
class ProxyService {

    def executorService
    def definicoesSistemaService

    def enviarMensagemViaProxy(mensagem) {

        log.info("operacao=enviarMensagemViaProxy status=iniciando")

        def url = mensagem.url
        def xml = mensagem.mensagem
        def method = mensagem.method

        log.info("operacao=enviarMensagemViaProxy url=${url} method=${method} xml=[${xml}]")

        def connectTimeout = tentarObterChaveInteiroSistema("gerenciador.proxy.connecttimeout", 5000)
        def readTimeout = tentarObterChaveInteiroSistema("gerenciador.proxy.readtimeout", 5000)
        def proxyHost = tentarObterChaveStringSistema("gerenciador.proxy.host", "")
        def proxyPort = tentarObterChaveInteiroSistema("gerenciador.proxy.port", 0)

        if (method == "POST") {
            log.info("operacao=enviarMensagemViaProxy enviarVia=POST")
            enviarViaPOST(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout)
        } else if (method == "PUT") {
            log.info("operacao=enviarMensagemViaProxy enviarVia=PUT")
            enviarViaPUTViaExecutor(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout)
        } else {
            log.warn("operacao=enviarMensagemViaProxy status=methodNaoEncontrado methodRecebido=${method}")
        }

        log.info("operacao=enviarMensagemViaProxy status=fim_envio")
    }

    def enviarViaPOSTViaExecutor(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout) {
        // duplicado dessa forma por causa da testabilidade
        executorService.execute {
            enviarViaPOST(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout)
        }
    }

    def enviarViaPOST(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout) {
        log.info("operacao=enviarViaPOST status=iniciando_execute")
        def restBuilder = obterRestBuilder(proxyHost, proxyPort, connectTimeout, readTimeout)

        log.info("operacao=enviarViaPOST status=enviando_post_via_restBuilder")

        def response = null
        try {
            response = restBuilder.post(url) {
                accept(MediaType.APPLICATION_XML_VALUE)
                contentType(MediaType.APPLICATION_XML_VALUE)
                body(xml)
            }

            log.info("status=sucesso_ao_enviar_feedback url=${url} xml=${xml}")
            if (response != null) {
                log.info("Response status code: ${response.getStatusCode()}")
                log.info("Response body: ${response.getBody()}")
            }
        } catch (Exception e) {
            log.warn("status=exception_ao_enviar_feedback", e)
        }
    }

    def enviarViaPUTViaExecutor(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout) {
        // duplicado dessa forma por causa da testabilidade
        executorService.execute {
            enviarViaPUT(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout)
        }
    }

    def enviarViaPUT(xml, url, proxyHost, proxyPort, connectTimeout, readTimeout) {
        log.info("operacao=enviarViaPUT status=iniciando_execute")
        def restBuilder = obterRestBuilder(proxyHost, proxyPort, connectTimeout, readTimeout)

        log.info("operacao=enviarViaPUT status=enviando_put_via_restBuilder")
        def response = null

        try {
            response = restBuilder.put(url) {
                accept(MediaType.APPLICATION_XML_VALUE)
                contentType(MediaType.APPLICATION_XML_VALUE)
                body(xml)
            }

            log.info("status=sucesso_ao_enviar_feedback url=${url} xml=${xml}")
            if (response != null) {
                log.info("Response status code: ${response.getStatusCode()}")
                log.info("Response body: ${response.getBody()}")
            }
        } catch (Exception e) {
            log.warn("status=exception_ao_enviar_feedback", e)
        }
    }

    def obterRestBuilder(String proxyHost, int proxyPort, int connectTimeout, int readTimeout) {
        def rest
        if (proxyHost != "" && proxyPort != 0) {
            log.info("operacao=obterRestBuilder status=obtendo_com_proxy")
            rest = new RestBuilder(connectTimeout: connectTimeout, readTimeout: readTimeout, proxy: [(proxyHost): proxyPort])
        } else {
            log.info("operacao=obterRestBuilder status=obtendo_sem_proxy")
            rest = new RestBuilder(connectTimeout: connectTimeout, readTimeout: readTimeout)
        }
        rest
    }

    def tentarObterChaveInteiroSistema(chaveSistema, valorPadrao) {
        def valorChaveSistema
        try {
            valorChaveSistema = definicoesSistemaService.obterInteiroPorChave(chaveSistema)
            log.info("operacao=tentarObterChaveSistema status=chave_obtida chave=${chaveSistema} valor=${valorChaveSistema}")
        } catch (Exception ex) {
            log.warn("operacao=tentarObterChaveSistema status=fallback_para_valor_padrao chave=${chaveSistema} valor=${valorPadrao}", ex)
            valorChaveSistema = valorPadrao
        }
        return valorChaveSistema
    }

    def tentarObterChaveStringSistema(chaveSistema, valorPadrao) {
        def valorChaveSistema
        try {
            valorChaveSistema = definicoesSistemaService.obterPorChave(chaveSistema)
            log.info("operacao=tentarObterChaveSistema status=chave_obtida chave=${chaveSistema} valor=${valorChaveSistema}")
        } catch (Exception ex) {
            log.warn("operacao=tentarObterChaveSistema status=fallback_para_valor_padrao chave=${chaveSistema} valor=${valorPadrao}", ex)
            valorChaveSistema = valorPadrao
        }
        return valorChaveSistema
    }
}
