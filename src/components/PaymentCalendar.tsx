interface PaymentCalendarProps {
  calendarDates: Array<{ day: number | null; date: string | null; payments: any[] }>;
  monthLabel: string;
  currentMonth: string;
  paidIds: Set<string>;
  handleMarkPaid: (itemId: string, type: 'Loan' | 'Bill', amount: number) => void;
  formatCurrency: (value: number) => string;
}

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PaymentCalendar({
  calendarDates,
  monthLabel,
  paidIds,
  handleMarkPaid,
  formatCurrency,
}: PaymentCalendarProps) {
  return (
    <section className="section calendar-section">
      <div className="calendar-header">
        <div>
          <h2>Payment calendar</h2>
          <p className="calendar-subtitle">Mark due items as paid from the calendar date where they appear.</p>
        </div>
        <div className="calendar-month-label">{monthLabel}</div>
      </div>
      
      <div className="calendar-weekdays">
        {dayHeaders.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDates.map((cell, index) => (
          <div key={`${cell.date}-${index}`} className={`calendar-cell ${!cell.day ? 'placeholder' : ''} ${cell.payments.length === 0 && cell.day ? 'empty' : ''}`}>
            {cell.day && (
              <>
                <div className="calendar-day-number">{cell.day}</div>
                {cell.payments.length === 0 ? (
                  <div className="calendar-empty">No due items</div>
                ) : (
                  <div className="calendar-payment-list">
                    {cell.payments.map((payment) => (
                      <div key={payment.id} className="calendar-payment-item">
                        <div className="calendar-payment-name">{payment.name}</div>
                        <span className={`status-badge ${paidIds.has(payment.id) ? 'paid' : 'pending'}`}>
                          {paidIds.has(payment.id) ? 'Paid' : 'Pending'}
                        </span>
                        {!paidIds.has(payment.id) && (
                          <button className="secondary-button calendar-mark-button" onClick={() => handleMarkPaid(payment.id, payment.type, payment.amount)}>
                            Mark paid
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
