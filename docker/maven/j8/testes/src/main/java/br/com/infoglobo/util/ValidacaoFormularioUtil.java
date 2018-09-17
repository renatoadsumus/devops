package br.com.infoglobo.util;

import static java.util.regex.Pattern.compile;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;

import com.escenic.captcha.Captcha;

public class ValidacaoFormularioUtil {

	/** Classe para LOG. */
	private static final Logger LOG = Logger.getLogger(ValidacaoFormularioUtil.class);

	/** * Constante com a expressao regular */
	private static final String EMAIL_REGEX = "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";

	public static boolean isTelefoneValido(String campoForm) {

		Matcher m = compile("^\\(\\d\\d\\)\\s\\d{4,5}\\-\\d{4}").matcher(campoForm);

		return m.find();
	}

	/**
	 * Verifica se o email esta conforme os padroes
	 * 
	 * @param email
	 *            Email a ser validado
	 * @return boolean
	 */
	public static boolean isEmailValido(String email) {

		if (email == null) {
			return false;
		}

		return email.trim().matches(EMAIL_REGEX);
	}

	/**
	 * Verifica se o nome esta conforme os padroes
	 * 
	 * @param string
	 *            String que será validada.
	 * @param minimo
	 *            Tamanho minimo da String.
	 * @param maximo
	 *            Tamanho maximo da String.
	 * @return boolean
	 */
	public static boolean isStringValida(String string, int minimo, int maximo) {

		if (string == null) {
			return false;
		}

		string = string.trim();

		return (string.length() >= minimo && string.length() <= maximo);
	}

	/**
	 * Verifica validação do capcha.
	 * 
	 * @param request
	 *            Requisição feita.
	 * 
	 * @return boolean.
	 */
	public static boolean isCaptchaValid(HttpServletRequest request) {

		Object capchaObj = request.getSession().getAttribute("escenicCaptcha");
		if (capchaObj == null || !(capchaObj instanceof Captcha)) {
			LOG.info("O valor do captcha da sessão esta nulo");
			return false;
		}

		Captcha escenicCaptcha = (Captcha) capchaObj;

		String parameter = (String) getParameter(request, "captcha");

		if (StringUtils.isNotBlank(parameter) && escenicCaptcha.isInputValid(parameter.toUpperCase())) {
			return true;
		}

		LOG.info("Captcha digitado : " + parameter);

		LOG.info("Captcha digitado errado - IP: " + request.getRemoteAddr());

		return false;
	}

	public static boolean isCpfValido(String cpf) {

		if (cpf.equals("00000000000") || cpf.equals("11111111111") || cpf.equals("22222222222") || cpf.equals("33333333333")
		        || cpf.equals("44444444444") || cpf.equals("55555555555") || cpf.equals("66666666666") || cpf.equals("77777777777")
		        || cpf.equals("88888888888") || cpf.equals("99999999999") || (cpf.length() != 11))
			return (false);

		int d1, d2;
		int digito1, digito2, resto;
		int digitoCPF;
		String nDigResult;

		d1 = d2 = 0;
		digito1 = digito2 = resto = 0;

		for (int nCount = 1; nCount < cpf.length() - 1; nCount++) {
			digitoCPF = Integer.valueOf(cpf.substring(nCount - 1, nCount)).intValue();

			d1 = d1 + (11 - nCount) * digitoCPF;

			d2 = d2 + (12 - nCount) * digitoCPF;
		}
		;

		resto = (d1 % 11);

		if (resto < 2)
			digito1 = 0;
		else
			digito1 = 11 - resto;

		d2 += 2 * digito1;

		resto = (d2 % 11);

		if (resto < 2)
			digito2 = 0;
		else
			digito2 = 11 - resto;

		String nDigVerific = cpf.substring(cpf.length() - 2, cpf.length());

		nDigResult = String.valueOf(digito1) + String.valueOf(digito2);

		return nDigVerific.equals(nDigResult);

	}

	public static Object getParameter(ServletRequest request, String nome) {

		if (request.getAttribute(nome) != null) {
			return request.getAttribute(nome);
		}

		return request.getParameter(nome);
	}

	public static boolean isDataValida(String data) {

		SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");

		try {
			Date date = (Date) format.parse(data);

			if (date != null) {
				String[] dataFragment = data.split("\\/");

				String dia = dataFragment[0];
				String mes = dataFragment[1];

				if (validaDia(dia)) {
					if (validaMes(mes)) {
						return true;
					}
				}

			}

		} catch (ParseException e) {
			return false;
		}
		return false;
	}

	private static boolean validaMes(String mes) {

		int numeroDoMes = NumberUtils.toInt(mes, -1);

		if (numeroDoMes > 0 && numeroDoMes <= 12) {
			return true;
		}
		return false;
	}

	private static boolean validaDia(String dia) {

		int diaDoMes = NumberUtils.toInt(dia, -1);

		if (diaDoMes > 0 && diaDoMes <= 31) {
			return true;
		}
		return false;
	}

}
