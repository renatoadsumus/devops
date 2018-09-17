<%@ page contentType="text/html" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html"/>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="body">
    <%@ page contentType="text/html;charset=UTF-8" %>
    <html>
    <body>
    <p>
        ${plano.resumoMensagem}
    </p>
    <p>
        <strong>Detalhes:</strong><br>
        Nome do Cliente: ${plano.nomeAnunciante}
        <br>
        Codigo do Cliente: ${plano.codigoAnunciante}
        <br>
        Codigo do Agente: ${plano.codigoAgente}
        <br>
        Codigo Pacote: ${plano.codigoPacote}
        <br>
        Detalhes do Pacote: ${plano.descricaoPacote}
        <br>
        Data da Venda: ${plano.dataVenda}
        <br>
        Codigo do Operador: ${plano.codigoOperador}
        <br>
        Nome do Operador: ${plano.nomeOperador}
    </p>
    <hr>
    <p>
        Esta e uma mensagem automatica gerada pelo Admin do Classificados do Rio em ${plano.dataNotificacao}.
    </p>
    </body>
    </html>
</div>
</body>
</html>


