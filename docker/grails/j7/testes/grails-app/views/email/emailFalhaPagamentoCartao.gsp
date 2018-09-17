<%@ page contentType="text/html" %>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html"/>
    <meta name="layout" content="main"/>
</head>
<body>
<div class="body">
    <strong>Não foi possível processar seu Pagamento Nº ${pagamento['numero']}</strong>
    <p>
        Nº: ${pagamento['numero']}
        <br>
        R$: ${pagamento['valor']}
        <br>
        Data da compra: ${pagamento['dataCompra']}
    </p>
    [layout pendente]
</div>
</body>
</html>