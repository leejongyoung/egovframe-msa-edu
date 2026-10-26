package org.egovframe.cloud.reservetest;

import org.egovframe.cloud.common.util.MessageUtil;
import org.egovframe.cloud.reactive.exception.ExceptionHandlerAdvice;
import org.egovframe.cloud.reserverequestservice.api.ReserveApiController;
import org.egovframe.cloud.reserverequestservice.config.MessageListenerContainerFactory;
import org.egovframe.cloud.reserverequestservice.domain.ReserveRepository;
import org.egovframe.cloud.reserverequestservice.domain.ReserveValidator;
import org.egovframe.cloud.reserverequestservice.service.ReserveService;
import org.egovframe.rte.fdl.cmmn.trace.LeaveaTrace;
import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.jackson.JacksonAutoConfiguration;
import org.springframework.boot.autoconfigure.validation.ValidationAutoConfiguration;
import org.springframework.boot.autoconfigure.web.reactive.HttpHandlerAutoConfiguration;
import org.springframework.boot.autoconfigure.web.reactive.ReactiveWebServerFactoryAutoConfiguration;
import org.springframework.boot.autoconfigure.web.reactive.WebFluxAutoConfiguration;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.StaticMessageSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.server.WebFilter;

import static org.mockito.Mockito.mock;

/**
 * ReserveRequestValidationHttpTest 전용 최소 WebFlux 컨텍스트.
 * 서비스 애플리케이션의 컴포넌트 스캔 범위(org.egovframe.cloud.reserverequestservice, ...common)
 * 밖의 패키지에 두어, 전체 컨텍스트를 띄우는 다른 테스트(@SpringBootTest)가 이 설정을 스캔하지 않도록 한다.
 */
@SpringBootConfiguration
@ImportAutoConfiguration({ReactiveWebServerFactoryAutoConfiguration.class,
    WebFluxAutoConfiguration.class, HttpHandlerAutoConfiguration.class, JacksonAutoConfiguration.class, ValidationAutoConfiguration.class})
// Direct advice import compensates for unmerged prerequisite PR #316; discovery is tested there.
@Import({ReserveApiController.class, ReserveService.class, ExceptionHandlerAdvice.class})
public class ReserveRequestHttpSliceApplication {
    public static final String OWNER = "authenticated-owner";

    @Bean LeaveaTrace leaveaTrace() {
        return new LeaveaTrace();
    }
    @Bean ReserveRepository repository() { return mock(ReserveRepository.class); }
    @Bean ReserveValidator validator() { return mock(ReserveValidator.class); }
    @Bean StreamBridge streamBridge() { return mock(StreamBridge.class); }
    @Bean AmqpAdmin amqpAdmin() { return mock(AmqpAdmin.class); }
    @Bean ConnectionFactory connectionFactory() {
        return mock(ConnectionFactory.class);
    }
    @Bean MessageListenerContainerFactory containers() { return mock(MessageListenerContainerFactory.class); }
    @Bean MessageUtil messageUtil() {
        return new MessageUtil();
    }
    @Bean StaticMessageSource messageSource() { return new StaticMessageSource(); }
    @Bean WebFilter authenticatedIdentity() {
        return (exchange, chain) -> chain.filter(exchange).contextWrite(
            ReactiveSecurityContextHolder.withAuthentication(
                new UsernamePasswordAuthenticationToken(OWNER, "unused", java.util.List.of())));
    }
}
