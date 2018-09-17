<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta charset="utf-8">
  <title>Remove o Cookie de Teste</title>
  <meta name="robots" content="noindex, nofollow">
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
  <script src="${urlJsPlataforma}/paywall/controla-acesso.js"></script>
  
  <script type="text/javascript">
  
  	ControlaAcesso.Cookies.removerCookie("t3st3pyig", {
		path: "/"
	});
  
  </script>
</head>
<body>
  
  <h1>Remove o Cookie de Teste</h1>
  
  <div>
  	<p>Olá, o cookie de teste do paywall já foi removido, espero que os testes tenham sido com sucesso!</p>
  </div>
  
</body>
</html>