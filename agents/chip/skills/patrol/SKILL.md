---
name: chip-patrol
description: Run the daily scout patrol. File bleeps:found issues and start the pipeline up to the cap.
---

# Patrol

Run `scripts/bleeps-scout`. Use `--dry-run` when you only want the findings.

Do not scan a second way beside the script. Do not raise the cap to clear a queue. Guardrail findings still wait for James.
