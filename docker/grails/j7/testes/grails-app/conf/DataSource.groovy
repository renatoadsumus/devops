
hibernate {
	cache.use_second_level_cache = true
	cache.use_query_cache = false
	cache.provider_class='org.hibernate.cache.EhCacheProvider'
}

// environment specific settings
environments {
	development {
			
	}
	production {
		/**
		 * No release de produção o datasource é fornecido pelo tomcat. Atual-
		 * mente, o release de produção é instalado também nos ambientes de
		 * qualidade e integração.
		 */
		dataSource {
			dbCreate = "update"
			jndiName = "java:comp/env/jdbc/ClassificadosDb"
		}
		hibernate {
			cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
		}
	}
}