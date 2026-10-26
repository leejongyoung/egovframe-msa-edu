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


## 테스트 프로파일 로깅

Logstash 설정이 있는 8개 모듈은 `default` 또는 `test` 프로파일에서 콘솔만 사용합니다.
`test`와 다른 프로파일을 함께 활성화해도 TCP 전송 및 파일 appender는 생성하지 않습니다.
그 외 프로파일에서는 기존 Logstash 전송 설정을 사용합니다.

각 해당 모듈 디렉터리에서 `./gradlew test --tests '*LoggingProfileTest'`로
실제 로깅 설정과 로컬 TCP 소켓을 사용하는 회귀 테스트를 실행할 수 있습니다.
이 테스트는 `default`/`test`/`test,prod`에서 콘솔만 사용하고 연결하지 않는지,
`prod`에서는 실제 TCP 연결을 유지하는지 확인합니다.
이 검증은 외부 Logstash 서버나 전체 서비스 통합 테스트를 의미하지 않습니다.

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
