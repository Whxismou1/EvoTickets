package com.evotickets.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

@Configuration
public class AppConfig {

    @Value("${APP_NAME:backend}")
    private String appName;

    @Value("${APP_SERVER_PORT:8080}")
    private int serverPort;

    @Value("${APP_DATASOURCE_URL}")
    private String datasourceUrl;

    @Value("${APP_DATASOURCE_USERNAME}")
    private String datasourceUsername;

    @Value("${APP_DATASOURCE_PASSWORD}")
    private String datasourcePassword;

    @Value("${APP_DDL_AUTO:update}")
    private String ddlAuto;

    @Value("${APP_EXCLUDE_AUTO_CONFIG:org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration}")
    private String excludeAutoConfig;

    @Bean
    public WebServerFactoryCustomizer<ConfigurableWebServerFactory> webServerFactoryCustomizer() {
        return factory -> factory.setPort(serverPort);
    }

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setUrl(datasourceUrl);
        dataSource.setUsername(datasourceUsername);
        dataSource.setPassword(datasourcePassword);
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }
}
