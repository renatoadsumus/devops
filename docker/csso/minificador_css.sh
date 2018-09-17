#!/bin/bash

#MAPEIA TODOS OS ARQUIVOS COM FINAL .CSS E ADICIONA AO ARRAY
mapfile -t arquivos < <(find . -name "*.css")

#PERCORRE O ARRAY MINIFICANDO OS ARQUIVOS
for i in "${arquivos[@]}"
do
	arquivo=$i
	arquivo_min="${arquivo//.css/_min.css}"
	echo "Minificando arquivo"
	echo $i
	csso $arquivo --output $arquivo_min
	#REMOVE O ARQUIVO ORIFINAL E RENOMEIA O MINIFICADO
	rm $arquivo
	mv $arquivo_min $arquivo
done


