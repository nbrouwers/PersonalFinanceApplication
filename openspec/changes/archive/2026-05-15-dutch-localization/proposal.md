## Why

The application currently displays monetary values in a generic format and dates in ISO/US notation. Since the target user is Dutch, all financial values should display as euro (€) with Dutch formatting conventions, and dates should follow the Dutch dd-mm-yyyy format.

## What Changes

- Format all monetary values as euro (€) with Dutch locale formatting (e.g., € 1.234,56)
- Format all dates in Dutch notation (dd-mm-yyyy, e.g., 15-05-2026)
- Format all date/times in Dutch notation where applicable
- Apply formatting consistently across the frontend (dashboard, forms, lists)
- Apply formatting in the backend API responses where monetary values or dates are returned

## Capabilities

### New Capabilities
- `dutch-formatting`: Locale formatting utilities for euro currency and Dutch date notation, applied consistently across all frontend displays and backend API responses

### Modified Capabilities
<!-- No existing capabilities are being modified; this is a cross-cutting formatting change -->

## Impact

- Frontend: New `format.js` utility with euro and date formatting functions, imported across all components that display currency or dates
- Backend: No structural changes; formatting is primarily a frontend concern
- Ubiquitous language: Add Dutch locale formatting terms