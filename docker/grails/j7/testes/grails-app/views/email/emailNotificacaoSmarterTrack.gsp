<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<body>
    <p>
        ${pagamento.resumoMensagem}
    </p>
    <p>
        <strong>Detalhes:</strong><br>
        Nome do Cliente: ${pagamento.nomeCliente}
        <br>
        Codigo do Cliente: ${pagamento.codigoCliente}
        <br>
        Numero do pedido: ${pagamento.numeroPagamento}
        <br>
        Descricao do pagamento: ${pagamento.descricaoPagamento}
        <br>
        Data de Vencimento: ${pagamento.dataVencimentoFormatada}
        <br>
        Descricao do problema: ${pagamento.mensagemDeErro}
    </p>
    <hr>
    <p>
        Esta e uma mensagem automatica gerada pelo Sistema de Pagamentos em ${pagamento.dataNotificacaoFormatada}.
    </p>
</body>
</html>