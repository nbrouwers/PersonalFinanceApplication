## Context

The ubiquitous language document was created and updated ad-hoc, often only after implementation was already underway. Terms introduced in proposals or specs were not automatically reflected in the UL, leading to drift between the domain vocabulary used in code and the documented language.

## Goals / Non-Goals

**Goals:**
- Make ubiquitous language review a mandatory step in the OpenSpec proposal phase
- Ensure the UL is updated before implementation starts, not after
- Let the user review and edit UL changes alongside the proposal before moving to apply

**Non-Goals:**
- No automation (this is a process/checklist change, not a tool change)
- No code or schema changes to OpenSpec itself
- No changes to the apply or archive phases (they already work correctly)

## Decisions

### Add a dedicated step to the propose workflow in AGENTS.md
A new bullet in the OpenSpec Workflow section will instruct the agent to check the UL after drafting the proposal but before creating tasks. This is the simplest change with maximum effect.

### Updated propose flow
The modified proposal flow becomes:
1. Create change directory (`openspec new change`)
2. Create proposal artifact
3. **Review ubiquitous language** — identify new/changed domain terms, update `openspec/ubiquitous-language.md`
4. Create design artifact
5. Create specs
6. Create tasks
7. **Pause for user review** — user can edit proposal, specs, and UL before proceeding

### UL maintenance section update
Add a link in the UL document's Maintenance section pointing to the AGENTS.md workflow rules, making it clear that UL updates are driven by the proposal process.

## Risks / Trade-offs

[Agent forgets the new step] → Mitigation: Document it clearly in AGENTS.md under the OpenSpec Workflow section, where all propose steps are listed
[User skips UL review] → Mitigation: The step explicitly says to pause for user review after all artifacts are created