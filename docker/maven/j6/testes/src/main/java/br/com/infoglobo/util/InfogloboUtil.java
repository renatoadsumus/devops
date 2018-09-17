package br.com.infoglobo.util;

import static java.lang.String.format;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import javax.servlet.jsp.PageContext;

import neo.nursery.BusException;
import neo.xredsys.api.IOAPI;
import neo.xredsys.api.Publication;

import org.apache.log4j.Logger;

import com.escenic.menu.MenuManager;
import com.escenic.menu.MenuTree;
import com.escenic.menu.SectionItemImpl;
import com.escenic.servlet.ApplicationBus;

/**
 * Classe utilitária comuns a todos os projetos.
 * 
 * @author equipe de desenvolvimento web - Projeto Extra Online
 * 
 */
public final class InfogloboUtil {
	/** Propriedade do escenic admin da instância do menu manager. */
	private static final String PROPRIEDADE_MENU_MANAGER = "/com/escenic/menu/MenuManager";
	
	/** Log do sistema. */
	private static final Logger LOG = Logger.getLogger(InfogloboUtil.class);

	/**
	 * 
	 * Construtor privado para impedir que a classe seja instânciada.
	 * 
	 */
	private InfogloboUtil() {

	}
	
	/**
	 * @param pattern da data a ser válida.
	 * @param data string que contém a data.
	 * @return <b>true</b> para data válida <b>false</b> para data inválida.
	 */
	public static boolean isDataValida(String pattern, String data) {
		if (data == null || pattern == null) {
	        return false;
        }
		
		SimpleDateFormat df = new SimpleDateFormat(pattern);
		
		try {
	        df.parse(data);
	        return true;
        } catch (ParseException e) {
        	return false;
        }
	}

	/**
	 * @param context page context da requisição.
	 * @param nomeMenu nome do menu configurado na ferramenta MenuEditor.
	 * @return somente as seções pais do menu editor é retornado.
	 * @throws BusException exceção lançada quando o sistema não carrega o menu editor.
	 */
	public static List<SectionItemImpl> getItemMenu(PageContext context, String nomeMenu) throws BusException {
		
		return getItemMenu(context.getServletContext(), context.getRequest(), nomeMenu);
	}
	
	/**
	 * @param context
	 *            page context da requisição.
	 * @param request
	 *            requisição HTTP.
	 * @param nomeMenu
	 *            nome do menu configurado na ferramenta MenuEditor.
	 * @return somente as seções pais do menu editor é retornado.
	 * @throws BusException
	 *             exceção lançada quando o sistema não carrega o menu editor.
	 */
	@SuppressWarnings("unchecked")
	public static List<SectionItemImpl> getItemMenu(ServletContext context, ServletRequest request, String nomeMenu) throws BusException {

		MenuManager manager;

		try {
			// Carrega a instância do menu manager do escenic admin.
			manager = (MenuManager) ApplicationBus.getApplicationBus(context).lookup(PROPRIEDADE_MENU_MANAGER);
		} catch (BusException e) {
			LOG.error(format("Falha ao carregar a instância do componente menu manager da aplicação [%s]", PROPRIEDADE_MENU_MANAGER));
			throw new BusException();
		}

		int idPublicacao = getIdPublicacao(request);

		MenuTree tree = manager.getMenuTree(nomeMenu, idPublicacao);

		if (tree == null) {
			throw new IllegalArgumentException(format("O nome do menu [%s] não foi encontrado na publicação [%s]", nomeMenu, idPublicacao));
		}

		return tree.getMenu().getElements();
	}

	/**
	 * @param request de onde será extraido a instância da publicação.
	 * @return a instância da publicação.
	 */
	public static Publication getPublicacao(ServletRequest request) {
		return (Publication) request.getAttribute("publication");
	}
	
	/**
	 * @param request de onde será extraido o id da publicação.
	 * @return a identificação única da publicação.
	 */
	public static int getIdPublicacao(ServletRequest request) {
		return getPublicacao(request).getId();
	}

	/**
	 * @param context de onde será extraido a publicação.
	 * @return a instância da publicação.
	 */
	public static Publication getPublicacao(PageContext context) {
		return getPublicacao(context.getRequest());
	}

	/**
	 * @param idPublicacao identificação única da publicação.
	 * @return uma instância da publicação;
	 */
	public static Publication getPublicacao(int idPublicacao) {
		return IOAPI.getAPI().getObjectLoader().getPublicationById(idPublicacao);
	}
	
	/**
	 * @param nomePublicacao nome da publicação no escenic.
	 * @return uma instância da publicação;
	 */
	public static Publication getPublicacao(String nomePublicacao) {
		return IOAPI.getAPI().getObjectLoader().getPublication(nomePublicacao);
	}
	
}
