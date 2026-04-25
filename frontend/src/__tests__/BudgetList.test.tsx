import React from 'react';
import { render, screen } from '@testing-library/react';
import { BudgetList } from '../components/BudgetList';

describe('BudgetList', () => {
  it('renders without crashing', () => {
    render(<BudgetList onEdit={() => {}} />);
  });

  it('displays empty state message', async () => {
    render(<BudgetList onEdit={() => {}} />);
    expect(screen.getByText(/no budgets/i)).toBeInTheDocument();
  });
});