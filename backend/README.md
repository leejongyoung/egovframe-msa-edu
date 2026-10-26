# Backend Directory

이 디렉토리는 egovframe-msa-edu 프로젝트의 백엔드 마이크로서비스들을 포함합니다.

## 구조
- `apigateway/`: API Gateway 서비스
- `board-service/`: 게시판 서비스
- `config/`: 공통 설정 파일
- `discovery/`: 서비스 디스커버리
- `egovframe-cloud-module-common/`: 공통 모듈
- `portal-service/`: 포탈 서비스
- `reserve-check-service/`: 예약 확인 서비스
- `reserve-item-service/`: 예약 품목 서비스
- `reserve-request-service/`: 예약 요청 서비스
- `user-service/`: 사용자 서비스

각 디렉토리에는 해당 마이크로서비스의 소스 코드와 문서가 포함되어 있습니다.

## 공통 개발/실행 방법
각 서비스별 README를 참고하거나, 루트 README를 참고하세요.


## 독립적인 백엔드 테스트 환경

각 서비스 디렉터리에서 `./gradlew --no-daemon build`로 테스트를 포함해 빌드합니다.
테스트 프로파일은 Config Server·Eureka·Cloud Bus 같은 외부 인프라를 사용하지 않습니다.
JPA 서비스는 컨텍스트별 H2 인메모리 DB와 H2 방언을 사용하고,
`user`·`authorization`처럼 MySQL에서 사용하는 이름은 H2의 `NON_KEYWORDS`로 처리합니다.
user-service의 시드는 `spring.sql.init`과 `defer-datasource-initialization`으로
Hibernate 스키마 생성 뒤 실행됩니다. 예약 서비스는 별도 H2 R2DBC DB와 `schema-h2.sql`을 사용합니다.
외부 공유 볼륨의 메시지는 테스트 리소스 fixture로 대체하고 파일 업로드는 임시 경로를 사용합니다.

board·portal HTTP 테스트는 운영 `SecurityConfig`와 JWT 필터를 그대로 실행합니다.
유효한 테스트 JWT를 보내며, 서비스 간 인가 호출만 random-port HTTP user-service 스텁으로 연결합니다.
스텁은 권한·HTTP 메서드·요청 경로별로 허용 여부를 판단하므로 무조건 허용하지 않습니다.
user-service 보안 테스트는 실제 JWT와 H2의 권한/인가 시드로 판정합니다.
다음 테스트는 실제 random-port 서버에서 허가된 요청의 JSON 성공 응답과
인증 없음·권한 부족 요청의 거부를 함께 확인합니다.

```sh
# 해당 서비스 디렉터리에서 실행
./gradlew --no-daemon test --tests '*BoardAuthorizationHttpTest'
./gradlew --no-daemon test --tests '*PortalAuthorizationHttpTest'
./gradlew --no-daemon test --tests '*UserServiceSecurityHttpTest'
```

별도 JVM의 board 실행 JAR도 테스트 H2·로컬 인가 HTTP 경계로 기동하여 JUnit 외부의 `curl`로 확인했습니다.
`GET /api/v1/boards?page=0&size=10`은 무인증·`ROLE_GUEST` JWT에서 403,
`ROLE_ADMIN` JWT에서 200/JSON 페이지를 반환했고, 확인 뒤 애플리케이션과 인가 스텁을 종료했습니다.

이 테스트는 운영 보안을 완화하지 않으며, 실제 MySQL·RabbitMQ·Config Server·Eureka를 함께
기동한 전체 서비스 종단간 테스트를 의미하지 않습니다. 운영 인가 데이터와 외부 시스템 연동은 별도로 검증해야 합니다.

## 테스트 프로파일 로깅

Logstash 설정이 있는 8개 모듈은 `default` 또는 `test` 프로파일에서 콘솔만 사용합니다.
`test`와 다른 프로파일을 함께 활성화해도 TCP 전송 및 파일 appender는 생성하지 않습니다.
그 외 프로파일에서는 기존 Logstash 전송 설정을 사용합니다.

각 해당 모듈 디렉터리에서 `./gradlew test --tests '*LoggingProfileTest'`로
실제 로깅 설정과 로컬 TCP 소켓을 사용하는 회귀 테스트를 실행할 수 있습니다.
이 테스트는 `default`/`test`/`test,prod`에서 콘솔만 사용하고 연결하지 않는지,
`prod`에서는 실제 TCP 연결을 유지하는지 확인합니다.
이 검증은 외부 Logstash 서버나 전체 서비스 통합 테스트를 의미하지 않습니다.

### Gradle 래퍼 빌드

10개 모듈은 Gradle 8.14.6 래퍼와 배포본 SHA-256 검증을 사용합니다.
Gradle 9.8.1은 현재 빌드 스크립트의 `sourceCompatibility` 및 공통 모듈의
`annotationProcessorGeneratedSourcesDirectory` 설정과 호환되지 않습니다.
빌드 스크립트의 9.x 이행은 별도 작업입니다.

각 모듈 디렉터리에서 저장소 래퍼로 빌드합니다.

```sh
./gradlew --no-daemon build
```

Java 소스/타깃은 17이며, 공통 모듈은 JDK 17 toolchain이 필요합니다.
2026-10-27 로컬 최종 검증은 9개 서비스의 Gradle을 JDK 21로 실행하고,
공통 모듈은 JDK 17로 실행하여 각 디렉터리에서 `./gradlew --no-daemon cleanTest build`를 수행했습니다.
10개 모듈 모두 테스트를 생략하지 않고 통과했습니다(514건, 실패·오류·건너뜀 0).

| 모듈 | 실행 테스트 |
| --- | ---: |
| apigateway | 22 |
| board-service | 45 |
| portal-service | 145 |
| reserve-check-service | 70 |
| reserve-item-service | 52 |
| reserve-request-service | 73 |
| user-service | 82 |
| config | 6 |
| discovery | 5 |
| egovframe-cloud-module-common | 14 |

CI의 실행 명령과 JDK 설정은 `.github/workflows/fork-ci.yml`을 기준으로 확인합니다.
`-x test`가 있는 빌드는 전체 테스트 성공의 근거가 될 수 없습니다.

## 예약 서비스 오류 응답

`reserve-check-service`, `reserve-item-service`, `reserve-request-service`는 공통
reactive 예외 advice를 스캔하여 컨트롤러 오류를 JSON으로 반환합니다.
응답에는 `timestamp`, `message`, `status`, `code`, `errors`가 포함됩니다.
존재하지 않는 엔티티의 업무 오류는 HTTP 400 / `E003`, 처리되지 않은 예외는
HTTP 500 / `E999`입니다. 기존 `@Valid` 경로의 입력 오류는 HTTP 400 / `E001`이며
`errors`에 `field`, `rejectedValue`, `message`이 포함됩니다.

이 등록은 새로운 요청 검증을 추가하지 않습니다. 예약 신청 API의 DTO 검증과
인증 사용자로 예약 소유자를 결정하는 정책은 별도 변경 사항입니다.

각 예약 서비스 디렉터리에서 `./gradlew test --tests '*ReactiveErrorResponseTest'`로
실제 HTTP 라우팅, JWT 인증, 예외 응답 회귀 테스트를 실행할 수 있습니다.
테스트는 서비스 경계를 모의 처리하고 외부 설정/검색/메시징 및 SQL 초기화를 끄므로
MySQL·RabbitMQ 연동이나 전체 예약 업무의 종단간 검증을 의미하지 않습니다.
