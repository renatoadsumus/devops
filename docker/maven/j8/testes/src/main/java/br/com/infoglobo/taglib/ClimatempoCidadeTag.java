package br.com.infoglobo.taglib;

import javax.servlet.jsp.JspException;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import br.com.infoglobo.climatempo.PrevisaoTempo;
import br.com.infoglobo.previsaotempo.CidadeElement;


/**
 * Tag que recebe o nome de uma cidade e devolve a 
 * previsao para os proximos quatro dias
 * 
 * @author ehenriques
 * @deprecated Utilizar a api de previsão do tempo. Mais detalhes consulte a documentação da API no site da plataforma
 */
@Deprecated
public class ClimatempoCidadeTag extends ClimatempoBaseTag {

	/** log */
	private static Logger logger = Logger.getLogger(ClimatempoCidadeTag.class);
	
	/** serial Id */
	private static final long serialVersionUID = -8285125090249756192L;
	
	/** nome da cidade */
	private String nomeCidade;
	
	@Override
	public int doEndTag() throws JspException {
		
		validar();
		PrevisaoTempo tempo = getPrevisaoTempo();		
		
		try {
			
			logger.debug("Buscando previsoes para a cidade" + this.nomeCidade);
			CidadeElement cidade = tempo.getPrevisaoCidade(this.nomeCidade);
			this.pageContext.setAttribute(getId(), cidade);
			
		} catch (Exception e) {
			logger.error(e);
		}
			
		return SKIP_BODY;
	}
	
	/**
	 * @return the nomeCidade
	 */
	public String getNomeCidade() {
		return nomeCidade;
	}

	/**
	 * @param nomeCidade the nomeCidade to set
	 */
	public void setNomeCidade(String nomeCidade) {
		this.nomeCidade = nomeCidade;
	}

	/**
	 * Valida as entradas da tag
	 * @throws JspException a exceção lançada
	 */
	private void validar() throws JspException {
		
		if (StringUtils.isBlank(this.nomeCidade)) {
			throw new JspException("um nome de cidade precisa ser informado");
		}
		
	}
	
}
