package br.com.infoglobo.util;

import neo.xredsys.api.ObjectLoader;
import neo.xredsys.api.Publication;

public class Publicacao {

	private String nome;

	private Publication publicacao;

	private ObjectLoader loader;
	
	public void doStartService() {
		publicacao = loader.getPublication(nome);
	}

	public Publication getPublicacao() {

		return publicacao;
	}

	public int getId() {

		return publicacao.getId();
	}
	
	public String getNome() {

		return nome;
	}
	
	public void setNome(String nome) {

	    this.nome = nome;
    }
	
	public ObjectLoader getLoader() {

		return loader;
	}

	public void setLoader(ObjectLoader loader) {

		this.loader = loader;
	}
}
