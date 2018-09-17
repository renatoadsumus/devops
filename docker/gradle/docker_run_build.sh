docker run --rm --name $1 -v /opt/agents/pipelines/$2:/workspace_projeto -v /opt/repositories/gradle/:/home/go/.gradle/ renatoadsumus/gradle:2.14_latest gradle build
