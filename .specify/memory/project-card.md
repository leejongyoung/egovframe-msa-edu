# egovframe-msa-edu: project context

## Role, scope, and public entry points

`README.md` describes an educational cloud-native MSA template. `backend/` has gateway,
configuration/discovery, a common library, board/user/portal services, and reservation item,
request, and check services. `frontend/admin` and `frontend/portal` are Next.js/React/TypeScript
clients; `config/`, `docker-compose/`, and `k8s/` describe environment and deployment resources.
Preserve service API/data contracts, reservation state semantics, authentication, and client routes.
Check the actual directory names: CI builds `egovframe-cloud-module-common`, while the README
structure uses the older `module-common` label.

## Build and verification evidence

- `backend/board-service/build.gradle` targets Java 17 and Spring Boot 3.5.6 with Spring Cloud
  2025.0.0. Backend services have their own Gradle wrapper/build definitions.
- `.github/workflows/fork-ci.yml` uses JDK 17 and executes from each `backend/<service>`:
  `./gradlew --no-daemon build -x test`, except config, discovery, and
  egovframe-cloud-module-common use `./gradlew --no-daemon build`.
  Thus most service tests are deliberately excluded; builds do not establish end-to-end coverage.
- The frontend CI uses Node 22, `npm ci`, then `npm run build --if-present` with
  `NODE_OPTIONS=--openssl-legacy-provider` in each frontend app.
  Both package manifests still declare Node 14.8.0 / npm 6.14.7; README also describes that
  older environment. This discrepancy is evidence to consider, not permission to change engines.
- `frontend/admin/package.json` builds Next plus the custom server; portal uses `next build`.
  Both provide `npm test` (`jest --coverage`); CI build alone does not run these tests.
- README describes IDE Gradle import and `npm install` / `npm run dev`. Runtime verification
  requires the relevant configuration/discovery services and local data/services; deployment
  resources include MySQL, RabbitMQ, search/logging, and tracing. Read affected service config
  and test setup before choosing a regression command. No infrastructure was started for adoption.

## Contribution and submission baseline

`AGENTS.md` defines the upstream `main` mirror and fork `work` integration/review policy.
Actual parent: `eGovFramework/egovframe-msa-edu`. Fetch its current default ref and record the SHA;
preserve existing submission branches and PRs. The existing shell helper's denylist now includes
`.specify` and `.omp` as required by local instructions. It still derives submission history
from `work`; do not invoke it for the new workflow because stripping files does not strip
adoption commits. Use a separate worktree at the fetched upstream base and stage application
changes only. Adoption creates no PR; existing fork review/CI remains required for later fixes.

## Exploration limits

No `.codegraph/` index was present. Targeted README, AGENTS, Gradle, package manifest, CI, and
helper inspection supplied this context. No application test/build/formatter was run.


## Maintenance process

Follow [constitution.md](constitution.md) for the domain-card, assessment, planning, verification,
and submission gates. Commands are installed under `.omp/commands/`; read them as agent
instructions. No application build or test was run for tool adoption. Scaffold checks establish
tool installation only, not application correctness.
