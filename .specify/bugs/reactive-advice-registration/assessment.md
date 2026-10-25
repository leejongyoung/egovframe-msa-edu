# Bug Assessment: reactive advice registration

- **Slug**: reactive-advice-registration (automatically generated for dispatched work)
- **Created**: 2026-10-26
- **Source**: https://github.com/leejongyoung/egovframe-msa-edu/issues/12
- **URL policy**: github.com, https, allowlisted; public issue fetched using gh.
- **Verdict**: confirmed by real random-port HTTP smoke
- **Severity**: medium

## Report (summarized)
Three reactive service scans omit shared exception advice, and request-service create/save omit validation. Issue asks for separate advice and validation submissions. Coordinator confirmed advice-first scope.

## Symptom
Business errors may use default WebFlux responses instead of declared common ErrorResponse. Existing validation responses may omit E001/field errors.

## Reproduction
Use real application random-port HTTP tests in a clean Orca-managed checkout of freshly fetched actual upstream main 8767ea12eca32647ef363adee252ed6e0b466adc. Exercise existing controller routes, real JWT conversion and WebFlux argument validation, replacing service boundaries only where needed to induce deterministic exceptions. Reproduce prior to application edits. External configuration/discovery/bus are disabled; service boundaries are mocked; H2 supplies connection configuration with SQL initialization disabled. No Docker/MySQL/RabbitMQ end-to-end claim.

## Suspected Code Paths
- Three reserve-* application ComponentScan declarations omit org.egovframe.cloud.reactive.exception.
- Common reactive ExceptionHandlerAdvice already defines BusinessException/WebExchangeBindException/Exception mappings.

## Root Cause Hypothesis
High source confidence: scan omission prevents advice discovery. Runtime confirmed: before scan registration business errors return HTTP 500; E999/E001 responses have no common code field.

## Proposed Remediation
**Preferred**: add only org.egovframe.cloud.reactive.exception to the three scans. Add behavior regression tests proving HTTP E003, E999 and existing E001 validation/field errors. After smoke, describe response shape in existing consumer README. Do not import advice directly in tests because that would hide broken discovery.

**Alternatives**: scanning entire reactive root introduces unrelated R2dbc/auditing/authentication beans and is rejected as broader scope.

**Files likely to change**: three application entry points; three focused service tests; existing backend consumer README.

**Tests to add**: real server responses for existing controller routes, valid-route controls, validation short circuit and unexpected-error mapping. No annotation or bean-presence-only assertion.

## Risks & Considerations
Registration changes all controller errors covered by existing advice, including unexpected errors to E999 JSON. Infrastructure may be absent. Upstream service CI skips tests, so record exact local test commands. Published common artifact must be checked against source. No dependency upgrades, authentication changes, or database/broker contracts.

## Open Questions
Request validation is out of first PR scope: authenticated ownership conflicts with DTO client userId constraint. No policy change should be inferred.

## Deduplication
Reviewed all PR titles (limit 500, repository has fewer) and relevant bodies: #266, #271, #272, #273, #279 and #58. #266/#273 explicitly defer reactive advice; no open duplicate found. Other reserve PRs concern dependencies, inventory, attachments, or DTO-only tests.

## Extension hooks
.specify/extensions.yml contains hooks: {}; no assessment hooks registered.
