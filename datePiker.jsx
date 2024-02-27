import React, { useState } from 'react';

const DatePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');

  const handleDateChange = (date, setDate) => {
    const currentDate = new Date();
    const selectedDateWithTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );
    setDate(selectedDateWithTime);
    setError('');
  };

  const convertToEpoch = (date) => {
    return date ? Math.floor(date.getTime() / 1000) : '';
  };

  return (
    <div>
      <input
        type="date"
        onChange={(e) => {
          const date = new Date(e.target.value);
          if (!startDate || date >= startDate) {
            handleDateChange(date, setStartDate);
          }
        }}
      />
      <input
        type="date"
        onChange={(e) => {
          const date = new Date(e.target.value);
          if (startDate && date < startDate) {
            setError('End date cannot be before start date.');
          } else {
            handleDateChange(date, setEndDate);
          }
        }}
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
