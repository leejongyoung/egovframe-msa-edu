## 수정 사유 Reason for modification

- [X] 버그수정 Bug fixes
- [ ] 기능개선 Enhancements
- [ ] 기능추가 Adding features
- [ ] 기타 Others

When a reservation WebFlux controller raises an entity-not-found error, its service currently returns the default HTTP 500 response because common reactive exception advice is outside the component scan. Register `org.egovframe.cloud.reactive.exception` in the three reserve service scans so existing business errors return HTTP 400 / E003, unexpected errors return HTTP 500 / E999, and existing request validation returns HTTP 400 / E001 with field errors.

Related fork issue: https://github.com/leejongyoung/egovframe-msa-edu/issues/12 (advice-registration portion only; this PR does not close the validation follow-on).

## 수정된 소스 내용 Modified source

Three scan declarations add only the exception subpackage. Scanning the entire reactive package would also discover R2dbcConfig, UserAuditAware and AuthenticationConverter, which are outside this fix. Three behavior regression tests boot the actual service applications on random ports and exercise existing controller routes, real JWT conversion, WebFlux argument validation and advice discovery over HTTP. The existing backend consumer README documents the response contract and test limits.

No dependency, authentication, DTO constraint or controller validation changes. Adding `@Valid` to request-service create/save and deciding the DTO `userId` policy are explicitly deferred: the service currently replaces DTO userId with authenticated identity, and that contract remains unchanged.

## JUnit 테스트 JUnit tests

- [X] JUnit 테스트 JUnit tests
- [ ] 수동 테스트 Manual testing

All **11 real random-port WebFlux HTTP tests pass**: reserve-check 4, reserve-item 4, reserve-request 3. E003/E999 responses include the common status/code/errors; existing check cancellation and item location validation return E001 with field errors and do not invoke the service. Existing health-info routes remain HTTP 200.

Exact command, run in each `backend/reserve-{check,item,request}-service` directory:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ./gradlew test --tests '*ReactiveErrorResponseTest' --no-daemon
```

Gradle 8.5, JDK 21 runtime, existing Java 17 source/target; existing resolved published common artifact, with no dependency substitution. Final results: check BUILD SUCCESSFUL (23s), item BUILD SUCCESSFUL (16s), request BUILD SUCCESSFUL (15s).

Negative controls, with only the scan registration absent, reach HTTP routing and fail contract assertions only: check 3/4 fail, item 3/4 fail, request 2/3 fail, while all health controls pass. Business errors return 500 instead of 400, and common E999/E001 code fields are missing. No bean-presence-only assertions or direct advice imports are used.

These are HTTP contract smoke tests with mocked service boundaries and disabled external configuration/discovery/bus plus SQL initialization; H2 supplies connection configuration. Docker was unavailable, so no MySQL/RabbitMQ or full reservation end-to-end verification is claimed. Manual browser testing was not performed. Upstream service builds skip tests, so the exact focused local command and results are recorded here.

## 테스트 브라우저 Test Browser

- [X] 기타 Others — automated HTTP WebTestClient; no browser UI changes

## 테스트 스크린샷 또는 캡처 영상 Test screenshots or captured video

Text test results above establish before/after HTTP behavior; no browser screenshots are applicable.
