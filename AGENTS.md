# Fork collaboration: egovframe-msa-edu

These instructions apply to `leejongyoung/egovframe-msa-edu`. This file and the fork
automation are fork-only; `scripts/open_upstream_pr.sh` excludes them from
contributions to `eGovFramework/egovframe-msa-edu`.

## Branch roles and review

- `main` must remain byte-identical to upstream `main`. Never commit to it.
  `.github/workflows/sync-upstream-main.yml` fast-forwards it daily and on
  manual dispatch. Divergence fails without force-pushing.
- `work` is this fork's default integration branch. Develop upstream-bound
  changes on a topic from `main`; develop fork infrastructure on a topic from
  `work`. Open a fork PR against `work` and review its CI before submission.
- Upstream also has release branches and Dependabot branches. This fork tracks none of them: the sync workflow
  never touches them, and nothing is merged or cherry-picked automatically between them and `main`/`work`.
  Roles (full-history comparison against upstream `main`, 2026-10-27):

  | Branch | Role | Fork handling |
  | --- | --- | --- |
  | `4.0.x`–`4.3.x` | Legacy lines (Spring Boot 2.x, Java 1.8, last commit 2026-05-18); this fork treats them as historical snapshots | Not tracked, not mirrored |
  | `5.0.x` | Direct center commits observed (3 unique commits; same Boot 3.5.6/Java 17 as `main`); release/back-merge policy unconfirmed | Not tracked, no automatic merge either way; use `main` |
  | `main` | Upstream development line; target of all 78 observed merged contributions since 2026-06-01 | Mirrored byte-for-byte by fork `main` |
  | `dependabot/*` | Upstream bot PR heads | Not tracked |
  | `work` | Fork-only integration branch | Where fork work and CI live |

  `5.0.x` fixes cannot be inferred from branch divergence alone; `security.md` does not name `5.0.x`, and how the
  center releases or back-merges it is undocumented. Do not ask upstream. Upstream fixes reach this fork through
  `main` only; request or apply nothing on `5.0.x`.

Upstream's existing workflows target `main`. The separate fork CI targets
`work` PRs and pushes and runs: Gradle builds for ten backend services (JDK 17), plus npm builds for admin and portal (Node 22).
Use that result as the baseline check. For changes outside its tested scope,
add a targeted verification and record the exact command/result in the PR.

## Upstream submissions

Batch reviewed work and use a clean checkout to run
`scripts/open_upstream_pr.sh work main --title "..." --body-file /path/to/body.md`.
It creates a disposable `upstream-submit/*` head and removes fork-only files.
Inspect the proposed diff and file list against current upstream `main` before
sending. Add any new fork-only files to the script's `DENYLIST`. Never use
`work` or a continuing development branch as an upstream PR head: open PR
diffs change after later pushes to their head branch.

The daily `.github/workflows/check-upstream-pr-hygiene.yml` checks all open
upstream PR heads authored by this fork owner from default branch `work`.
A failure remains an alert until an unsafe PR is closed or resubmitted.
Record cross-branch and tool-version dependencies in PR bodies; creation,
draft/ready state, CI, and merge are separate events. Upstream maintainers
control the merge.

## Issues and roadmap

Use verified evidence in issue bodies, `type:*` and `area:*` labels, a fitting
milestone, and [the fork Project](https://github.com/users/leejongyoung/projects/5).
Keep upstream-provided labels if their issue templates require them. Check a
box only when a specific change implements it. Link full upstream PR URLs,
mark closed/superseded submissions, and close upstream-bound issues once all
work is complete and linked upstream PRs are merged. Fork-only setup issues
may close after their fork PR and verification complete.
