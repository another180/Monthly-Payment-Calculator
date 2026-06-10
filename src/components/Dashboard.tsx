interface DashboardProps {
  currentMonth: string;
  totalDue: number;
  totalPaid: number;
  totalRemaining: number;
  nextDue: { name: string; amount: number; dueDate: string } | undefined;
  formatCurrency: (value: number) => string;
}

export default function Dashboard({
  totalDue,
  totalPaid,
  totalRemaining,
  nextDue,
  formatCurrency,
}: DashboardProps) {
  return (
    <section className="section">
      <h2>Dashboard</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total due</h3>
          <p>{formatCurrency(totalDue)}</p>
        </div>
        <div className="summary-card">
          <h3>Total paid</h3>
          <p>{formatCurrency(totalPaid)}</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p>{formatCurrency(totalRemaining)}</p>
        </div>
      </div>
      <div className="next-due-card">
        <h3>Next due</h3>
        {nextDue ? (
          <div>
            <p>{nextDue.name}</p>
            <p>{formatCurrency(nextDue.amount)}</p>
            <p>{nextDue.dueDate}</p>
          </div>
        ) : (
          <p>All current items are paid or no items added yet.</p>
        )}
      </div>
    </section>
  );
}
