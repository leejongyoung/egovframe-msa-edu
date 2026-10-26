package org.egovframe.cloud.logging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;

import ch.qos.logback.classic.LoggerContext;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.logging.LoggingInitializationContext;
import org.springframework.boot.logging.logback.LogbackLoggingSystem;
import org.springframework.core.env.StandardEnvironment;

class LoggingProfileTest {
    @ParameterizedTest
    @ValueSource(strings = {"default", "test", "test,prod"})
    void consoleProfilesDoNotConnectToLogstash(String profiles) throws Exception {
        withLogging(profiles, (context, server) -> {
            List<String> names = new ArrayList<>();
            context.getLogger(Logger.ROOT_LOGGER_NAME).iteratorForAppenders()
                    .forEachRemaining(appender -> names.add(appender.getName()));
            assertThat(names).containsExactly("STDOUT");
            context.getLogger(getClass()).warn("console-only logging smoke");
            server.setSoTimeout(500);
            assertThrows(SocketTimeoutException.class, server::accept);
        });
    }

    @ParameterizedTest
    @ValueSource(strings = {"prod"})
    void nonTestProfileStillConnectsToLogstash(String profiles) throws Exception {
        withLogging(profiles, (context, server) -> {
            assertThat(context.getLogger(Logger.ROOT_LOGGER_NAME).getAppender("LOGSTASH"))
                    .isNotNull();
            server.setSoTimeout(5000);
            try (Socket connection = server.accept()) {
                assertThat(connection.isConnected()).isTrue();
            }
        });
    }

    private void withLogging(String profiles, LoggingCheck check) throws Exception {
        String previous = System.getProperty("logstash_hostname");
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        LogbackLoggingSystem logging = new LogbackLoggingSystem(getClass().getClassLoader());
        try (ServerSocket server = new ServerSocket(0, 1, InetAddress.getLoopbackAddress())) {
            System.setProperty("logstash_hostname", "localhost:" + server.getLocalPort());
            StandardEnvironment environment = new StandardEnvironment();
            environment.setActiveProfiles(profiles.split(","));
            logging.beforeInitialize();
            logging.initialize(new LoggingInitializationContext(environment),
                    "classpath:logback-spring.xml", null);
            check.run(context, server);
        } finally {
            context.stop();
            logging.cleanUp();
            if (previous == null) {
                System.clearProperty("logstash_hostname");
            } else {
                System.setProperty("logstash_hostname", previous);
            }
        }
    }

    @FunctionalInterface
    private interface LoggingCheck {
        void run(LoggerContext context, ServerSocket server) throws Exception;
    }
}
