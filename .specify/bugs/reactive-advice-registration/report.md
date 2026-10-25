# Advice-first verification and publication gate

Target: fork issue https://github.com/leejongyoung/egovframe-msa-edu/issues/12
Base: upstream main 8767ea12eca32647ef363adee252ed6e0b466adc.
Submission checkout: `/Users/leejongyoung/orca/workspaces/egovframe-msa-edu/msa-reactive-advice`, branch `leejongyoung/msa-reactive-advice` (unchanged branch).

## Final change

Seven submission files: the three reserve service application scans, three new `api/ReactiveErrorResponseTest.java` tests, and existing `backend/README.md`.
Only `org.egovframe.cloud.reactive.exception` is added to component scans. Broad reactive scanning would additionally register R2dbcConfig, UserAuditAware and AuthenticationConverter.
No dependencies, authentication code, DTOs, constraints, request controller validation, or service ownership logic change. Request DTO userId policy remains a separate follow-on; existing service authenticated-owner replacement remains untouched.
The complete reviewable diff, including previously untracked tests, is `submission-final.patch` beside this report (SHA-256 `3cb49ca2dafd5bf4a4d7950f8e2e3eaecc036154334e8c0088dd45fa74a28a16`). Existing application CRLF is preserved; use `git -c core.whitespace=cr-at-eol diff --check`.

## Actual HTTP evidence

Tests boot each real service application on a random port, use HTTP WebTestClient, real signed synthetic JWT conversion, actual existing controller routes, normal component discovery, and real WebFlux validation/advice dispatch. They never import advice or assert bean presence.
Only service boundaries are mocked to induce deterministic business/unexpected failures; external config/discovery/bus autodetection are disabled, H2 supplies connection configuration, and SQL initialization is disabled. Production MySQL and RabbitMQ are not exercised: Docker unavailable is an infrastructure limit, and this is explicitly an HTTP contract smoke rather than a full reservation integration test.

Run in each `backend/reserve-{check,item,request}-service` directory:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home ./gradlew test --tests '*ReactiveErrorResponseTest' --no-daemon
```

Gradle 8.5, JDK 21 runtime, existing Java 17 source/target. Resolved existing published common dependency supplies functioning E003/E999/E001 advice; no local common rebuild or dependency substitution is needed.

Before scan registration:
- check: 4 HTTP tests, 3 expected failures; business error returned 500, E999 and E001 lacked common code; health passed (`check-http-before-3.log`). Earlier preserved logs record SQL initialization setup failures, not bug evidence.
- item: 4 HTTP tests, 3 expected failures, same missing business/unexpected/validation contract; health passed (`item-http-before.log`).
- request: 3 HTTP tests, 2 expected failures, missing business/unexpected contract; health passed (`request-http-before.log`). No new validation added to request routes.

After scan registration: check 4, item 4, request 3 HTTP tests pass (11 total); check cancellation and item location-name existing validations return E001 and verify service was not invoked. Business E003 returns 400 with timestamp and empty errors; unexpected E999 returns 500 with empty errors. Healthy existing status routes continue returning service information. Final logs: `check-http-after-2.log`, `item-http-final.log`, `request-http-final.log`.

The item test-resource application.yml shadows production reactive mode, so all new tests explicitly select reactive mode. Existing SQL initialization must be disabled to avoid running MySQL DDL against H2. These are test configuration choices only.

## Publication state and outstanding work

Coordinator approved the exact seven-file diff and explicitly directed a single commit in the existing submission checkout, without integrating submission history onto work. Submission commit: `c16cf309a1a2a512684bee36c9cc7bc3bdb89947`; the checkout is clean. Immediately before push, upstream main and origin/upstream-submit both matched `8767ea12eca32647ef363adee252ed6e0b466adc`. Fast-forward push advanced only origin/upstream-submit to the submission commit; upstream main was rechecked unchanged immediately before PR creation.

Published one open PR: https://github.com/eGovFramework/egovframe-msa-edu/pull/316 from leejongyoung:upstream-submit to main. No force push, auto-merge or issue closing occurred. Work contains only fork evidence: initial evidence commit `0bf4609` was fast-forward pushed from `bebe1c3`; submission history is excluded. The PR body links the full fork issue URL and explicitly excludes the request validation/DTO userId follow-on. CI and maintainer review/merge are separate subsequent events, not claimed complete.
