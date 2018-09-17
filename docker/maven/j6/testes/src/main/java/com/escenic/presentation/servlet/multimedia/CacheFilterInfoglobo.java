package com.escenic.presentation.servlet.multimedia;

import java.io.File;

import neo.xredsys.api.Publication;
import neo.xredsys.config.Publications;

import org.apache.commons.codec.digest.DigestUtils;

public class CacheFilterInfoglobo extends CacheFilter {

	private static final long serialVersionUID = 164085543386419342L;

	@Override
	File getFileForURI(Publication publication, String uri) {

		String relativeURIDirectory = (uri.startsWith("/")) ? uri.substring(1) : uri;

		String id = extrairIdDaURI(uri);

		String hash = DigestUtils.md5Hex(id);
		String prefix = hash.substring(0, 3);

		return new File(Publications.getSupportFor(publication.getName()).getRootDirectory() + prefix, relativeURIDirectory);
	}

	public String extrairIdDaURI(String uri) {

		return uri.replaceAll("(.*)/([a-z]+)([0-9]+)(\\.ece)/(.*)", "$3");
	}

}
