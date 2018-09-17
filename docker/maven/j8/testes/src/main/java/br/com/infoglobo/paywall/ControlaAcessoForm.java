/**
 * 
 */
package br.com.infoglobo.paywall;

import org.apache.struts.action.ActionForm;

/**
 *
 */
public class ControlaAcessoForm extends ActionForm {
	/**
	 * 
	 */
	private static final long serialVersionUID = 9039396754047901722L;
	/**
	 * Produto (oglobo, extra etc)
	 */
	private String produto = "";

	public String getProduto() {
		return produto;
	}

	public void setProduto(String produto) {
		this.produto = produto;
	}

	
}
