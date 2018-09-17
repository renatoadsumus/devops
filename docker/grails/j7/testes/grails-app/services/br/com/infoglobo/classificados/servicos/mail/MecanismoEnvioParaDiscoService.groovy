package br.com.infoglobo.classificados.servicos.mail

import grails.transaction.Transactional

@Transactional
class MecanismoEnvioParaDiscoService {

    def mensagens = []
	
	def salvarArquivo = true
	
	def caminhoArquivo = "/tmp/"
	
	def enviarMensagem(String destino, String assunto, String mensagem) {
		if (this.salvarArquivo) {
			File file = new File(this.caminhoArquivo, destino + "_" + assunto + '.html')
			file.withWriter { writer ->
				writer << assunto + '\n'
				writer << mensagem
				writer.flush()
			}
		}
		mensagens.add(mensagem)
	}

	def enviarMensagem(String destino, String responderPara, String assunto, String mensagem) {
		if (this.salvarArquivo) {
			File file = new File(this.caminhoArquivo, destino + "_" + assunto + '.html')
			file.withWriter { writer ->
				writer << assunto + '\n'
				writer << responderPara + '\n'
				writer << mensagem
				writer.flush()
			}
		}
		mensagens.add(mensagem)
	}
}
