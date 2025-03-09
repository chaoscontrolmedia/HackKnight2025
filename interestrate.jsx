import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Button, Typography, Box } from '@mui/material';

// Storing the data directly as a constant
const stateData = {
    "Alabama": {"15": 5.22, "20": 6.88, "30": 6.19},
    "Alaska": {"15": 5.10, "20": 6.75, "30": 6.05},
    "Arizona": {"15": 5.30, "20": 6.95, "30": 6.25},
    "Arkansas": {"15": 5.18, "20": 6.80, "30": 6.15},
    "California": {"15": 5.40, "20": 7.00, "30": 6.30},
    "Colorado": {"15": 5.28, "20": 6.90, "30": 6.20},
    "Connecticut": {"15": 5.35, "20": 6.98, "30": 6.29},
    "Delaware": {"15": 5.25, "20": 6.85, "30": 6.18},
    "Florida": {"15": 5.33, "20": 6.95, "30": 6.27},
    "Georgia": {"15": 5.27, "20": 6.89, "30": 6.22},
    "Hawaii": {"15": 5.45, "20": 7.10, "30": 6.35},
    "Idaho": {"15": 5.32, "20": 6.92, "30": 6.24},
    "Illinois": {"15": 5.29, "20": 6.88, "30": 6.21},
    "Indiana": {"15": 5.21, "20": 6.79, "30": 6.12},
    "Iowa": {"15": 5.20, "20": 6.78, "30": 6.11},
    "Kansas": {"15": 5.23, "20": 6.83, "30": 6.17},
    "Kentucky": {"15": 5.19, "20": 6.80, "30": 6.14},
    "Louisiana": {"15": 5.26, "20": 6.87, "30": 6.20},
    "Maine": {"15": 5.34, "20": 6.97, "30": 6.28},
    "Maryland": {"15": 5.31, "20": 6.93, "30": 6.26},
    "Massachusetts": {"15": 5.36, "20": 6.99, "30": 6.30},
    "Michigan": {"15": 5.24, "20": 6.86, "30": 6.19},
    "Minnesota": {"15": 5.30, "20": 6.91, "30": 6.23},
    "Mississippi": {"15": 5.22, "20": 6.82, "30": 6.15},
    "Missouri": {"15": 5.28, "20": 6.89, "30": 6.22},
    "Montana": {"15": 5.34, "20": 6.95, "30": 6.28},
    "Nebraska": {"15": 5.27, "20": 6.88, "30": 6.21},
    "Nevada": {"15": 5.32, "20": 6.92, "30": 6.24},
    "New Hampshire": {"15": 5.35, "20": 6.98, "30": 6.29},
    "New Jersey": {"15": 5.37, "20": 7.00, "30": 6.31},
    "New Mexico": {"15": 5.28, "20": 6.90, "30": 6.22},
    "New York": {"15": 5.40, "20": 7.05, "30": 6.35},
    "North Carolina": {"15": 5.30, "20": 6.90, "30": 6.25},
    "North Dakota": {"15": 5.25, "20": 6.85, "30": 6.20},
    "Ohio": {"15": 5.29, "20": 6.89, "30": 6.23},
    "Oklahoma": {"15": 5.27, "20": 6.86, "30": 6.18},
    "Oregon": {"15": 5.31, "20": 6.94, "30": 6.28},
    "Pennsylvania": {"15": 5.34, "20": 6.97, "30": 6.29},
    "Rhode Island": {"15": 5.38, "20": 7.02, "30": 6.32},
    "South Carolina": {"15": 5.29, "20": 6.88, "30": 6.22},
    "South Dakota": {"15": 5.26, "20": 6.87, "30": 6.21},
    "Tennessee": {"15": 5.30, "20": 6.91, "30": 6.24},
    "Texas": {"15": 5.32, "20": 6.93, "30": 6.26},
    "Utah": {"15": 5.35, "20": 6.98, "30": 6.30},
    "Vermont": {"15": 5.39, "20": 7.04, "30": 6.33},
    "Virginia": {"15": 5.33, "20": 6.96, "30": 6.27},
    "Washington": {"15": 5.37, "20": 7.00, "30": 6.31},
    "West Virginia": {"15": 5.28, "20": 6.90, "30": 6.22},
    "Wisconsin": {"15": 5.30, "20": 6.91, "30": 6.23},
    "Wyoming": {"15": 5.32, "20": 6.92, "30": 6.24}
};

function InterestRate({ onInterestRateChange, onLoanTermChange }) {
  const [stateName, setStateName] = useState('');
  const [year, setYear] = useState('20');
  const [interestRate, setInterestRate] = useState(null);

  const handleStateChange = (e) => {
      setStateName(e.target.value);
  };

  const handleYearChange = (e) => {
      const selectedYear = e.target.value;
      setYear(selectedYear);
      onLoanTermChange(selectedYear); // Pass the selected loan term to the parent component
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (stateName && stateData[stateName]) {
          const rate = stateData[stateName][year] || 'N/A';
          setInterestRate(rate);
          onInterestRateChange(rate); // Pass the interest rate to the parent component
      } else {
          setInterestRate(null);
      }
  };

  return (
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'lightgray' }}>
          <Typography variant="h4" gutterBottom>
              Select State and Year
          </Typography>
          <form onSubmit={handleSubmit}>
              {/* State Selection */}
              <FormControl fullWidth sx={{ marginBottom: 3 }}>
                  <InputLabel>Select a State</InputLabel>
                  <Select value={stateName} onChange={handleStateChange} displayEmpty>
                      <MenuItem value="" disabled>Select a state</MenuItem>
                      {Object.keys(stateData).map((state) => (
                          <MenuItem key={state} value={state}>{state}</MenuItem>
                      ))}
                  </Select>
              </FormControl>

              {/* Year Selection */}
              <FormControl component="fieldset" fullWidth sx={{ marginBottom: 3 }}>
                  <Typography variant="h6">Select a Year</Typography>
                  <RadioGroup value={year} onChange={handleYearChange} row>
                      <FormControlLabel value="15" control={<Radio />} label="15 years" />
                      <FormControlLabel value="20" control={<Radio />} label="20 years" />
                      <FormControlLabel value="30" control={<Radio />} label="30 years" />
                  </RadioGroup>
              </FormControl>

              {/* Submit Button */}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
              </Button>
          </form>

          {/* Display the result */}
          {interestRate !== null && (
              <Box sx={{ marginTop: 3, padding: 2, borderRadius: 1, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                  <Typography variant="h6">Interest Rate: {interestRate}%</Typography>
              </Box>
          )}
      </Box>
  );
}

export default InterestRate;