import React, { useState } from 'react';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

class Mortgage {
  constructor(loanPrincipal, annualRate, loanTermYears) {
    this.loanPrincipal = loanPrincipal;
    this.annualRate = annualRate;
    this.loanTermYears = loanTermYears;
  }
}

class MortgageCalculations {
  customPow(base, exponent) {
    let result = 1;
    for (let i = 1; i <= exponent; i++) {
      result *= base;
    }
    return result;
  }

  totalPayments(mortgage) {
    return mortgage.loanTermYears * 12;
  }

  monthlyInterestRate(mortgage) {
    return mortgage.annualRate / 12 / 100;
  }

  monthlyPayment(mortgage) {
    const p = mortgage.loanPrincipal;
    const r = this.monthlyInterestRate(mortgage);
    const n = this.totalPayments(mortgage);
    const y = this.customPow(1 + r, n);
    const mp = (p * r * y) / (y - 1);
    return mp;
  }

  generateAmortizationSchedule(mortgage) {
    const monthlyPayment = this.monthlyPayment(mortgage);
    const schedule = [];
    let remainingBalance = mortgage.loanPrincipal;

    for (let i = 1; i <= this.totalPayments(mortgage); i++) {
      const interestPaid = remainingBalance * this.monthlyInterestRate(mortgage);
      const principalPaid = monthlyPayment - interestPaid;
      remainingBalance -= principalPaid;

      schedule.push({
        paymentNumber: i,
        principalPaid: principalPaid.toFixed(2),
        interestPaid: interestPaid.toFixed(2),
        remainingBalance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
      });
    }

    return schedule;
  }
}

function Calculation({ annualRate, loanTermYears }) {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const chartRef = React.useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers
    const value = parseFloat(propertyValue);
    const down = parseFloat(downPayment);

    // Validate Down Payment (must be at least 10% of property value)
    if (down < value * 0.1) {
      setError('The minimum down payment must be at least 10% of the property value.');
      return; // Stop further execution
    }
    if (down > value) {
      setError('The Down-payment is more than enough. You can afford the property!');
      return;
    }

    // Clear any previous errors
    setError('');

    // Calculate Loan Principal
    const loanPrincipal = value - down;

    // Create Mortgage object
    const mortgage = new Mortgage(
      loanPrincipal,
      parseFloat(annualRate), // Use the annualRate from props
      parseFloat(loanTermYears) // Use the loanTermYears from props
    );

    // Perform calculations
    const calculations = new MortgageCalculations();
    const monthlyPayment = calculations.monthlyPayment(mortgage);
    const schedule = calculations.generateAmortizationSchedule(mortgage);

    // Set results
    setResults({
      monthlyPayment,
    });
    setAmortizationSchedule(schedule);
    updateChart(schedule);
  };

  const updateChart = (schedule) => {
    const ctx = chartRef.current.getContext('2d');

    // Aggregate data annually
    const yearlyData = [];
    for (let year = 1; year <= loanTermYears; year++) {
      const startMonth = (year - 1) * 12;
      const endMonth = year * 12;
      const yearlyPrincipal = schedule
        .slice(startMonth, endMonth)
        .reduce((sum, entry) => sum + parseFloat(entry.principalPaid), 0);
      const yearlyInterest = schedule
        .slice(startMonth, endMonth)
        .reduce((sum, entry) => sum + parseFloat(entry.interestPaid), 0);
      yearlyData.push({
        year,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
      });
    }

    // Limit chart to first 10 years for readability
    const chartData = yearlyData.slice(0, 10);

    if (window.myChart) {
      window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.map((entry) => `Year ${entry.year}`),
        datasets: [
          {
            label: 'Principal Paid',
            data: chartData.map((entry) => entry.principalPaid),
            backgroundColor: '#004687',
          },
          {
            label: 'Interest Paid',
            data: chartData.map((entry) => entry.interestPaid),
            backgroundColor: '#ff6a6a',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Payment #', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
      body: amortizationSchedule.map((entry) => [
        entry.paymentNumber,
        entry.principalPaid,
        entry.interestPaid,
        entry.remainingBalance,
      ]),
    });
    doc.save('mortgage_schedule.pdf');
  };

  const exportCSV = () => {
    const csvContent =
      'Payment #,Principal Paid,Interest Paid,Remaining Balance\n' +
      amortizationSchedule
        .map((entry) =>
          [entry.paymentNumber, entry.principalPaid, entry.interestPaid, entry.remainingBalance].join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Mortgage Calculator</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Property Value:
          <input
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            placeholder="Enter property value"
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Down Payment:
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="Enter down payment"
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>
          Calculate
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>

      {results && (
        <div>
          <h3 style={styles.subHeading}>Results:</h3>
          <p>Monthly Payment: ${results.monthlyPayment.toFixed(2)}</p>
        </div>
      )}

      <div style={styles.chartContainer}>
        <canvas ref={chartRef}></canvas>
      </div>

      <h2 style={styles.subHeading}>Amortization Schedule</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Principal Paid</th>
            <th>Interest Paid</th>
            <th>Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {amortizationSchedule.map((entry) => (
            <tr key={entry.paymentNumber}>
              <td>{entry.paymentNumber}</td>
              <td>${entry.principalPaid}</td>
              <td>${entry.interestPaid}</td>
              <td>${entry.remainingBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.exportButtons}>
        <button onClick={exportPDF} style={styles.button}>
          Export as PDF
        </button>
        <button onClick={exportCSV} style={styles.button}>
          Export as CSV
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    color: '#004687',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    color: '#004687',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#ff6a6a',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: '#ff6a6a',
    fontSize: '0.875rem',
  },
  chartContainer: {
    margin: '2rem 0',
  },
  subHeading: {
    color: '#004687',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  exportButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
};

export default Calculation;