package neo.xredsys.presentation;

import static java.lang.Integer.valueOf;
import static java.lang.String.format;
import neo.util.cache.Cache;
import neo.xredsys.api.ObjectLoader;

import org.apache.log4j.Logger;

/**
 * Esta classe corrigi erros no log desnecessários da classe {@link PresentationListManager} no método
 * {@link PresentationListManager#expirePool(int)}
 * 
 * @author Célula Plataforma Digital
 * 
 */
public class PresentationListManagerInfoglobo extends PresentationListManager {

	private static final Logger LOG = Logger.getLogger(PresentationListManagerInfoglobo.class);

	private PresentationLoader presentationLoader;

	private UpdatePresentationObject updater;

	private ObjectLoader objectLoader;

	@SuppressWarnings("rawtypes")
	@Override
	public Cache getCache() {

		return super.getCache();
	}

	@SuppressWarnings("unchecked")
	@Override
	public void expirePool(int poolId) {

		LOG.debug(format("Verificando poolId [%s]", poolId));

		if (getCache() != null && getCache().hasObject(valueOf(poolId))) {

			LOG.debug("Validado poolId, chamando o super da classe.");

			super.expirePool(poolId);
		}
	}

	@Override
	public void setPresentationLoader(PresentationLoader presentationLoader) {

		this.presentationLoader = presentationLoader;
		super.setPresentationLoader(presentationLoader);
	}

	public PresentationLoader getPresentationLoader() {

		return presentationLoader;
	}

	@Override
	public void setUpdater(UpdatePresentationObject updater) {

		this.updater = updater;
		super.setUpdater(updater);
	}

	public UpdatePresentationObject getUpdater() {

		return updater;
	}

	@Override
	public void setObjectLoader(ObjectLoader objectLoader) {

		this.objectLoader = objectLoader;
		super.setObjectLoader(objectLoader);
	}

	public ObjectLoader getObjectLoader() {

		return objectLoader;
	}

}
