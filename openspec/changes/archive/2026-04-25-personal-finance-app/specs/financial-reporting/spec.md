## ADDED Requirements

### Requirement: Monthly summary report
The system SHALL generate detailed monthly financial summary reports showing income, expenses, and net savings.

#### Scenario: Generate monthly report
- **WHEN** user requests monthly report for March 2026
- **THEN** system generates report with total income, total expenses, net, and category breakdown

#### Scenario: Report includes trends
- **WHEN** monthly report is generated
- **THEN** report includes comparison to previous month with percent change

### Requirement: Category analysis report
The system SHALL generate detailed reports analyzing spending by category with trends and insights.

#### Scenario: Category spending breakdown
- **WHEN** user generates category analysis for 3 months
- **THEN** report displays spending per category with percentages and trends

#### Scenario: Top/bottom categories
- **WHEN** category report is generated
- **THEN** report identifies highest and lowest spending categories with insights

### Requirement: Income analysis report
The system SHALL generate reports analyzing income sources and trends.

#### Scenario: Income by source
- **WHEN** user generates income report
- **THEN** report displays income categorized by source (salary, freelance, investments) with totals

#### Scenario: Income trends
- **WHEN** income report covers 12 months
- **THEN** report shows monthly trend of income with average and projection

### Requirement: Budget performance report
The system SHALL generate reports comparing budget targets to actual spending.

#### Scenario: Budget vs actual
- **WHEN** user generates budget performance report
- **THEN** report shows each budget category with target amount, actual spending, variance, and status

#### Scenario: Budget achievement
- **WHEN** budget performance report is generated
- **THEN** report calculates percentage of budgets where spending stayed under limit

### Requirement: Year-to-date report
The system SHALL generate cumulative reports for year-to-date financial performance.

#### Scenario: YTD summary
- **WHEN** user generates YTD report on April 15
- **THEN** report includes totals for Jan-Apr with comparison to same period previous year

#### Scenario: YTD projections
- **WHEN** YTD report is generated
- **THEN** report projects year-end totals based on current pace

### Requirement: Custom report builder
The system SHALL allow users to create custom reports with selected date ranges, categories, and metrics.

#### Scenario: Select custom parameters
- **WHEN** user builds custom report
- **THEN** system allows selection of: date range, categories, metrics (income/expense/budget), format

#### Scenario: Save custom report template
- **WHEN** user creates custom report
- **THEN** system offers option to save as template for future use

### Requirement: Report scheduling
The system SHALL allow users to schedule automatic report generation and email delivery.

#### Scenario: Schedule monthly report
- **WHEN** user schedules monthly report every month-end
- **THEN** system automatically generates and emails report to user

#### Scenario: Schedule quarterly report
- **WHEN** user creates quarterly report schedule
- **THEN** system generates report on first day of each quarter

### Requirement: Report formats
The system SHALL support multiple report output formats including PDF, CSV, and JSON.

#### Scenario: Export as PDF
- **WHEN** user exports report as PDF
- **THEN** system generates formatted PDF with charts and tables

#### Scenario: Export as CSV
- **WHEN** user exports report as CSV
- **THEN** system generates CSV file with all data rows for analysis

### Requirement: Tax report
The system SHALL generate tax-specific reports with categorized income and expenses by tax year.

#### Scenario: Tax year report
- **WHEN** user generates tax report for 2025
- **THEN** system displays income and deductible expenses categorized for tax filing

#### Scenario: Estimated taxes
- **WHEN** self-employed user views tax report
- **THEN** system calculates estimated quarterly tax payments based on income
