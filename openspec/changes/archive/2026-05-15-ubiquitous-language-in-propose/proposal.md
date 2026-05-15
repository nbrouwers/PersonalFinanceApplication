## Why

The ubiquitous language document (`openspec/ubiquitous-language.md`) was previously updated reactively — only when explicitly asked or after implementation was already done. This caused terms to be missed, and the document fell out of sync with the actual domain vocabulary used in code and specs. It needs to be part of the proposal stage itself, so new domain concepts are captured before development begins and can be reviewed alongside the proposal.

## What Changes

- Update `AGENTS.md` to require checking and updating the ubiquitous language as a mandatory step during every OpenSpec proposal phase
- The check must happen after the proposal is drafted but before moving to apply, so the user can review and edit the UL alongside the proposal
- Add the ubiquitous language document to the context files that are read during the apply phase, so implementation always sees current terminology
- Update `openspec/ubiquitous-language.md` maintenance section to explicitly link to the proposal workflow

## Capabilities

### New Capabilities
<!-- No new software capabilities being introduced — this is a workflow/process change -->

### Modified Capabilities
<!-- No existing software capabilities are being modified -->

## Impact

- Only `AGENTS.md` and `openspec/ubiquitous-language.md` (maintenance section) are modified
- No code, API, or database changes
- Workflow change for how OpenSpec proposals are handled going forward