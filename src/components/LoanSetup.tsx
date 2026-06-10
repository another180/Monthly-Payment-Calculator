import { LoanItem, TrackerData } from '../types';

interface LoanSetupProps {
  loanForm: LoanItem;
  setLoanForm: (form: LoanItem) => void;
  handleLoanSave: () => void;
  data: TrackerData;
  formatCurrency: (value: number) => string;
}

export default function LoanSetup({
  loanForm,
  setLoanForm,
  handleLoanSave,
  data,
  formatCurrency,
}: LoanSetupProps) {
  return (
    <section className="section">
      <h2>Loan setup</h2>
      {data.loan && (
        <div className="form-grid">
          <div className="summary-card">
            <h3>{data.loan.name}</h3>
            <p>Lender: {data.loan.lender}</p>
            <p>Monthly: {formatCurrency(data.loan.monthlyPayment)}</p>
            <p>Due day: {data.loan.dueDay}</p>
            <p>Balance: {formatCurrency(data.loan.remainingBalance)}</p>
          </div>
        </div>
      )}
      <div className="form-grid">
        <label htmlFor="loan-name-input">
          Loan name
        </label>
        <input
          id="loan-name-input"
          value={loanForm.name}
          onChange={(event) => setLoanForm({ ...loanForm, name: event.target.value })}
        />

        <label htmlFor="loan-lender-input">
          Lender
        </label>
        <input
          id="loan-lender-input"
          value={loanForm.lender}
          onChange={(event) => setLoanForm({ ...loanForm, lender: event.target.value })}
        />

        <label htmlFor="loan-monthly-payment-input">
          Monthly payment
        </label>
        <input
          id="loan-monthly-payment-input"
          type="number"
          value={loanForm.monthlyPayment}
          onChange={(event) => setLoanForm({ ...loanForm, monthlyPayment: Number(event.target.value) })}
        />

        <label htmlFor="loan-due-day-input">
          Due day
        </label>
        <input
          id="loan-due-day-input"
          type="number"
          min="1"
          max="31"
          value={loanForm.dueDay}
          onChange={(event) => setLoanForm({ ...loanForm, dueDay: Number(event.target.value) })}
        />

        <label htmlFor="loan-remaining-balance-input">
          Remaining balance
        </label>
        <input
          id="loan-remaining-balance-input"
          type="number"
          value={loanForm.remainingBalance}
          onChange={(event) => setLoanForm({ ...loanForm, remainingBalance: Number(event.target.value) })}
        />
      </div>
      <button className="primary-button" onClick={handleLoanSave}>Save loan</button>
    </section>
  );
}
