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


### Gradle 래퍼 빌드

10개 모듈은 Gradle 8.14.6 래퍼와 배포본 SHA-256 검증을 사용합니다.
Gradle 9.8.1은 현재 빌드 스크립트의 `sourceCompatibility` 및 공통 모듈의
`annotationProcessorGeneratedSourcesDirectory` 설정과 호환되지 않습니다.
빌드 스크립트의 9.x 이행은 별도 작업입니다.

각 모듈 디렉터리에서 저장소 래퍼로 빌드합니다.

```sh
./gradlew --no-daemon build
```

CI는 `config`, `discovery`, `egovframe-cloud-module-common`에서 테스트를 포함하고,
나머지 7개 서비스는 기존대로 `./gradlew --no-daemon build -x test`를 실행합니다.
따라서 CI 빌드 성공은 7개 서비스의 전체 테스트 성공을 의미하지 않습니다.
Java 소스/타깃은 17이며, 공통 모듈은 JDK 17 toolchain이 필요합니다.
로컬에서는 JDK 21로 Gradle을 실행하고 공통 모듈에 JDK 17 컴파일러를 제공하여
위 CI 빌드 명령을 10개 모듈 모두 검증했습니다. CI의 실행 JDK는 17입니다.
