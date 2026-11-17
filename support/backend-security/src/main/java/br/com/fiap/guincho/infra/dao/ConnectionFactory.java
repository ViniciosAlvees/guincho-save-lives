package br.com.fiap.guincho.infra.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {
    public Connection getConnection() {
        String url = required("DB_URL");
        String user = required("DB_USER");
        String password = required("DB_PASSWORD");
        try {
            return DriverManager.getConnection(url, user, password);
        } catch (SQLException exception) {
            throw new IllegalStateException("Não foi possível acessar o banco de dados.");
        }
    }

    private String required(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Configuração do banco de dados indisponível.");
        }
        return value;
    }
}
