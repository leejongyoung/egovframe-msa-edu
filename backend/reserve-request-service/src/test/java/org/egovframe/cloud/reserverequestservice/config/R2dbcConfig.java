package org.egovframe.cloud.reserverequestservice.config;

import java.util.UUID;

import org.springframework.boot.r2dbc.ConnectionFactoryBuilder;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.init.CompositeDatabasePopulator;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;

import io.r2dbc.spi.ConnectionFactory;

@Profile("test")
@TestConfiguration
@EnableR2dbcRepositories
public class R2dbcConfig {
    @Bean
    ConnectionFactory connectionFactory() {
        // ConnectionFactoryBuilder 로 만들어 Boot 의 DB 타입 판별(options-capable)을 지원하고,
        // 컨텍스트마다 독립된 인메모리 DB 를 사용한다.
        return ConnectionFactoryBuilder
                .withUrl("r2dbc:h2:mem:///reserve-request-" + UUID.randomUUID() + "?DB_CLOSE_DELAY=-1")
                .build();
    }

    @Bean
    ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {
        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        CompositeDatabasePopulator populator = new CompositeDatabasePopulator();
        populator.addPopulators(new ResourceDatabasePopulator(new ClassPathResource("schema-h2.sql")));
        initializer.setDatabasePopulator(populator);

        return initializer;
    }
}
