import grails.plugin.executor.PersistenceContextExecutorWrapper

import java.util.concurrent.Executors

// Place your Spring DSL code here
beans = {
    executorService(PersistenceContextExecutorWrapper) { bean ->
        bean.destroyMethod = 'destroy'
        persistenceInterceptor = ref("persistenceInterceptor")
        executor = Executors.newFixedThreadPool(5)
    }
}
