interface PaymentStatusProps {
  currentPayments: Array<{ id: string; name: string; amount: number; dueDate: string; type: 'Loan' | 'Bill' }>;
  paidIds: Set<string>;
  reminderItemsById: Map<string, number>;
  handleMarkPaid: (itemId: string, type: 'Loan' | 'Bill', amount: number) => void;
  formatCurrency: (value: number) => string;
}

export default function PaymentStatus({
  currentPayments,
  paidIds,
  reminderItemsById,
  handleMarkPaid,
  formatCurrency,
}: PaymentStatusProps) {
  return (
    <section className="section">
      <h2>Payment status</h2>
      <div className="grid-list">
        {currentPayments.map((payment) => (
          <div key={payment.id} className="payment-item">
            <div>
              <strong>{payment.name}</strong>
              <p>{formatCurrency(payment.amount)}</p>
              <p>Due {payment.dueDate}</p>
            </div>
            <div>
              <span className={`status-badge ${paidIds.has(payment.id) ? 'paid' : 'pending'}`}>
                {paidIds.has(payment.id) ? 'Paid' : 'Pending'}
              </span>
              {!paidIds.has(payment.id) && reminderItemsById.has(payment.id) && (
                <span className="due-soon-badge">Due in {reminderItemsById.get(payment.id)} day{reminderItemsById.get(payment.id) === 1 ? '' : 's'}</span>
              )}
              {!paidIds.has(payment.id) && (
                <button className="secondary-button" onClick={() => handleMarkPaid(payment.id, payment.type, payment.amount)}>
                  Mark paid
                </button>
              )}
            </div>
          </div>
        ))}
        {currentPayments.length === 0 && <p>No loan or bill items yet. Add them in the menu to start tracking.</p>}
      </div>
    </section>
  );
}
