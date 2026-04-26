## MODIFIED Requirements

### Requirement: Parse Triodos CSV with correct columns
The system SHALL correctly map columns from Triodos CSV without headers.

#### Scenario: Parse sample row
- **WHEN** CSV contains: "01-01-2026","NL43TRIO0198077920","375,00","Debet","C.J.J. Brouwers en/of M.","TRIONL2U NL11TRIO0788886290","PO","Boodschappen dag 01","4.114,29"
- **THEN** parsed: date=2026-01-01, account=NL43TRIO0198077920, amount=375, direction=Debet, name=C.J.J. Brouwers en/of M., contraAccount=TRIONL2U NL11TRIO0788886290, description=Boodschappen dag 01