package br.com.infoglobo.taglib;

import java.util.List;

import javax.servlet.jsp.JspException;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import br.com.infoglobo.climatempo.PrevisaoTempo;

/**
 * Tag que recebe um nome de uma região e devolve uma lista com o nome de 
 * todas as cidades daquela região (somente cidades com previsão do tempo
 * serão devolvidos)
 * 
 * @author ehenriques
 * @deprecated Utilizar a api de previsão do tempo. Mais detalhes consulte a documentação da API no site da plataforma
 */
@Deprecated
public class ClimatempoCidadesPorRegiaoTag extends ClimatempoBaseTag {

	/** log */
	private static Logger logger = Logger.getLogger(ClimatempoPrevisaoCidadeAleatoriaTag.class);
	
	/** serial version */
	private static final long serialVersionUID = 8746809664741906052L;
	
	/** nome da regiao que será procurada */
	private String nomeRegiao;
	
	@Override
	public int doEndTag() throws JspException {
		
		validar();
		PrevisaoTempo tempo = getPrevisaoTempo();
		
		try {
			
			String[] regioes = getStringArray(this.nomeRegiao);
			logger.debug("Buscando a lista de cidades da regiao: " + this.nomeRegiao);
			List<String> listaCidades = tempo.getListaCidadesPorRegiao(regioes);
			this.pageContext.setAttribute(getId(), listaCidades);
			
		} catch (Exception e) {
			logger.error(e);
		}
		
		return SKIP_BODY;
	}

	/**
	 * @return the nomeRegiao
	 */
	public String getNomeRegiao() {
		return nomeRegiao;
	}

	/**
	 * @param nomeRegiao the nomeRegiao to set
	 */
	public void setNomeRegiao(String nomeRegiao) {
		this.nomeRegiao = nomeRegiao;
	}

	/**
	 * Valida as entradas da tag
	 * @throws JspException a exceção lançada
	 */
	private void validar() throws JspException {
		
		if (StringUtils.isBlank(this.nomeRegiao)) {
			throw new JspException("o nome da regiao deve ser informado");
		}
		
	}

}
