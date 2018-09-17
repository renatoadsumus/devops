package br.com.infoglobo.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 * Classe utilitária para o envio de email.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 *
 */
public class EmailUtil {

	/**
	 * Servidor de e-mail.
	 */
	private String servidor = "";

	/**
	 * Classe para autenticação.
	 */
	private Autenticacao autenticacao = null;

	/**
	 * Remetente do e-mail.
	 */
	private String from = null;

	/**
	 * Destinatário(s) do e-mail, pode ter vários separados por ',' ou ';'.
	 */
	private String to = null;

	/**
	 * Destinatário(s) de cópia do e-mail, pode ter vários separados por ',' ou
	 * ';'.
	 */
	private String cc = null;

	/**
	 * Destinatário(s) de cópia oculta do e-mail, pode ter vários separados por
	 * ',' ou ';'.
	 */
	private String bcc = null;

	/**
	 * Subject do e-mail.
	 */
	private String assunto = null;

	/**
	 * Mensagem do e-mail.
	 */
	private String mensagem = null;

	/**
	 * Se true marca o conteúdo como HTML.
	 */
	private boolean ehHTML = false;

	/**
	 * Paths dos arquivos que serão anexados ao e-mail.
	 */
	private ArrayList<String> anexos = null;

	/**
	 * Get para o atributo servidor.
	 * 
	 * @return atributo servidor
	 */
	public String getServidor() {
		return servidor;
	}

	/**
	 * Set para a variável servidor.
	 * 
	 * @param servidor
	 *            valor para a variável servidor
	 */
	public void setServidor(String servidor) {
		this.servidor = servidor;
	}

	/**
	 * Get para o atributo autenticacao.
	 * 
	 * @return atributo autenticacao
	 */
	public Autenticacao getAutenticacao() {
		return autenticacao;
	}

	/**
	 * Set para a variável autenticacao.
	 * 
	 * @param autenticacao
	 *            valor para a variável autenticacao
	 */
	public void setAutenticacao(Autenticacao autenticacao) {
		this.autenticacao = autenticacao;
	}

	/**
	 * Get para o atributo from.
	 * 
	 * @return atributo from
	 */
	public String getFrom() {
		return from;
	}

	/**
	 * Set para a variável from.
	 * 
	 * @param from
	 *            valor para a variável from
	 */
	public void setFrom(String from) {
		this.from = from;
	}

	/**
	 * Get para o atributo to.
	 * 
	 * @return atributo to
	 */
	public String getTo() {
		return to;
	}

	/**
	 * Set para a variável to.
	 * 
	 * @param to
	 *            Destinatário(s) do e-mail, pode ter vários separados por ','
	 *            ou ';'
	 */
	public void setTo(String to) {
		this.to = to;
	}

	/**
	 * Get para o atributo cc.
	 * 
	 * @return atributo cc
	 */
	public String getCc() {
		return cc;
	}

	/**
	 * Set para a variável cc.
	 * 
	 * @param cc
	 *            Destinatário(s) da cópia do e-mail, pode ter vários separados
	 *            por ',' ou ';'
	 */
	public void setCc(String cc) {
		this.cc = cc;
	}

	/**
	 * Get para o atributo bcc.
	 * 
	 * @return atributo bcc
	 */
	public String getBcc() {
		return bcc;
	}

	/**
	 * Set para a variável bcc.
	 * 
	 * @param bcc
	 *            Destinatário(s) da cópia oculta do e-mail, pode ter vários
	 *            separados por ',' ou ';'
	 */
	public void setBcc(String bcc) {
		this.bcc = bcc;
	}

	/**
	 * Get para o atributo assunto.
	 * 
	 * @return atributo assunto
	 */
	public String getAssunto() {
		return assunto;
	}

	/**
	 * Set para a variável assunto.
	 * 
	 * @param assunto
	 *            valor para a variável assunto
	 */
	public void setAssunto(String assunto) {
		this.assunto = assunto;
	}

	/**
	 * Get para o atributo mensagem.
	 * 
	 * @return atributo mensagem
	 */
	public String getMensagem() {
		return mensagem;
	}

	/**
	 * Set para a variável mensagem. E marca o corpo do e-mail como texto plano.
	 * 
	 * @param mensagem
	 *            valor para a variável mensagem
	 */
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
		this.ehHTML = false;
	}

	/**
	 * Set para a variável mensagem. E marca o corpo do e-mail como HTML.
	 * 
	 * @param mensagem
	 *            valor para a variável mensagem
	 */
	public void setMensagemHTML(String mensagem) {
		this.mensagem = mensagem;
		this.ehHTML = true;
	}

	/**
	 * Get para o atributo anexos.
	 * 
	 * @return atributo anexos
	 */
	public ArrayList<String> getAnexos() {
		return anexos;
	}

	/**
	 * Set para a variável anexos.
	 * 
	 * @param anexos
	 *            ArrayList com os paths dos arquivos que serão anexados ao
	 *            e-mail.
	 */
	public void setAnexos(ArrayList<String> anexos) {
		this.anexos = anexos;
	}

	/**
	 * Adiciona um anexo a lista de anexos do e-mail.
	 * 
	 * @param anexo
	 *            String com o path do arquivo que serão anexado ao e-mail.
	 * 
	 */
	public void adicionarAnexo(String anexo) {
		if (this.anexos == null) {
			this.anexos = new ArrayList<String>();
		}
		this.anexos.add(anexo);
	}

	/**
	 * Construtor para envio sem autenticação.
	 * 
	 * @param servidor
	 *            Servidor de e-mail.
	 */
	public EmailUtil(String servidor) {
		super();
		this.servidor = servidor;
	}

	/**
	 * Construtor para envio com autenticação.
	 * 
	 * @param servidor
	 *            Servidor de e-mail.
	 * @param usuario
	 *            Usuário para autenticação.
	 * @param senha
	 *            Senha para autenticação.
	 */
	public EmailUtil(String servidor, String usuario, String senha) {
		this(servidor);
		this.autenticacao = new Autenticacao(usuario, senha);
	}

	/**
	 * Envia e-mail.
	 * 
	 * @throws MessagingException
	 *             Dispara caso aconteça algum erro de envio.
	 */
	public void enviar() throws MessagingException {
		Properties props = System.getProperties();
		props.put("mail.smtp.host", this.servidor);
		props.put("mail.mime.charset", "ISO-8859-1");

		if (autenticacao != null) {
			props.put("mail.smtp.auth", "true");
		}

		Session session = Session.getInstance(props, autenticacao);

		// cria a mensagem
		MimeMessage msg = new MimeMessage(session);
		msg.setFrom(new InternetAddress(from));

		msg.setRecipients(Message.RecipientType.TO, to.replaceAll(";", ","));

		// Adiciona destino de cópia
		if (cc != null) {
			msg.addRecipients(Message.RecipientType.CC, cc.replaceAll(";", ","));
		}

		// Adiciona destino de cópia oculta
		if (bcc != null) {
			msg.addRecipients(Message.RecipientType.BCC, bcc.replaceAll(";", ","));
		}

		msg.setSubject(assunto);

		// cria o corpo da mensagem
		MimeBodyPart corpo = new MimeBodyPart();
		if (ehHTML) {
			corpo.setContent(mensagem, "text/html");
		} else {
			corpo.setText(mensagem);
		}

		// cria a Multipart da mensagem
		Multipart mp = new MimeMultipart();
		mp.addBodyPart(corpo);

		// Cria as partes para os anexos
		if (anexos != null) {
			for (String anexo : anexos) {
				try {
					MimeBodyPart mbpAnexo = new MimeBodyPart();

					// anexa o arquivo na mensagem
					FileDataSource fds = new FileDataSource(anexo);
					mbpAnexo.setDataHandler(new DataHandler(fds));
					mbpAnexo.setFileName(fds.getName());
					mp.addBodyPart(mbpAnexo);
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
		}

		// adiciona a Multipart na mensagem
		msg.setContent(mp);

		// configura a data: cabecalho
		msg.setSentDate(new Date());

		// envia a mensagem
		Transport.send(msg);
	}

	/**
	 * Classe para fazer autenticação.
	 */
	private class Autenticacao extends Authenticator {

		/**
		 * Autenticador de envio de e-mail.
		 */
		private PasswordAuthentication autenticador = null;

		/**
		 * Construtor.
		 * 
		 * @param usuario
		 *            Usuário para autenticação.
		 * @param senha
		 *            Senha para autenticação.
		 */
		public Autenticacao(String usuario, String senha) {
			autenticador = new PasswordAuthentication(usuario, senha);
		}

		/**
		 * Retorna um autenticador de e-mail.
		 * 
		 * @return PasswordAuthentication autenticador de e-mail.
		 */
		protected PasswordAuthentication getPasswordAuthentication() {
			return autenticador;
		}
	}
}
