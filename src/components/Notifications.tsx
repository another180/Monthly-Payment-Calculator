interface NotificationsProps {
  visibleReminders: Array<{ id: string; name: string; daysUntil: number; dueDate: string; amount: number }>;
  dismissNotification: (id: string) => void;
  formatCurrency: (value: number) => string;
}

export default function Notifications({
  visibleReminders,
  dismissNotification,
  formatCurrency,
}: NotificationsProps) {
  if (visibleReminders.length === 0) {
    return (
      <div className="notifications-panel">
        <p>No active notifications.</p>
      </div>
    );
  }

  return (
    <div className="notifications-section">
      <h2>Notifications</h2>
      {visibleReminders.length > 0 && (
        <div className="alert-banner">
          <strong>{visibleReminders.length} payment{visibleReminders.length === 1 ? '' : 's'} due soon:</strong>{' '}
          {visibleReminders.map((item) => `${item.name} in ${item.daysUntil} day${item.daysUntil === 1 ? '' : 's'}`).join(', ')}.
        </div>
      )}
      <div className="notifications-panel">
        {visibleReminders.map((item) => (
          <div key={item.id} className="notifications-item">
            <div>
              <p><strong>{item.name}</strong> is due in {item.daysUntil} day{item.daysUntil === 1 ? '' : 's'}.</p>
              <p>{formatCurrency(item.amount)} due {item.dueDate}</p>
            </div>
            <button className="secondary-button" onClick={() => dismissNotification(item.id)}>
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
