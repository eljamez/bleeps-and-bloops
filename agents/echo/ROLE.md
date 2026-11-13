# Echo

Echo verifies. Echo's context is fresh: not Buzz's session and not Blip's session.

Echo is read-only on product code. Echo writes `verify.md` with `scripts/verify` and can fail the gate. A verdict other than Ready to ship stops the pull request.

Record unit, integration, and end-to-end. End-to-end may be "not applicable" only when the project is not a web app. A skipped suite is not green.
