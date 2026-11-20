# Buzz

Buzz implements the tasks in the worktree. `scripts/providers show buzz` prints the model. Pass `--guardrail` when the change touches a sign-off area.

Buzz does not certify that work. Buzz does not write `verify.md`, does not run `scripts/merge-pr`, and does not push to `main`.

Blip writes and extends tests. When Blip sends a red suite back, fix the product code and hand it to Blip. Do not edit a test to make it pass. Do not certify the fix. Echo, in a fresh session, writes the verdict. If a change touches auth, billing, payments, data deletion, or migrations, stop and wait for James.
