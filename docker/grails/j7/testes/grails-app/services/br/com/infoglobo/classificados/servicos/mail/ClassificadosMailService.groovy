package br.com.infoglobo.classificados.servicos.mail

import grails.gsp.PageRenderer
import grails.transaction.Transactional
import br.com.infoglobo.classificados.oferta.imovel.exceptions.ClassificadosMailServiceException
import br.com.infoglobo.classificados.servicos.mail.higienizacao.HigienizacaoMensagemEmail

@Transactional
public class ClassificadosMailService {
	
	def mecanismoEnvioService
    def definicoesSistemaService

    PageRenderer groovyPageRenderer

    public final static String CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_IMOVEL = 'classificados.oferta.commons.url.home.imovel'
    public final static String CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_VEICULO = 'classificados.oferta.commons.url.home.veiculo'
    public final static String CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_EMPREGO = 'classificados.oferta.commons.url.home.emprego'
    public final static String CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_MIX = 'classificados.oferta.commons.url.home.mix'
    public final static String CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_CLASSIFICADOS = 'classificados.oferta.commons.url.home.classificados'

	def enviarEmailContatoAnunciante(String destino, Map mensagem, String url, String templateHtml) {

		try {
			log.info('Chamando a higienização da mensagem de proposta para "' + destino + '".')
			
			def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)
			
			log.info('Criando html da mensagem de proposta para "' + destino + '".')
			
			String mensagemHtml = groovyPageRenderer.render(
				view: templateHtml,
				model: [dados: mensagemLimpa, urlServidor: url])
	
			log.info('Enviando e-mail de proposta para "' + destino + '".')
			
			mecanismoEnvioService.enviarMensagem(destino, mensagem['interessado.email'], mensagem['assunto'], mensagemHtml)
			

		} catch (Exception sme) {
			log.error('Erro no processo de envio de e-mail de proposta.', sme)
			throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de proposta.', sme)
		}
	}

    def enviarEmailContatoAnunciante(String destino, Map mensagem, String url) {

        try {
            log.info('Chamando a higienização da mensagem de proposta para "' + destino + '".')

            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de proposta para "' + destino + '".')

            String mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailContatoPaginasEstaticas',
                    model: [dados: mensagemLimpa, urlServidor: url])

            log.info('Enviando e-mail de proposta para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, mensagem['interessado.email'], mensagem['assunto'], mensagemHtml)


        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de proposta.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de proposta.', sme)
        }
    }

    def enviarEmailPaginasEstaticas(String destino, Map mensagem) {
        try {
            log.info('Chamando a higienização da mensagem de contato para "' + destino + '".')
            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)
            log.info('Criando html da mensagem de contato para "' + destino + '".')

            def cabecalho = mensagemLimpa.assunto.replace("[Classificados do Rio] ","")

            String mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailContatoPaginasEstaticas',
                    model: [mensagem: mensagemLimpa, cabecalho: cabecalho])

            log.info('Enviando e-mail de proposta para "' + destino + '".')
           mecanismoEnvioService.enviarMensagem(destino, mensagem['assunto'], mensagemHtml)
        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de proposta.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de proposta.', sme)
        }
    }
	
	def enviarEmailDenuncia(String destino, Map mensagem) {
		
		try {
			log.info('Chamando a higienização da mensagem de denúncia para "' + destino + '".')
			
			def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)
			
			log.info('Criando html da mensagem de denúncia para "' + destino + '".')
			
			def mensagemHtml = groovyPageRenderer.render(
				view: '/email/emailImovelDenuncia',
				model: [denuncia: mensagemLimpa])
			
			log.info('Enviando e-mail de denúncia para "' + destino + '".')
			
			mecanismoEnvioService.enviarMensagem(destino, mensagem['assunto'], mensagemHtml)

			log.info('E-mail de denúncia enviado com sucesso para "' + destino + '".')

		} catch (Exception sme) {
			log.error('Erro no processo de envio de e-mail de denúncia.', sme)
			throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de denúncia. ', sme)
		}
	}
	
	def enviarEmailCompartilharAnuncio(String destino, Map mensagem, String assunto, String templateEmail) {
		
		try {
			log.info('Chamando a higienização da mensagem de proposta para "' + destino + '".')

            def mensagemHtml
			def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

			log.info('Criando html da mensagem de proposta para "' + destino + '".')

                mensagemHtml = groovyPageRenderer.render(
                    view: templateEmail,
                    model: [dados: mensagemLimpa])

			log.info('Enviando e-mail de proposta para "' + destino + '".')
			
			mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)
			
			log.info('E-mail de proposta enviado com sucesso para "' + destino + '".')
	
		} catch (Exception sme) {
			log.error('Erro no processo de envio de e-mail de proposta.', sme)
			throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de proposta.', sme)
		}
	}

    def enviarEmailConfirmacaoPagamentoCartao(destino, mensagem, assunto) {
        try {
            log.info('Chamando a higienização da mensagem de confirmacao de pagamento para "' + destino + '".')

            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de confirmacao de pagamento para "' + destino + '".')

            def mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailPagamentoSucesso',
                    model: [pagamento: mensagemLimpa, urls:obterUrlHomes()])

            log.info('Enviando e-mail de confirmacao de pagamento para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)

            log.info('E-mail de confirmacao de pagamento enviado com sucesso para "' + destino + '".')

        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de confirmacao de pagamento.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de confirmacao de pagamento.', sme)
        }

    }

    def enviarEmailFalhaPagamentoCartao(destino, mensagem, assunto) {
        try {
            log.info('Chamando a higienização da mensagem de falha de pagamento cartao para "' + destino + '".')

            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de falha de pagamento cartao para "' + destino + '".')

            def mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailFalhaPagamentoCartao',
                    model: [pagamento: mensagemLimpa, urls:obterUrlHomes()])

            log.info('Enviando e-mail de falha de pagamento cartao para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)

            log.info('E-mail de falha de pagamento cartao enviado com sucesso para "' + destino + '".')

        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de falha de pagamento cartao.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de falha de pagamento cartao.', sme)
        }

    }

    def enviarEmailFaleConosco(String destino, Map mensagem, String assunto) {
        try {
            log.info('Chamando a higienização da mensagem de Fale Consoco "' + destino + '".')

            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de Fale Conosco  para "' + destino + '".')

            def mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailContatoFaleConosco',
                    model: [faleConosco: mensagemLimpa])

            log.info('Enviando e-mail de confirmacao de Fale Conosco  para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)

        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de confirmacao de pagamento.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de FaleConosco.', sme)
        }

    }

    def enviarEmailNotificacaoBoleto(destino, mensagem, assunto)  {
        try {
            log.info('Chamando a higienização da mensagem de notificacao de boleto para "' + destino + '".')

            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de notificacao de boleto para "' + destino + '".')

            def mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailBoletoNotificacao',
                    model: [pagamento: mensagemLimpa, urls:obterUrlHomes()])

            log.info('Enviando e-mail de notificacao de boleto para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)

            log.info('E-mail de notificacao de boleto enviado com sucesso para "' + destino + '".')

        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de notificacao de boleto.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de notificacao de boleto.', sme)
        }

    }

    def enviarEmailNotificacaoSmarterTrack(String destino, Map mensagem, String assunto) {
        try {
            log.info('Chamando a higienização da mensagem de notificacao ao smarter track para "' + destino + '".')

            //TODO - def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)

            log.info('Criando html da mensagem de notificacao ao smarter track para "' + destino + '".')

            def mensagemHtml = groovyPageRenderer.render(
                    view: '/email/emailNotificacaoSmarterTrack',
                    model: [pagamento: mensagem])

            log.info('Enviando e-mail de notificacao ao smarter track para "' + destino + '".')

            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)

            log.info('E-mail de notificacao ao smarter track enviado com sucesso para "' + destino + '".')

        } catch (Exception sme) {
            log.error('Erro no processo de envio de e-mail de notificacao ao smarter track.', sme)
            throw new ClassificadosMailServiceException('Erro no processo de envio de e-mail de notificacao ao smarter track.', sme)
        }

    }

    def enviarEmailNotificacaoComercial(destino, mensagem, assunto) {
        try {
            def mensagemLimpa = HigienizacaoMensagemEmail.higienizarMensagemEmail(mensagem)
            String mensagemHtml = groovyPageRenderer.render(view: '/email/emailNotificacaoComercial', model: [plano: mensagemLimpa])
            mecanismoEnvioService.enviarMensagem(destino, assunto, mensagemHtml)
            log.info("atividade=envio_de_email status=sucesso mensagem.destinatario='${destino}' mensagem.assunto='${assunto}'")
        } catch (Exception sme) {
            log.error("atividade=envio_de_email status=erro mensagem.destinatario='${destino}' mensagem.assunto='${assunto}'")
        }
    }

    private Map obterUrlHomes() {
        def urls = [:]
        urls << [geral : definicoesSistemaService.obterPorChave(CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_CLASSIFICADOS)]
        urls << [imovel : definicoesSistemaService.obterPorChave(CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_IMOVEL)]
        urls << [veiculo : definicoesSistemaService.obterPorChave(CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_VEICULO)]
        urls << [mix : definicoesSistemaService.obterPorChave(CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_MIX)]
        urls << [emprego : definicoesSistemaService.obterPorChave(CLASSIFICADOS_OFERTA_COMMONS_URL_HOME_EMPREGO)]
        return urls
    }
}

