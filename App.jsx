import React, { useState } from 'react';
import './App.css';
import InterestRate from './interestrate.jsx';
import Calculation from './calculation.jsx';

function App() {
    const [interestRate, setInterestRate] = useState(null);
    const [loanTermYears, setLoanTermYears] = useState('20'); // Default to 20 years

    // Callback function to handle interest rate changes from the InterestRate component
    const handleInterestRateChange = (rate) => {
        setInterestRate(rate);
    };

    // Callback function to handle loan term changes from the InterestRate component
    const handleLoanTermChange = (term) => {
        setLoanTermYears(term);
    };

    return (
        <div className="App">
            {/* Render the InterestRate component and pass the callback functions */}
            <InterestRate
                onInterestRateChange={handleInterestRateChange}
                onLoanTermChange={handleLoanTermChange}
            />

            {/* Render the Calculation component and pass the selected interest rate and loan term as props */}
            {interestRate !== null && (
                <Calculation
                    annualRate={interestRate}
                    loanTermYears={loanTermYears}
                />
            )}
        </div>
    );
}

export default App;