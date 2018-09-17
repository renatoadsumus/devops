package br.com.infoglobo.classificados.oferta.imovel.exceptions;

class ClassificadosMailServiceException extends Exception {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L

	public ClassificadosMailServiceException(){
		super()
	}
	
	public ClassificadosMailServiceException(String message){
		super(message)
	}

	public ClassificadosMailServiceException(String mensagem, Exception causa) {
		super(mensagem, causa)
	}
}
