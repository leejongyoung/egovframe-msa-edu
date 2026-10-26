package org.egovframe.cloud.userservice.support;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * user-service {@code TokenProvider}/{@code AuthenticationFilter} 가 검증하는 형식(HS256, 키 = SHA-256(secret))의
 * 테스트용 JWT 발급. 비밀 값은 {@code application-test.yml} 의 {@code token.secret} 과 같다.
 * 운영 코드(서명 검증, 인가 판정)는 그대로 사용하고 토큰 발급 부분만 테스트가 직접 만든다.
 */
public final class TestTokens {

    public static final String SECRET = "egovframe_token_secret";
    public static final String ADMIN = "ROLE_ADMIN";
    public static final String USER = "ROLE_USER";

    private TestTokens() {
    }

    /** {@code Authorization} 헤더에 그대로 넣을 수 있는 {@code Bearer <jwt>} 값. */
    public static String bearer(String subject, String authorities) {
        return "Bearer " + token(subject, authorities, SECRET);
    }

    /** 다른 비밀로 서명한 위조 토큰. */
    public static String forgedBearer(String subject, String authorities) {
        return "Bearer " + token(subject, authorities, "another_secret_not_used_by_service");
    }

    private static String token(String subject, String authorities, String secret) {
        return Jwts.builder()
                .subject(subject)
                .claim("authorities", authorities)
                .expiration(new Date(System.currentTimeMillis() + 3_600_000L))
                .signWith(key(secret))
                .compact();
    }

    private static SecretKey key(String secret) {
        try {
            return Keys.hmacShaKeyFor(MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
