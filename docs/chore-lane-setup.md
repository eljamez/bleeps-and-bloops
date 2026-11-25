# Chore lane setup

The scripts and the workflows ship in the repo. These settings live in GitHub, and only you can turn them on. Until you do, `scripts/chore-lane` can pass and the workflow still skips. On this repo the owner is James. The lane mentions the repository owner, which here is `@eljamez`.

Do these in order. `main` is not part of the lane.

1. On `develop`, turn on **Do not allow bypassing the above settings**. Admins, including the bots while they use your login, then cannot merge a red pull request. You cannot force-merge either, until you turn this off.
2. Add `merge-gate` as a required check, next to `check` and `e2e`. The workflow is `.github/workflows/merge-gate.yml`. It runs `scripts/merge-pr check` and `scripts/chore-lane` and writes which lane applies. A feature pull request still passes the check. The lane merge does not.
3. Turn on **Allow auto-merge** in the repository settings. The lane workflow squash-merges with the app token once the script passes. `scripts/merge-pr --apply` still does not merge.
4. Create a GitHub App for the lane. Permissions: Contents (read and write), Pull requests (read and write), Issues (read and write), and Administration (read and write) so it can set `BLEEPS_AUTOMERGE`. Install it on this repository. Put the app id in the secret `BLEEPS_APP_ID` and the private key in `BLEEPS_APP_PRIVATE_KEY`. If either secret is missing, the merge job skips and logs why. A revert that cannot set the variable fails closed.
5. Create the repository variable `BLEEPS_AUTOMERGE` and set it to `on`. Anything else, including leaving it unset, leaves the lane off. Create a `bleeps:hold` label. Adding it to one pull request stops that pull request. After a red `develop`, the workflow sets the variable to `off`. It stays off until you set it back to `on`.
6. Install the Renovate GitHub App. `renovate.json` requests patch and lockfile updates only, waits 3 days, skips 0.x packages, and groups patches weekly. Renovate's own automerge stays off. This repo does not add Dependabot version updates.
7. Optional: a machine account as the `gh` login on the Orca host, with write and not admin. Boop's pull requests then have an author the lane can tell from you. Until then, only Renovate (or a login named Boop) passes the author gate. One free machine account is allowed beside a personal account.

The workflow squash-merges at most 3 qualifying pull requests a day, one at a time, on weekdays from 8 AM to 6 PM Pacific. It comments the gate JSON on the pull request. If `develop` goes red on the lane commit, it opens a revert pull request into `develop` and an issue that mentions the repository owner.
