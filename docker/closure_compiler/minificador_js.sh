#!/bin/bash

#MAPEIA TODOS OS ARQUIVOS COM FINAL .JS E ADICIONA AO ARRAY
mapfile -t arquivos < <(find . -name "*.js")

#PERCORRE O ARRAY MINIFICANDO OS ARQUIVOS
for i in "${arquivos[@]}"
do
	arquivo=$i
	arquivo_min="${arquivo//.js/_min.js}"
	echo "Minificando arquivo"
	echo $i
	java -jar /opt/closure-compiler/latest/closure-compiler.jar --js $arquivo --js_output_file $arquivo_min
	#REMOVE O ARQUIVO ORIFINAL E RENOMEIA O MINIFICADO
	rm $arquivo
	mv $arquivo_min $arquivo
done

