package gerenciador.proxy.classificados

class ProxyController {

    static allowedMethods = [index:'POST']

    def proxyService

    def index() {

        request.withFormat {
            xml {
                def msg_xml = null
                try {
                    msg_xml = request.XML
                } catch (Exception e) {
                    render(status: 400, text: 'Nao foi possivel processar o xml.')
                    log.info("Exception ao processar XML", e)
                }

                if (msg_xml == null) {
                    render(status: 400, text: 'XML nao veio no corpo do request.')
                    log.info("xml do servico de proxy do gerenciador veio null")
                } else if (msg_xml.mensagem == null || msg_xml.mensagem.text().trim() == "") {
                    render(status: 400, text: 'XML nao enviou a tag obrigatoria mensagem. Consultar protocolo.')
                    log.info("xml do servico de proxy do gerenciador veio sem a tag obrigatoria mensagem. Xml: ${msg_xml}")
                } else if (msg_xml.url == null || msg_xml.url.text().trim() == "") {
                    render(status: 400, text: 'XML nao enviou a tag obrigatoria url. Consultar protocolo.')
                    log.info("xml do servico de proxy do gerenciador veio sem a tag obrigatoria url. Xml: ${msg_xml}")
                }
                else {

                    def mensagem = [
                        mensagem: msg_xml.mensagem.text(),
                        url: msg_xml.url.text(),
                        method: msg_xml?.method?.text() ?: "POST" // default method: POST
                    ]

                    System.out.println(mensagem.mensagem)
                    System.out.println(mensagem.url)

                    proxyService.enviarMensagemViaProxy(mensagem)

                    render(text: "<response>mensagem enviada com sucesso</response>", contentType: "text/xml", encoding: "UTF-8")
                }
            }
            html {
                render(text: "<response>Erro ao enviar mensagem, formato de request HTML nao suportado</response>", contentType: "text/xml", encoding: "UTF-8")
            }
        }
    }
}


/**
 * Protocolo:
 <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
 <proxyRequest>
   <mensagem><![CDATA[<xml><da><msg><aqui>teste</aqui></msg></da></xml>]]></mensagem>
   <url></url>
   <method></method>
   <token></token>
 </proxyRequest>
 */