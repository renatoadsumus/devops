<%@ page contentType="text/html" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html"/>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="body">
    <strong>Seu Pagamento foi processado com sucesso</strong>
    <p>
        No: ${pagamento['numeroRecibo']}
        <br>
        R$: ${pagamento['valor']}
        <br>
        Data da compra: ${pagamento['dataCompra']}
        <br>
        Data do pagamento: ${pagamento['dataPagamento']}
    </p>
    [layout pendente]
</div>
</body>
</html>