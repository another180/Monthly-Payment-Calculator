import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Monthly Payment Tracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lets the user create a loan, add a bill, and mute reminders', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/Payment Tracker/i)).toBeInTheDocument();

    // Click on Loan Setup tab
    const loanSetupButtons = screen.getAllByRole('button', { name: /Loan/i });
    await user.click(loanSetupButtons[0]);

    await user.type(screen.getByRole('textbox', { name: /Loan name/i }), 'Home loan');
    await user.type(screen.getByRole('spinbutton', { name: /Monthly payment/i }), '1800');
    await user.type(screen.getByRole('spinbutton', { name: /Due day/i }), '15');
    await user.type(screen.getByRole('spinbutton', { name: /Remaining balance/i }), '250000');

    const saveLoanButtons = screen.getAllByRole('button', { name: /Save loan/i });
    await user.click(saveLoanButtons[0]);

    // Click on Bills tab
    const billsButtons = screen.getAllByRole('button', { name: /Bills/i });
    await user.click(billsButtons[0]);

    const billNameInput = screen.getByRole('textbox', { name: /Bill name/i }) as HTMLInputElement;
    await user.type(billNameInput, 'Electricity');
    const billAmountInput = screen.getByRole('spinbutton', { name: /Amount/i }) as HTMLInputElement;
    await user.type(billAmountInput, '120');
    const billDueDateInput = screen.getByLabelText(/Due date/i) as HTMLInputElement;
    fireEvent.change(billDueDateInput, { target: { value: '2026-06-20' } });

    const addBillFormButtons = screen.getAllByRole('button', { name: /Add bill/i });
    await user.click(addBillFormButtons[addBillFormButtons.length - 1]);

    // Click on Reminders tab
    const reminderButtons = screen.getAllByRole('button', { name: /Reminders/i });
    await user.click(reminderButtons[0]);

    await user.click(screen.getByLabelText(/Mute reminders/i));
    expect(screen.getByText(/Reminders are muted/i)).toBeInTheDocument();
  });
});
