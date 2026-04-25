import React from 'react';
import { render, screen } from '@testing-library/react';
import { CSVImport } from '../components/CSVImport';

describe('CSVImport', () => {
  it('renders file upload button', () => {
    render(<CSVImport />);
    expect(screen.getByText(/select csv file/i)).toBeInTheDocument();
  });
});