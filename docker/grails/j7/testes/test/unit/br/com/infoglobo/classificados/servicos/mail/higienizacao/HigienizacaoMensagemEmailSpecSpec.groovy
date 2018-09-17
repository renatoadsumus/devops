package br.com.infoglobo.classificados.servicos.mail.higienizacao

import grails.test.mixin.TestMixin
import grails.test.mixin.support.GrailsUnitTestMixin

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration

import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.support.GrailsUnitTestMixin} for usage instructions
 */
@TestMixin(GrailsUnitTestMixin)
class HigienizacaoMensagemEmailSpecSpec extends Specification {

	def setup() {
	}

	def cleanup() {
	}

	void "Higienizar mensagem de smtp, ok, tokens ilegais removidos"() {
		when:
		def mensagemEmailHigienizada = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagemEmailOriginal)
			
		then:
		mensagemEmailHigienizada['corpo'] == mensagemEmailEsperada
		
		where:
		mensagemEmailOriginal			|mensagemEmailEsperada
		[corpo: "Mensagem\nlimpa"]		|"Mensagem limpa"
		[corpo: "Mensagem\r\nlimpa"]	|"Mensagem limpa"
		[corpo: "\nMensagem limpa"]		|"Mensagem limpa"		
		[corpo: "Mensagem limpa\n"]		|"Mensagem limpa"
		[corpo: "\r\nMensagem limpa"]	|"Mensagem limpa"
		[corpo: "Mensagem limpa\r\n"]	|"Mensagem limpa"
		[corpo: "Mensagem limpa\n\n"]	|"Mensagem limpa"
		[corpo: "Mensagem <script>alert('1');</script>limpa<script>alert('2');</script>"]	|"Mensagem limpa"
	}

	void "Higienizar mensagem de smtp, ok, mensagem original não mudou"() {
		setup:
		def mensagemEmailOriginal = [corpo:"Mensagem \nlimpa\n"]
		when:
		HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagemEmailOriginal)
		then:
		mensagemEmailOriginal['corpo'] == "Mensagem \nlimpa\n"
	}
}
