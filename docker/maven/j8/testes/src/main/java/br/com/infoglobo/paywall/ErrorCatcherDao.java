package br.com.infoglobo.paywall;

import static java.lang.String.format;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.apache.log4j.Logger;
import org.joda.time.DateTime;

import neo.dbaccess.GenericDataConnector;

public class ErrorCatcherDao {

	private GenericDataConnector dataConnector;

	private String nomeServico;

	private static final String SQL_INSERT_INFG_SERVICES = "insert into INFG_Services (service_name, created, purged, publication_id, article_id, source, source_id,custom_fields) values(?,?,?,?,?,?,?,?)";

	private static final Logger LOG = Logger.getLogger(ErrorCatcherDao.class);

	private int diasParaExpiracao;

	private Connection getConnection() throws SQLException {

		return getDataConnector().getDataSource().getConnection();
	}


	public boolean gravarError(String dadosJson, int publicationId) {
		
		Connection conexao = null;
		PreparedStatement prepareStatement = null;

		boolean sucesso = false;

		try {

			conexao = getConnection();

			if (conexao != null) {

				int i = 1;

				DateTime created = new DateTime();
				Timestamp sqlCreateTime = new Timestamp(created.getMillis());

				DateTime purged = new DateTime();
				purged = purged.plusDays(diasParaExpiracao);
				Timestamp sqlPurgedTime = new Timestamp(purged.getMillis());

				prepareStatement = conexao.prepareStatement(SQL_INSERT_INFG_SERVICES);
				prepareStatement.setString(i++, nomeServico);
				prepareStatement.setTimestamp(i++, sqlCreateTime);
				prepareStatement.setTimestamp(i++, sqlPurgedTime);
				prepareStatement.setInt(i++, publicationId);
				prepareStatement.setInt(i++, 0);
				prepareStatement.setString(i++, "-");
				prepareStatement.setString(i++, "-");
				prepareStatement.setString(i++, dadosJson);
				prepareStatement.execute();
				sucesso = true;
			}

		} catch (SQLException e) {
			LOG.error(format("Não foi possível gravar os dados do error"));
			LOG.debug(e);
		} finally {
			fecharConexao(conexao);
			fecharPrepareStatement(prepareStatement);
		}

		return sucesso;

	}
	private void fecharConexao(Connection conexao) {

		if (conexao != null) {
			try {
				conexao.close();
			} catch (SQLException e) {

				LOG.error("Erro ao fechar a conexao: ", e);
			}
		}
	}

	private void fecharPrepareStatement(PreparedStatement prepareStatement) {

		if (prepareStatement != null) {
			try {
				prepareStatement.close();
			} catch (SQLException e) {

				LOG.error("Erro ao fechar o prepareStatement: ", e);
			}
		}
	}

	public GenericDataConnector getDataConnector() {
		return dataConnector;
	}

	public void setDataConnector(GenericDataConnector dataConnector) {
		this.dataConnector = dataConnector;
	}

	public String getNomeServico() {
		return nomeServico;
	}

	public void setNomeServico(String nomeServico) {
		this.nomeServico = nomeServico;
	}

	public int getDiasParaExpiracao() {
		return diasParaExpiracao;
	}

	public void setDiasParaExpiracao(int diasParaExpiracao) {
		this.diasParaExpiracao = diasParaExpiracao;
	}


}
