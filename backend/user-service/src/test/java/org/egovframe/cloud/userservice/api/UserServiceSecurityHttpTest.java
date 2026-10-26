package org.egovframe.cloud.userservice.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.egovframe.cloud.common.domain.Role;
import org.egovframe.cloud.userservice.api.user.dto.UserSaveRequestDto;
import org.egovframe.cloud.userservice.domain.user.User;
import org.egovframe.cloud.userservice.domain.user.UserRepository;
import org.egovframe.cloud.userservice.service.user.UserService;
import org.egovframe.cloud.userservice.support.TestTokens;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 실제 HTTP(TestRestTemplate)로 user-service 의 인증/인가 경계를 검증한다.
 * <ul>
 * <li>운영 코드의 {@code SecurityConfig}, {@code AuthenticationFilter}(JWT 검증),
 * {@code AuthorizationService}(DB 의 authorization / role_authorization 행으로 판정)를 그대로 사용한다.</li>
 * <li>테스트가 만드는 것은 JWT 와 DB 데이터(h2/data.sql 의 인가 행)뿐이다. 인가 판정을 mocking 하지 않는다.</li>
 * </ul>
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UserServiceSecurityHttpTest {

    private static final String PASSWORD = "test1234!";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private String createdEmail;

    @AfterEach
    void cleanup() {
        if (createdEmail != null) {
            userRepository.findByEmail(createdEmail).ifPresent(u -> userRepository.deleteById(u.getId()));
            createdEmail = null;
        }
    }

    private ResponseEntity<String> exchange(HttpMethod method, String path, String authorization, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        if (body != null) {
            headers.setContentType(MediaType.APPLICATION_JSON);
        }
        if (authorization != null) {
            headers.set(HttpHeaders.AUTHORIZATION, authorization);
        }
        return restTemplate.exchange(path, method, new HttpEntity<>(body, headers), String.class);
    }

    private String createUser(Role role) {
        createdEmail = UUID.randomUUID() + "@test.com";
        userService.save(UserSaveRequestDto.builder()
                .userName("보안테스트")
                .email(createdEmail)
                .password(PASSWORD)
                .roleId(role.getKey())
                .userStateCode("01")
                .build());
        return createdEmail;
    }

    @Test
    void 인증_없이_보호된_API_호출은_403으로_거부된다() {
        ResponseEntity<String> response = exchange(HttpMethod.GET, "/api/v1/users", null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void 인증_없이_관리자_전용_쓰기_API_호출은_403으로_거부된다() {
        ResponseEntity<String> response = exchange(HttpMethod.POST, "/api/v1/authorizations", null,
                "{\"authorizationName\":\"x\",\"urlPatternValue\":\"/x\",\"httpMethodCode\":\"GET\",\"sortSeq\":999}");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void 서명이_위조된_토큰은_401로_거부된다() {
        ResponseEntity<String> response = exchange(HttpMethod.GET, "/api/v1/users",
                TestTokens.forgedBearer("admin", TestTokens.ADMIN), null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void 일반_사용자_권한으로_관리자_전용_API_조회는_403으로_거부된다() {
        String bearer = TestTokens.bearer("user-1", TestTokens.USER);

        assertThat(exchange(HttpMethod.GET, "/api/v1/users", bearer, null).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(exchange(HttpMethod.GET, "/api/v1/roles/all", bearer, null).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(exchange(HttpMethod.GET, "/api/v1/authorizations", bearer, null).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void 일반_사용자_권한으로_관리자_전용_API_변경은_403으로_거부되고_데이터는_그대로다() {
        String email = createUser(Role.USER);
        User user = userRepository.findByEmail(email).orElseThrow();
        String bearer = TestTokens.bearer("user-1", TestTokens.USER);

        ResponseEntity<String> response = exchange(HttpMethod.DELETE, "/api/v1/users/delete/" + user.getUserId(), bearer, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(userRepository.findById(user.getId()).orElseThrow().getUserStateCode()).isEqualTo("01");
    }

    @Test
    void 일반_사용자_권한으로_허용된_API_는_성공한다() throws Exception {
        String email = createUser(Role.USER);
        User user = userRepository.findByEmail(email).orElseThrow();
        String bearer = TestTokens.bearer(user.getUserId(), TestTokens.USER);

        ResponseEntity<String> response = exchange(HttpMethod.GET, "/api/v1/users/" + user.getUserId(), bearer, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode json = objectMapper.readTree(response.getBody());
        assertThat(json.get("userId").asText()).isEqualTo(user.getUserId());
        assertThat(json.get("email").asText()).isEqualTo(email);
    }

    @Test
    void 관리자_권한은_인가된_API_에서_JSON_응답을_받는다() throws Exception {
        String bearer = TestTokens.bearer("admin-1", TestTokens.ADMIN);

        ResponseEntity<String> roles = exchange(HttpMethod.GET, "/api/v1/roles/all", bearer, null);

        assertThat(roles.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(roles.getHeaders().getContentType().isCompatibleWith(MediaType.APPLICATION_JSON)).isTrue();
        JsonNode json = objectMapper.readTree(roles.getBody());
        assertThat(json.isArray()).isTrue();
        assertThat(json.findValuesAsText("roleId")).contains(TestTokens.ADMIN, TestTokens.USER);

        ResponseEntity<String> users = exchange(HttpMethod.GET, "/api/v1/users?page=0&size=10", bearer, null);
        assertThat(users.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(objectMapper.readTree(users.getBody()).has("content")).isTrue();
    }

    @Test
    void 관리자_권한으로_잘못된_요청_본문은_검증_오류_400으로_거부된다() throws Exception {
        String bearer = TestTokens.bearer("admin-1", TestTokens.ADMIN);

        ResponseEntity<String> response = exchange(HttpMethod.POST, "/api/v1/users", bearer,
                "{\"userName\":\"사용자\",\"email\":\"email\",\"password\":\"test\"}");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        JsonNode json = objectMapper.readTree(response.getBody());
        assertThat(json.get("status").asInt()).isEqualTo(400);
        assertThat(json.get("errors").isEmpty()).isFalse();
    }

    @Test
    void 로그인으로_발급된_토큰은_운영_인가_판정을_통과한다() throws Exception {
        String email = createUser(Role.ADMIN);

        ResponseEntity<String> login = exchange(HttpMethod.POST, "/login", null,
                "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}");

        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        String accessToken = login.getHeaders().getFirst("access-token");
        assertThat(accessToken).isNotBlank();

        ResponseEntity<String> roles = exchange(HttpMethod.GET, "/api/v1/roles/all", "Bearer " + accessToken, null);
        assertThat(roles.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void 잘못된_비밀번호로는_토큰이_발급되지_않는다() {
        String email = createUser(Role.ADMIN);

        ResponseEntity<String> login = exchange(HttpMethod.POST, "/login", null,
                "{\"email\":\"" + email + "\",\"password\":\"wrong-password1!\"}");

        // AuthenticationFilter 는 401 을 내려 보내지만, 서블릿 컨테이너의 /error 디스패치가 다시 인가 판정(익명 거부)을 거쳐
        // 클라이언트에는 403 으로 보이는 것이 현재 운영 동작이다. 어느 쪽이든 거부이며 토큰은 발급되지 않아야 한다.
        assertThat(login.getStatusCode()).isIn(HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN);
        assertThat(login.getHeaders().containsKey("access-token")).isFalse();
        assertThat(login.getHeaders().containsKey("refresh-token")).isFalse();
    }

    /** 다른 서비스(board/portal 의 DelegatingAuthorizationService)가 호출하는 인가 확인 엔드포인트. */
    @Test
    void 인가_확인_엔드포인트는_권한별_허용_여부를_DB_기준으로_응답한다() {
        String admin = TestTokens.bearer("admin-1", TestTokens.ADMIN);
        String user = TestTokens.bearer("user-1", TestTokens.USER);
        String check = "/api/v1/authorizations/check?httpMethod={m}&requestPath={p}";

        assertThat(restTemplate.exchange(check, HttpMethod.GET, bearerEntity(admin), String.class, "GET", "/user-service/api/v1/users").getBody()).isEqualTo("true");
        assertThat(restTemplate.exchange(check, HttpMethod.GET, bearerEntity(user), String.class, "GET", "/user-service/api/v1/users/abc").getBody()).isEqualTo("true");
        assertThat(restTemplate.exchange(check, HttpMethod.GET, bearerEntity(user), String.class, "GET", "/user-service/api/v1/users").getBody()).isEqualTo("false");
        assertThat(restTemplate.exchange(check, HttpMethod.GET, bearerEntity(user), String.class, "DELETE", "/user-service/api/v1/users/delete/abc").getBody()).isEqualTo("false");
    }

    private HttpEntity<Void> bearerEntity(String bearer) {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, bearer);
        return new HttpEntity<>(headers);
    }
}
