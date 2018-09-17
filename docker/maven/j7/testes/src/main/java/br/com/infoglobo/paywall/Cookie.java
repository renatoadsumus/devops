package br.com.infoglobo.paywall;

import static org.apache.commons.lang.StringUtils.isBlank;

import java.util.HashMap;
import java.util.Map;

public class Cookie {

	private Map<String, String> cookies = new HashMap<String, String>();

	public Cookie(String cookieHeader) {

		if (isBlank(cookieHeader)) {
			return;
		}

		String[] cookiesArray = cookieHeader.split("; ");

		for (int i = 0; i < cookiesArray.length; i++) {
			String cookie = cookiesArray[i];

			String name = cookie.split("=")[0];
			String value = cookie.substring(cookie.indexOf('=') + 1, cookie.length());

			this.cookies.put(name, value);
		}
	}

	public String get(String name) {
		return cookies.get(name);
	}

	public boolean contains(String name) {
		return cookies.containsKey(name);
	}
}
