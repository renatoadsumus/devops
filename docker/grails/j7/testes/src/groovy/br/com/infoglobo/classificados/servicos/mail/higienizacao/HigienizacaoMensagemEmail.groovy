package br.com.infoglobo.classificados.servicos.mail.higienizacao


import org.codehaus.groovy.grails.plugins.codecs.HTMLCodec;
import org.springframework.stereotype.Component

@Component
class HigienizacaoMensagemEmail {
	
	public static higienizarMensagemEmail(Map mapaMensagemEmail) {		
		Map mapaMensagemEmailLimpa = new HashMap<String, String>()
		def chaves = mapaMensagemEmail.keySet()
		for (chave in chaves) {
			def valor = mapaMensagemEmail.get(chave)
				
			if (valor instanceof String) {
				valor = removerQuebrasDeLinha(valor)
				valor = removerScripts(valor)
				valor = HTMLCodec.html4_encoder.encode(valor)
			}
			
			mapaMensagemEmailLimpa.put(chave, valor)
		}		
		mapaMensagemEmailLimpa	
	}

	private static String removerQuebrasDeLinha(String mensagem) {
		mensagem = mensagem.replaceAll(/\r|\n/, " ")
		mensagem = mensagem.replaceAll(/\s+/, " ")
		mensagem = mensagem.trim()
		return mensagem
	}
	
	private static String removerScripts(String mensagem) {
		return mensagem.replaceAll(/<script.*?>.*?<\/script>/, "")
	}
}
