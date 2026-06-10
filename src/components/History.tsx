import { PaymentRecord } from '../types';

interface HistoryProps {
  historyByMonth: Record<string, { totalPaid: number; items: PaymentRecord[] }>;
  formatCurrency: (value: number) => string;
}

export default function History({ historyByMonth, formatCurrency }: HistoryProps) {
  return (
    <section className="section">
      <h2>History</h2>
      {Object.keys(historyByMonth).length === 0 ? (
        <p>No historical payments yet.</p>
      ) : (
        <div className="history-grid">
          {Object.entries(historyByMonth).map(([month, summary]) => (
            <div key={month} className="history-card">
              <h3>{month}</h3>
              <p>Total paid: {formatCurrency(summary.totalPaid)}</p>
              <ul>
                {summary.items.map((record) => (
                  <li key={record.id}>{record.type} paid {formatCurrency(record.paidAmount)} on {record.paidDate}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
