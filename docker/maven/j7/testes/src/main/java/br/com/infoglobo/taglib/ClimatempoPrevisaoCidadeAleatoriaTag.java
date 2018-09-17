package br.com.infoglobo.taglib;

import java.util.Random;

import javax.servlet.jsp.JspException;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import br.com.infoglobo.climatempo.PrevisaoTempo;
import br.com.infoglobo.previsaotempo.CidadeElement;

/**
 * Tag que recebe uma lista de cidades e devolve a 
 * previsao de uma cidade escolhida aleatoriamente para os proximos quatro dias
 * @author ehenriques
 * @deprecated Utilizar a api de previsão do tempo. Mais detalhes consulte a documentação da API no site da plataforma
 */
@Deprecated
public class ClimatempoPrevisaoCidadeAleatoriaTag extends ClimatempoBaseTag {

	/** log */
	private static Logger logger = Logger.getLogger(ClimatempoPrevisaoCidadeAleatoriaTag.class);
	
	/** version ID */
	private static final long serialVersionUID = 3559003713353545383L;
	
	/** nome da cidade */
	private String cidades;

	@Override
	public int doEndTag() throws JspException {
		
		validar();
		PrevisaoTempo tempo = getPrevisaoTempo();		
		
		try {
			
			Random random = new Random();
			String[] listaCidades = getStringArray(this.cidades);
			logger.debug("Lista de cidade recebidas:" + this.cidades);
			// Faz um random para escolher uma cidade qualquer da lista
			CidadeElement cidade = tempo.getPrevisaoCidade(listaCidades[random.nextInt(listaCidades.length)]);
			logger.debug("Cidade selecionada:" + cidade);
			this.pageContext.setAttribute(getId(), cidade);
			
		} catch (Exception e) {
			logger.error(e);
		}
		
		return SKIP_BODY;
	}

	/**
	 * @return the cidades
	 */
	public String getCidades() {
		return cidades;
	}

	/**
	 * @param cidades the cidades to set
	 */
	public void setCidades(String cidades) {
		this.cidades = cidades;
	}
	/**
	 * Valida as entradas da tag
	 * @throws JspException a exceção lançada
	 */
	private void validar() throws JspException {
		
		if (StringUtils.isBlank(this.cidades)) {
			throw new JspException("um nome de cidade precisa ser informado");
		}		
	}

}
