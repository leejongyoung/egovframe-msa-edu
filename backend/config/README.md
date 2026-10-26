# Config

공통 설정 파일 및 환경설정 정보를 관리하는 디렉토리입니다.

- 공통 프로퍼티, 환경 변수 등을 포함합니다.

## 참고
각 서비스에서 이 설정을 참조합니다.

## 자격증명 환경 변수 오버라이드
DB·Eureka 접속 자격증명은 설정 파일에 평문으로 두지 않고 환경 변수로 주입할 수 있습니다.
값을 지정하지 않으면 기존 로컬 개발용 기본값(`msaportal`, `admin`)이 그대로 사용되므로 기존 구동 방식에는 영향이 없습니다.

| 환경 변수 | 적용 대상 | 기본값 |
|---|---|---|
| `DB_USERNAME` | 각 서비스 datasource/r2dbc 사용자 | `msaportal` |
| `DB_PASSWORD` | 각 서비스 datasource/r2dbc 비밀번호 | `msaportal` |
| `EUREKA_USERNAME` | Eureka 클라이언트 접속 사용자 | `admin` |
| `EUREKA_PASSWORD` | Eureka 클라이언트 접속 비밀번호 | `admin` |

운영 환경에서는 컨테이너/배포 환경 변수로 위 값을 주입하여 평문 자격증명 노출을 피하는 것을 권장합니다.

## JWT 서명 비밀키 (필수)

`TOKEN_SECRET`은 기본값이 없습니다. Config 서버와 JWT를 발급·검증하는 모든 서비스에 같은 값을 환경 변수로 주입해야 합니다. 미설정 시 `${TOKEN_SECRET}`을 해석할 수 없어 해당 설정을 사용하는 서비스의 시작이 실패합니다. DB·Eureka의 로컬 기본값과는 별개입니다.

| 환경 변수 | 적용 대상 | 기본값 |
|---|---|---|
| `TOKEN_SECRET` | Config 서버 및 JWT 발급·검증 서비스의 `token.secret` | 없음 (필수) |

로컬 실행 전 충분히 긴 임의 값을 생성해 현재 셸에만 설정합니다. 같은 값을 다른 서비스 실행 환경에도 안전하게 전달합니다.

```sh
export TOKEN_SECRET="$(openssl rand -base64 48)"
```

Compose 사용 시 Config 서버와 소비 서비스 각각의 `environment`에 `TOKEN_SECRET: ${TOKEN_SECRET:?TOKEN_SECRET must be set}`을 지정합니다. 기존 예제의 `TOKEN_SECRET: egovframe` 값도 생성한 동일 값으로 대체해야 합니다. Kubernetes에서는 별도로 생성한 Secret의 동일 key를 각 Deployment의 `env.valueFrom.secretKeyRef`로 주입합니다. 실제 비밀키를 YAML·버전 관리 파일·로그에 기록하지 않습니다.

기존 공개 기본값으로 발급한 토큰은 신뢰하지 말고 배포 시 키를 교체합니다. 모든 발급·검증 서비스를 함께 갱신하고, 기존 로그인·refresh 토큰을 폐기한 뒤 재로그인합니다. 테스트 전용 설정의 리터럴은 운영 키로 사용하지 않으며 이 변경에서는 유지합니다.
