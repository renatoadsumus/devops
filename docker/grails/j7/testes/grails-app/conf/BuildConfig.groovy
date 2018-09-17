grails.servlet.version = "2.5" // Change depending on target container compliance (2.5 or 3.0)
grails.project.class.dir = "target/classes"
grails.project.test.class.dir = "target/test-classes"
grails.project.test.reports.dir = "target/test-reports"
grails.project.work.dir = "target/work"
grails.project.target.level = 1.6
grails.project.source.level = 1.6

grails.project.repos.infoglobo.url = "http://infodevops1:8081/repository/docker_imagens_teste/"
grails.project.repos.infoglobo.username = "admin"
grails.project.repos.infoglobo.password = "2lsDb19i"
grails.project.repos.default = "infoglobo"

grails.project.fork = [
	// configure settings for compilation JVM, note that if you alter the Groovy version forked compilation is required
	//  compile: [maxMemory: 256, minMemory: 64, debug: false, maxPerm: 256, daemon:true],

	// configure settings for the test-app JVM, uses the daemon by default
	test: false,//[maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, daemon:true],
	// configure settings for the run-app JVM
	run: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
	// configure settings for the run-war JVM
	war: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256, forkReserve:false],
	// configure settings for the Console UI JVM
	console: [maxMemory: 768, minMemory: 64, debug: false, maxPerm: 256]
]

grails.project.dependency.resolver = "maven" // or ivy
grails.project.dependency.resolution = {
	// inherit Grails' default dependencies
	inherits("global") {
		// uncomment to disable ehcache
		// excludes 'ehcache'
	}
	log "warn" // log level of Ivy resolver, either 'error', 'warn', 'info', 'debug' or 'verbose'
	repositories {

		mavenRepo "http://infodevops1:8081/repository/maven-public/"

//		grailsPlugins()
//		grailsHome()
//		mavenLocal()
//		grailsCentral()
//		mavenCentral()

		// uncomment the below to enable remote dependency resolution
		// from public Maven repositories
		//mavenRepo "http://repository.codehaus.org"
		//mavenRepo "http://download.java.net/maven/2/"
		//mavenRepo "http://repository.jboss.com/maven2/"
	}
	dependencies {
		// specify dependencies here under either 'build', 'compile', 'runtime', 'test' or 'provided' scopes eg.
		// runtime 'mysql:mysql-connector-java:5.1.24'
		test 'org.spockframework:spock-spring:0.7-groovy-2.0'
	}

	plugins {
		build(":release:3.0.1", ":rest-client-builder:1.0.3") { export = false }

		compile "br.com.infoglobo.classificados:definicoes-sistema-classificados:1.1.0"
		compile ":mail:1.0.1"
		test ":code-coverage:2.0.3-3"
    }
}

coverage {
    nopost = true
    xml = true
    exclusionListOverride = [
            "**/*BootStrap*",
            "**/*ApplicationResources*",
            "Config*",
            "**/conf/**",
            "**/*DataSource*",
            "**/*BuildConfig*",
            "**/*resources*",
            "**/*Tests*",
            "**/grails/test/**",
            "**/org/codehaus/groovy/grails/**",
            "**/PreInit*",
            "*GrailsPlugin*",
            "**/MockeryController*",
    ]
}