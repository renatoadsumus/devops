package gerenciador.proxy.classificados


import grails.plugins.rest.client.RestBuilder
import grails.test.mixin.TestFor
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.anything
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess

/**
 * See the API for {@link grails.test.mixin.services.ServiceUnitTestMixin} for usage instructions
 */
@TestFor(ProxyService)

class ProxyServiceSpec extends Specification {

    def setup() {
    }

    def cleanup() {
    }

    void "teste de envio de mensagem PUT"() {
        given:
        def rest = new RestBuilder()
        def mockServer = MockRestServiceServer.createServer(rest.restTemplate)
        mockServer.expect(requestTo("http://www.example.com"))
                .andExpect(method(HttpMethod.PUT))
                .andExpect(header("Accept", "application/xml"))
                .andRespond(withSuccess('<msg>mensagem recebida com sucesso</msg>', MediaType.APPLICATION_XML))


        service.metaClass.obterRestBuilder = {a,b,c,d -> rest; }
        def xml = "<xml>teste</xml>"
        def url = "http://www.example.com"

        when:
        service.enviarViaPUT(xml, url, 0, "", 5000, 5000)

        then:
        mockServer.verify()
    }

    void "teste de envio de mensagem POST"() {
        given:
        def rest = new RestBuilder()
        def mockServer = MockRestServiceServer.createServer(rest.restTemplate)
        mockServer.expect(requestTo("http://www.example.com"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Accept", "application/xml"))
                .andRespond(withSuccess('<msg>mensagem recebida com sucesso</msg>', MediaType.APPLICATION_XML))


        service.metaClass.obterRestBuilder = {a,b,c,d -> rest; }
        def xml = "<xml>teste</xml>"
        def url = "http://www.example.com"

        when:
        service.enviarViaPOST(xml, url, 0, "", 5000, 5000)

        then:
        mockServer.verify()
    }
}
