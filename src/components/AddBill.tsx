import { BillItem } from '../types';

interface AddBillProps {
  billForm: BillItem;
  setBillForm: (form: BillItem) => void;
  handleBillSave: () => void;
  paymentFrequencies: readonly string[];
  categories: readonly string[];
}

export default function AddBill({
  billForm,
  setBillForm,
  handleBillSave,
  paymentFrequencies,
  categories,
}: AddBillProps) {
  return (
    <section className="section">
      <h2>Add a bill</h2>
      <div className="form-grid">
        <label htmlFor="bill-name-input">
          Bill name
        </label>
        <input
          id="bill-name-input"
          value={billForm.name}
          onChange={(event) => setBillForm({ ...billForm, name: event.target.value })}
        />

        <label htmlFor="bill-amount-input">
          Amount
        </label>
        <input
          id="bill-amount-input"
          type="number"
          value={billForm.amount}
          onChange={(event) => setBillForm({ ...billForm, amount: Number(event.target.value) })}
        />

        <label htmlFor="bill-due-date-input">
          Due date
        </label>
        <input
          id="bill-due-date-input"
          type="date"
          value={billForm.dueDate}
          onChange={(event) => setBillForm({ ...billForm, dueDate: event.target.value })}
        />

        <label htmlFor="bill-frequency-input">
          Frequency
        </label>
        <select
          id="bill-frequency-input"
          value={billForm.frequency}
          onChange={(event) => setBillForm({ ...billForm, frequency: event.target.value as typeof billForm.frequency })}
        >
          {paymentFrequencies.map((frequency) => (
            <option key={frequency} value={frequency}>{frequency}</option>
          ))}
        </select>

        <label htmlFor="bill-category-input">
          Category
        </label>
        <select
          id="bill-category-input"
          value={billForm.category}
          onChange={(event) => setBillForm({ ...billForm, category: event.target.value as typeof billForm.category })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <button className="primary-button" onClick={handleBillSave}>Add bill</button>
    </section>
  );
}
