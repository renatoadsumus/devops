package br.com.infoglobo.classificados.servicos.mail

class MecanismoEnvioService {
	
	def mailService

    def enviarMensagem(String destino, String assunto, String mensagem) {
		mailService.sendMail {
			to destino?.split(";")
			subject assunto
			html mensagem
		}
    }

	def enviarMensagem(String destino, String responderPara, String assunto, String mensagem) {
		mailService.sendMail {
			to destino?.split(";")
			replyTo responderPara
			subject assunto
			html mensagem
		}
	}

}
