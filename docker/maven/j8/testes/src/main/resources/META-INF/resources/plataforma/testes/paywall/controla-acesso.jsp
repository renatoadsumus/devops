<%@page import="br.com.infoglobo.commons.util.JsonUtils"%>
<%@page import="br.com.infoglobo.paywall.ControlaAcesso"%>
<%@page import="neo.nursery.GlobalBus"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <title>Testes: PayWall</title>
  <link rel="stylesheet" href="${urlDeTestesPlataforma}/qunit/qunit-1.12.0.css">
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
  <script src="${urlJsPlataforma}/paywall/controla-acesso.js"></script>
</head>
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>
  <script src="${urlDeTestesPlataforma}/paywall/js/configuracoes.js"></script>
  
  <script>var CONFIG_GLOBAL = configTodosEventos;</script>
  
  <script src="${urlDeTestesPlataforma}/qunit/qunit-1.12.0.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/utilitarios-do-teste.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/cenarios/register.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/cenarios/paywall.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/cenarios/paywall-patrocinado.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/cenarios/status.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/site-oferta.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/config.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/core.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/model.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/leitor.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/erro.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/json.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/type.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/learning.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/helper-cookie.js"></script>
  <script src="${urlDeTestesPlataforma}/paywall/js/utils.js"></script>
</body>
</html>