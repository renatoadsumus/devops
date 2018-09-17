dataSource {
    pooled = true
    jmxExport = true
    driverClassName = "org.h2.Driver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = false
    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
//    cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
    singleSession = true // configure OSIV singleSession mode
}

// environment specific settings
environments {
    development {
        dataSource {
            logSql = true

            // one of 'create', 'create-drop', 'update', 'validate', ''
            dbCreate = "update"

            username = "DEV_INFG_Classificados_Captacao_owner"
            password = "B0zkZ25AaJy3"
            url = "jdbc:jtds:sqlserver://INFOSQLDSV:1433;databaseName=DEV_INFG_Classificados_Captacao_INT"
            driverClassName = "net.sourceforge.jtds.jdbc.Driver"
            dialect = "org.hibernate.dialect.SQLServerDialect"
        }
    }
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:h2:mem:testDb;MVCC=TRUE;LOCK_TIMEOUT=10000;DB_CLOSE_ON_EXIT=FALSE"
        }
    }
    production {
        dataSource {
            dbCreate = "none"
            jndiName = "java:comp/env/jdbc/CaptacaoClassificadosDb"
            minIdle = '1'
            maxIdle = '1'
            maxActive = '3'
        }
        hibernate {
            cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory'
        }
    }
}
