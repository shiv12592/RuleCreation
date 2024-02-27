import React, { useState } from 'react';

const DatePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null); // Reset end date
    setError(''); // Clear any errors
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      setError('End date cannot be before start date.');
    } else {
      setEndDate(date);
      setError('');
    }
  };

  const convertToEpoch = (date) => {
    return date ? Math.floor(date.getTime() / 1000) : '';
  };

  return (
    <div>
      <input
        type="date"
        onChange={(e) => handleStartDateChange(new Date(e.target.value))}
      />
      <input
        type="date"
        onChange={(e) => handleEndDateChange(new Date(e.target.value))}
        disabled={!startDate}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        Start Date Epoch: {convertToEpoch(startDate)}
      </div>
      <div>
        End Date Epoch: {convertToEpoch(endDate)}
      </div>
    </div>
  );
};

export default DatePicker;
