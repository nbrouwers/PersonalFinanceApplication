import React from 'react';
import { formatEuro } from '../utils/format';

const BudgetAlert = ({ budget }) => {
  const { name, amount, spent, remaining, percentage_used } = budget;

  let alertClass = 'info';
  let alertMessage = '';

  if (percentage_used >= 100) {
    alertClass = 'error';
    alertMessage = `Over budget by ${formatEuro(Math.abs(remaining))}`;
  } else if (percentage_used >= 90) {
    alertClass = 'warning';
    alertMessage = `Almost at limit: ${formatEuro(remaining)} remaining`;
  } else if (percentage_used >= 75) {
    alertClass = 'warning';
    alertMessage = `${percentage_used.toFixed(0)}% used`;
  } else {
    alertClass = 'success';
    alertMessage = `${formatEuro(remaining)} remaining`;
  }

  return (
    <div className={`budget-alert alert-${alertClass}`}>
      <h4>{name}</h4>
      <p>
        Budget: {formatEuro(amount)} | 
        Spent: {formatEuro(spent)} | 
        {alertMessage}
      </p>
      <div className="budget-progress">
        <div className="progress-bar" style={{ width: `${Math.min(percentage_used, 100)}%` }} />
      </div>
    </div>
  );
};

export default BudgetAlert;