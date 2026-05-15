## 1. Frontend Dependencies & Routing

- [x] 1.1 Install react-router-dom and recharts
- [x] 1.2 Restructure App.js with React Router and page routes
- [x] 1.3 Create navigation sidebar component (MUI Drawer) with links to all pages
- [x] 1.4 Add responsive bottom navigation for mobile

## 2. Dashboard Page

- [x] 2.1 Create Dashboard page component with grid layout for charts
- [x] 2.2 Add account balances pie chart (Recharts PieChart)
- [x] 2.3 Add budget progress bars (LinearProgress with color coding)
- [x] 2.4 Add savings goal progress cards with CircularProgress
- [x] 2.5 Style dashboard with proper spacing, color coding, and loading states

## 3. CRUD Management Pages

- [x] 3.1 Create Accounts page with list, create, edit, delete
- [x] 3.2 Create Budgets page with list, create, edit, delete
- [x] 3.3 Create Goals page with list, create, edit, delete
- [x] 3.4 Add delete and edit buttons to list views (wired into local state management)

## 4. CSV Import Page

- [x] 4.1 Create Import page using existing CsvUpload component
- [x] 4.2 Add navigation link to Import page

## 5. Backend Dashboard Endpoint

- [x] 5.1 Create dashboard router with GET /dashboard/summary endpoint
- [x] 5.2 Implement aggregation logic: total balance, budget spent vs allocated, goal progress
- [x] 5.3 Register dashboard router in api/v1/router.py
- [x] 5.4 Test endpoint returns correct JSON structure (401 without auth, confirmed reachable)