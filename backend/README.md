# Backend Directory

이 디렉토리는 egovframe-msa-edu 프로젝트의 백엔드 마이크로서비스들을 포함합니다.

## 구조
- `apigateway/`: API Gateway 서비스
- `board-service/`: 게시판 서비스
- `config/`: 공통 설정 파일
- `discovery/`: 서비스 디스커버리
- `module-common/`: 공통 모듈
- `portal-service/`: 포탈 서비스
- `reserve-check-service/`: 예약 확인 서비스
- `reserve-item-service/`: 예약 품목 서비스
- `reserve-request-service/`: 예약 요청 서비스
- `user-service/`: 사용자 서비스

각 디렉토리에는 해당 마이크로서비스의 소스 코드와 문서가 포함되어 있습니다.

## 공통 개발/실행 방법
각 서비스별 README를 참고하거나, 루트 README를 참고하세요.


## board-service 테스트 DB와 남은 실패

board 테스트 프로파일은 컨텍스트마다 별도 H2 인메모리 DB를 사용하며,
MySQL의 `user` 테이블을 따옴표 없이 조회할 수 있도록 H2의 `USER` 예약어 처리를 해제합니다.
`backend/board-service`에서 `./gradlew test --tests '*TestDatabaseSchemaTest'`로
실제 JDBC 조회를 검증할 수 있습니다.

JDK 21/Gradle 8.5에서 전체 `./gradlew test --no-daemon`은 37건 중 27건이 여전히 실패합니다.
HTML 응답 변환 실패 25건과 상태 단언 실패 2건은 별도 인증/환경 범위로 남겨 두었습니다.
초기 빈 DB에서 Hibernate가 없는 FK를 삭제하려는 경고도 남아 있습니다.
이 테스트 DB 수정은 CI의 `-x test` 정책이나 운영 인증/DB 설정을 변경하지 않습니다.
