package br.com.infoglobo.util;

import neo.nursery.Bus;
import neo.nursery.BusException;
import neo.nursery.GlobalBus;
import neo.xredsys.presentation.PresentationLoader;

import com.escenic.forum.presentation.PresentationManager;

/**
 * Reune métodos para retornar os loaders usados na camada de apresentação.
 * 
 * @author Eborel
 * 
 */
public final class WebAppBusUtil {

	/**
	 * Inibe a construção
	 */
	private WebAppBusUtil() {

	}

	/**
	 * Retorna o Bus da aplicação web
	 * 
	 * @param webAppScopeName Nome do escôpo da publicação a ser utilizada
	 * @return Bus.
	 * @throws BusException
	 *             busexception
	 */
	public static Bus getWebappBus(String webAppScopeName) throws BusException {
		String nomeWebappBus = "Webapp ".concat(webAppScopeName);
		for (Bus bus : GlobalBus.getGlobalBus().getChildren()) {
			if (nomeWebappBus.equalsIgnoreCase(bus.getDisplayName().trim())) {
				return bus;
			}
		}

		throw new BusException("Não foi possivel carregar o bus '" + nomeWebappBus + "'");
	}

	/**
	 * Retorna o presentation manager do forum.
	 * 
	 * @param webAppScopeName Nome do escôpo da publicação a ser utilizada
	 * @return PresentationManager PresentationManager
	 * @throws BusException
	 *             busexception
	 */
	public static PresentationManager getForumPresentationManager(String webAppScopeName) throws BusException {
		return (PresentationManager) getWebappBus(webAppScopeName).lookupSafe("/com/escenic/forum/presentation/PresentationManager");
	}

	/**
	 * Retorna um objeto do tipo presentationLoader
	 * 
	 * @param webAppScopeName Nome do escôpo da publicação a ser utilizada
	 * @return presentationLoader
	 * @throws BusException
	 *             busexception
	 */
	public static PresentationLoader getPresentationLoader(String webAppScopeName) throws BusException {
		return (PresentationLoader) getWebappBus(webAppScopeName).lookupSafe("/neo/xredsys/presentation/PresentationLoader");
	}
}
