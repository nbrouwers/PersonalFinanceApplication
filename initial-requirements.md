Purpose:
A full-stack personal finance management application designed to help users track income, expenses and budgets. It supports importing bank statements via CSV. The application shall be as simple as possible, automating repetative tasks (such as expense categorization, monitoring budgets, etc.)

Key Features:
1. Transaction Management - Track income/expenses with categorization, for multiple accounts
2. CSV Import - Import bank statements in CSV format with duplicate detection
3. Budget Tracking - Set monthly/yearly budgets by category
4. Track savings - Set saving goals and track progress
5. Docker Support - Deploy locally or on Synology NAS

Technical Requirements:
- Language: Python
- UI: Material, desktop + mobile support
- Database: PostgreSQL
- DevOps: Docker, docker-compose, GitHub Action
- Minimum: 4GB RAM (for Docker deployment)

Deployment Options:
1. Docker (recommended for easiest setup)
2. Local development (Node.js + PostgreSQL)
3. Synology NAS deployment

Development WoW:
- OpenSpec based: propose, apply, archive
- Specs to formalize: requirements, architecture, design, data model
- Maintain architectural consistency, follow best practices for web-based Python application architectures.
- Validation with unit tests and integration tests

The application provides a complete financial management solution with RESTful API endpoints for transactions, budgets, categories, imports, exports, and reports.