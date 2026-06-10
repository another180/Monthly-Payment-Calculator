import { useEffect, useMemo, useState } from 'react';
import { BillItem, LoanItem, PaymentRecord, SettingForReminder, TrackerData } from './types';
import { loadData, saveData } from './storage';
import Dashboard from './components/Dashboard';
import PaymentCalendar from './components/PaymentCalendar';
import PaymentStatus from './components/PaymentStatus';
import LoanSetup from './components/LoanSetup';
import AddBill from './components/AddBill';
import History from './components/History';
import ReminderSettings from './components/ReminderSettings';
import Notifications from './components/Notifications';

const paymentFrequencies = ['Monthly', 'Quarterly', 'Annual'] as const;
const categories = ['Mortgage', 'Utilities', 'Insurance', 'Subscription', 'Other'] as const;
type MenuTab = 'dashboard' | 'calendar' | 'status' | 'loan' | 'bill' | 'history' | 'reminders';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentMonth() {
  return getMonthKey(new Date());
}

function getDaysUntil(dateString: string) {
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const millis = target.getTime() - today.getTime();
  return Math.ceil(millis / (1000 * 60 * 60 * 24));
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
}

function createMonthDate(year: number, month: number, day: number) {
  const days = getDaysInMonth(year, month);
  return new Date(year, month, Math.min(day, days));
}

function getMonthDueDateString(year: number, month: number, day: number) {
  const dueDate = createMonthDate(year, month, day);
  return `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
}

function getBillDueDateForMonth(bill: BillItem, monthKey: string) {
  const originalDate = new Date(bill.dueDate);
  if (Number.isNaN(originalDate.getTime())) return null;

  const [yearStr, monthStr] = monthKey.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const originalMonth = originalDate.getMonth();
  const originalDay = originalDate.getDate();
  const monthDiff = (year - originalDate.getFullYear()) * 12 + (month - originalMonth);

  if (bill.frequency === 'Monthly') {
    return getMonthDueDateString(year, month, originalDay);
  }

  if (bill.frequency === 'Quarterly') {
    if (monthDiff >= 0 && monthDiff % 3 === 0) {
      return getMonthDueDateString(year, month, originalDay);
    }
    return null;
  }

  if (bill.frequency === 'Annual') {
    return month === originalMonth ? getMonthDueDateString(year, month, originalDay) : null;
  }

  return null;
}

export default function App() {
  const [data, setData] = useState<TrackerData>(() => loadData());
  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const [dismissedReminderIds, setDismissedReminderIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<MenuTab>('dashboard');
  const [loanForm, setLoanForm] = useState<LoanItem>({
    id: createId(),
    name: '',
    lender: '',
    monthlyPayment: 0,
    dueDay: 1,
    remainingBalance: 0,
  });
  const [billForm, setBillForm] = useState<BillItem>({
    id: createId(),
    name: '',
    amount: 0,
    dueDate: new Date().toISOString().slice(0, 10),
    frequency: 'Monthly',
    category: 'Utilities',
    active: true,
  });

  const reminderSettings: SettingForReminder = data.settings;

  useEffect(() => {
    saveData(data);
  }, [data]);

  const currentMonth = getCurrentMonth();

  const currentPayments = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    const loanItem = data.loan
      ? [
          {
            id: data.loan.id,
            name: data.loan.name,
            amount: data.loan.monthlyPayment,
            dueDate: getMonthDueDateString(currentYear, currentMonthIndex, data.loan.dueDay),
            type: 'Loan' as const,
          },
        ]
      : [];

    const billItems = data.bills.reduce((items, bill) => {
      if (!bill.active) return items;
      const dueDate = getBillDueDateForMonth(bill, currentMonth);
      if (!dueDate) return items;
      return [
        ...items,
        {
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          dueDate,
          type: 'Bill' as const,
        },
      ];
    }, [] as Array<{ id: string; name: string; amount: number; dueDate: string; type: 'Bill' }>);

    return [...loanItem, ...billItems];
  }, [data, currentMonth]);

  const paidIds = useMemo(() => new Set(data.records.filter((record) => record.month === currentMonth).map((record) => record.itemId)), [data.records, currentMonth]);

  const totalDue = currentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = currentPayments.filter((payment) => paidIds.has(payment.id)).reduce((sum, payment) => sum + payment.amount, 0);
  const totalRemaining = totalDue - totalPaid;
  const monthLabel = getMonthLabel(currentMonth);

  const paymentsByDate = useMemo(() => {
    return currentPayments.reduce((map, payment) => {
      const items = map.get(payment.dueDate) ?? [];
      map.set(payment.dueDate, [...items, payment]);
      return map;
    }, new Map<string, typeof currentPayments>());
  }, [currentPayments]);

  const calendarDates = useMemo(() => {
    const [yearStr, monthStr] = currentMonth.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const dates: Array<{ day: number | null; date: string | null; payments: typeof currentPayments }> = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push({ day: null, date: null, payments: [] });
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = `${currentMonth}-${String(day).padStart(2, '0')}`;
      dates.push({
        day,
        date,
        payments: paymentsByDate.get(date) ?? [],
      });
    }

    return dates;
  }, [currentMonth, paymentsByDate]);

  const nextDue = useMemo(() => {
    return currentPayments
      .filter((payment) => !paidIds.has(payment.id))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  }, [currentPayments, paidIds]);

  const upcomingReminders = useMemo(() => {
    if (!reminderSettings.enabled) return [];
    return currentPayments
      .filter((payment) => !paidIds.has(payment.id))
      .map((payment) => ({
        ...payment,
        daysUntil: getDaysUntil(payment.dueDate),
      }))
      .filter((payment) => payment.daysUntil >= 0 && payment.daysUntil <= reminderSettings.leadDays)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [currentPayments, paidIds, reminderSettings]);

  const reminderItemsById = useMemo(() => new Map(upcomingReminders.map((item) => [item.id, item.daysUntil])), [upcomingReminders]);

  const visibleReminders = useMemo(
    () => upcomingReminders.filter((item) => !dismissedReminderIds.includes(item.id)),
    [upcomingReminders, dismissedReminderIds],
  );

  const dismissNotification = (id: string) => {
    setDismissedReminderIds((current) => [...current, id]);
  };

  useEffect(() => {
    if (!window.Notification) return;
    if (visibleReminders.length === 0) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationGranted(true);
          new Notification('Payment reminder enabled', {
            body: `${visibleReminders.length} payment${visibleReminders.length === 1 ? '' : 's'} due within ${reminderSettings.leadDays} days.`,
          });
        }
      });
    } else if (Notification.permission === 'granted') {
      setNotificationGranted(true);
      new Notification('Upcoming payments due', {
        body: `${visibleReminders.length} payment${visibleReminders.length === 1 ? '' : 's'} due within ${reminderSettings.leadDays} days.`,
      });
    }
  }, [visibleReminders, reminderSettings.leadDays]);

  const historyByMonth = useMemo(() => {
    const grouped: Record<string, { totalPaid: number; items: PaymentRecord[] }> = {};
    data.records.forEach((record) => {
      grouped[record.month] ??= { totalPaid: 0, items: [] };
      grouped[record.month].items.push(record);
      grouped[record.month].totalPaid += record.paidAmount;
    });
    return grouped;
  }, [data.records]);

  const handleLoanSave = () => {
    setData((current) => ({ ...current, loan: loanForm }));
    setLoanForm((prev) => ({ ...prev, id: createId() }));
  };

  const handleBillSave = () => {
    setData((current) => ({ ...current, bills: [...current.bills, billForm] }));
    setBillForm({
      id: createId(),
      name: '',
      amount: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      frequency: 'Monthly',
      category: 'Utilities',
      active: true,
    });
  };

  const handleReminderSettingsChange = (nextSettings: Partial<SettingForReminder>) => {
    setData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        ...nextSettings,
      },
    }));
  };

  const handleMarkPaid = (itemId: string, type: 'Loan' | 'Bill', amount: number) => {
    const record: PaymentRecord = {
      id: createId(),
      itemId,
      type,
      paidAmount: amount,
      paidDate: new Date().toISOString().slice(0, 10),
      month: currentMonth,
    };
    setData((current) => ({ ...current, records: [...current.records, record] }));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>💰 Payment Tracker</h1>
        <div className="app-header-spacer"></div>
      </header>

      <div className="app-main">
        <aside className="sidebar">
          <nav aria-label="Page navigation">
            <h2>Navigation</h2>
            <ul>
              <li><button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button></li>
              <li><button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>Calendar</button></li>
              <li><button onClick={() => setActiveTab('status')} className={activeTab === 'status' ? 'active' : ''}>Status</button></li>
              <li><button onClick={() => setActiveTab('loan')} className={activeTab === 'loan' ? 'active' : ''}>Loan</button></li>
              <li><button onClick={() => setActiveTab('bill')} className={activeTab === 'bill' ? 'active' : ''}>Bills</button></li>
              <li><button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>History</button></li>
              <li><button onClick={() => setActiveTab('reminders')} className={activeTab === 'reminders' ? 'active' : ''}>Reminders</button></li>
            </ul>
          </nav>

          <Notifications
            visibleReminders={visibleReminders}
            dismissNotification={dismissNotification}
            formatCurrency={formatCurrency}
          />
        </aside>

        <main className="content">
          <header className="hero">
            <h1>{activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'calendar' && 'Payment Calendar'}
                {activeTab === 'status' && 'Payment Status'}
                {activeTab === 'loan' && 'Loan Setup'}
                {activeTab === 'bill' && 'Add Bill'}
                {activeTab === 'history' && 'History'}
                {activeTab === 'reminders' && 'Reminder Settings'}</h1>
            <p>{activeTab === 'dashboard' && 'View your payment summary and upcoming items'}
               {activeTab === 'calendar' && 'Monthly calendar with payment details'}
               {activeTab === 'status' && 'Track all your payments and mark them complete'}
               {activeTab === 'loan' && 'Configure your loan details'}
               {activeTab === 'bill' && 'Add or manage your bills'}
               {activeTab === 'history' && 'View your payment history'}
               {activeTab === 'reminders' && 'Manage notification preferences'}</p>
          </header>

        {activeTab === 'dashboard' && (
          <Dashboard
            currentMonth={currentMonth}
            totalDue={totalDue}
            totalPaid={totalPaid}
            totalRemaining={totalRemaining}
            nextDue={nextDue}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'calendar' && (
          <PaymentCalendar
            calendarDates={calendarDates}
            monthLabel={monthLabel}
            currentMonth={currentMonth}
            paidIds={paidIds}
            handleMarkPaid={handleMarkPaid}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'status' && (
          <PaymentStatus
            currentPayments={currentPayments}
            paidIds={paidIds}
            reminderItemsById={reminderItemsById}
            handleMarkPaid={handleMarkPaid}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'loan' && (
          <LoanSetup
            loanForm={loanForm}
            setLoanForm={setLoanForm}
            handleLoanSave={handleLoanSave}
            data={data}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'bill' && (
          <AddBill
            billForm={billForm}
            setBillForm={setBillForm}
            handleBillSave={handleBillSave}
            paymentFrequencies={paymentFrequencies}
            categories={categories}
          />
        )}

        {activeTab === 'history' && (
          <History
            historyByMonth={historyByMonth}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderSettings
            reminderSettings={reminderSettings}
            upcomingReminders={upcomingReminders}
            handleReminderSettingsChange={handleReminderSettingsChange}
          />
        )}
      </main>
      </div>
    </div>
  );
}
