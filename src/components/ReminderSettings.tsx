import { SettingForReminder as ReminderSettingsType } from '../types';

interface ReminderSettingsProps {
  reminderSettings: ReminderSettingsType;
  upcomingReminders: Array<{ id: string; name: string; daysUntil: number; dueDate: string; amount: number }>;
  handleReminderSettingsChange: (nextSettings: Partial<ReminderSettingsType>) => void;
}

export default function ReminderSettings({
  reminderSettings,
  upcomingReminders,
  handleReminderSettingsChange,
}: ReminderSettingsProps) {
  return (
    <section className="section">
      <h2>Reminder settings</h2>
      <div className="form-grid">
        <label htmlFor="mute-reminders-input">
          Mute reminders
        </label>
        <input
          id="mute-reminders-input"
          type="checkbox"
          checked={!reminderSettings.enabled}
          onChange={(event) => handleReminderSettingsChange({ enabled: !event.target.checked })}
        />
        <label htmlFor="reminder-lead-days-input">
          Lead days
        </label>
        <input
          id="reminder-lead-days-input"
          type="number"
          min="1"
          value={reminderSettings.leadDays}
          onChange={(event) => handleReminderSettingsChange({ leadDays: Number(event.target.value) })}
        />
      </div>
      {!reminderSettings.enabled ? (
        <p>Reminders are muted. No alerts or notifications will be generated.</p>
      ) : (
        <div className="reminders-card">
          <h3>Upcoming reminders</h3>
          {upcomingReminders.length > 0 ? (
            <ul>
              {upcomingReminders.map((item) => (
                <li key={item.id}>
                  {item.name} is due in {item.daysUntil} day{item.daysUntil === 1 ? '' : 's'} ({item.dueDate})
                </li>
              ))}
            </ul>
          ) : (
            <p>No items are due within the next {reminderSettings.leadDays} days.</p>
          )}
        </div>
      )}
    </section>
  );
}
