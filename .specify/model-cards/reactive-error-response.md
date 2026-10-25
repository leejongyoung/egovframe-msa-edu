# Domain model card: reactive error responses

## One-sentence definition
The three reservation WebFlux services translate controller exceptions and declared request validation failures into the common ErrorResponse HTTP contract.

## Why this concept is needed
Public fork issue #12 reports that their application scans omit the reactive exception advice; servlet precedent #266 deliberately deferred this separate reactive path.

## Existing models and public contracts
`backend/egovframe-cloud-module-common/src/main/java/org/egovframe/cloud/reactive/exception/ExceptionHandlerAdvice.java` handles BusinessException, WebExchangeBindException and uncaught Exception. Common `exception/dto/ErrorCode.java` declares E003/400, E001/400, E999/500; `ErrorResponse.java` defines timestamp, message, status, code and errors. Preserve these existing mappings, not a new exception policy. Application entry points are ReserveCheckSeviceApplication, ReserveItemServiceApplication and ReserveRequestServiceApplication. Actual upstream main fetched 2026-10-26: 8767ea12eca32647ef363adee252ed6e0b466adc.

## Synthetic example data
Reservation id `missing-synthetic`, item id 991, a blank cancellation reason, and synthetic authenticated subject `advice-test-user`. No real records or credentials.

## Successful behavior examples
A valid authenticated request reaches the existing controller/service route unchanged. An EntityNotFoundException from a controller service boundary returns JSON status 400/code E003/empty errors. An unexpected exception returns JSON status 500/code E999.

## Rejected behavior examples
A blank cancellation reason on the existing validated check-service cancellation route yields HTTP 400/code E001 with field reasonCancelContent, before invoking the service. No new validation constraints are introduced.

## Outside this concept's responsibility
Client validation, authenticated ownership derivation, database availability, broker delivery, gateway authorization, new error mappings and broad reactive package scanning. Issue #12 request validation is separate: DTO userId is replaced by authenticated identity in ReserveService, so adding @Valid blindly would break omitted-client-userId requests.

## Rule sources and assumptions
- Public proposal: https://github.com/leejongyoung/egovframe-msa-edu/issues/12 (two issues, requests separate PRs).
- Public merged precedent: https://github.com/eGovFramework/egovframe-msa-edu/pull/266 (servlet only); https://github.com/eGovFramework/egovframe-msa-edu/pull/273 (existing reactive validation, advice explicitly deferred); #271/#272 establish declared-validation precedents in other services.
- Observed source: three application scans include common and service packages only. Reactive root also contains R2dbcConfig, UserAuditAware and AuthenticationConverter, so scan exception subpackage only to avoid unrelated registration.
- Observed source: reserve-request ReserveService.create/save calls applyReserveOwner using getUserId; preserving this is mandatory.
- HTTP reproduction confirms missing contract before registration and E003/E999/E001 after registration using the resolved published common dependency.

## Open questions and next evidence
Random-port HTTP tests exercise application discovery, actual routes, signed synthetic JWT conversion and existing argument validation; service boundaries are mocked. macOS java_home finds no runtime but Homebrew JDK21 exists; Gradle 8.5/source target17 will be checked. Docker socket unavailable, so no production MySQL/RabbitMQ end-to-end claim. Request validation remains separate follow-on requiring identity-contract analysis.
