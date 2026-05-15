import React from 'react';

const BudgetAlert = ({ budget }) => {
  const { name, amount, spent, remaining, percentage_used } = budget;
  
  // Determine alert level based on percentage used
  let alertClass = 'info';
  let alertMessage = '';
  
  if (percentage_used >= 100) {
    alertClass = 'error';
    alertMessage = `Over budget by $${Math.abs(remaining).toFixed(2)}`;
  } else if (percentage_used >= 90) {
    alertClass = 'warning';
    alertMessage = `Almost at limit: $${remaining.toFixed(2)} remaining`;
  } else if (percentage_used >= 75) {
    alertClass = 'warning';
    alertMessage = `${percentage_used.toFixed(0)}% used`;
  } else {
    alertClass = 'success';
    alertMessage = `$${remaining.toFixed(2)} remaining`;
  }
  
  return (
    <div className={`budget-alert alert-${alertClass}`}>
      <h4>{name}</h4>
      <p>
        Budget: ${amount.toFixed(2)} | 
        Spent: ${spent.toFixed(2)} | 
        {alertMessage}
      </p>
      <div className="budget-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${Math.min(percentage_used, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetAlert;