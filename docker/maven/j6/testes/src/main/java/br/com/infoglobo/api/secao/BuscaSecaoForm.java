package br.com.infoglobo.api.secao;

import org.apache.struts.action.ActionForm;

public class BuscaSecaoForm extends ActionForm {

	private static final long serialVersionUID = 3384209469542872724L;

	private String app;

	private String config;

	public String getApp() {

		return app;
	}

	public void setApp(String app) {

		this.app = app;
	}

	public String getConfig() {

		return config;
	}

	public void setConfig(String config) {

		this.config = config;
	}

}
