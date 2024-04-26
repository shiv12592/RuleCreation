import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class EditRulePlain extends Component {
  static propTypes = {
    ruleDetails: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  state = {
    ruleDescription: '',
    errorMessage: null,
    newCategory: '',
    newCarId: '',
    newRuleOwner: '',
    requestData: [],
    startDate: null,
    endDate: null,
    startDateOnly: null,
    endDateOnly: null,
  };

  componentDidMount() {
    const { ruleDetails } = this.props;
    const ruleCategory = ruleDetails.category;
    const carId = ruleDetails.carId;
    const ruleOwner = ruleDetails.owner;
    const startTime = new Date(ruleDetails.startTime * 1000);
    const endTime = new Date(ruleDetails.endTime * 1000);
    const startDateOnly = `${startTime.getFullYear()}-${(startTime.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${startTime.getDate().toString().padStart(2, '0')}`;
    const endDateOnly = `${endTime.getFullYear()}-${(endTime.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${endTime.getDate().toString().padStart(2, '0')}`;

    this.setState({
      newCategory: ruleCategory,
      newCarId: carId,
      newRuleOwner: ruleOwner,
      requestData: ruleDetails.requestData,
      startDate: startTime,
      endDate: endTime,
      startDateOnly,
      endDateOnly,
    });
  }

  handleDateChange = (date, isStartDate) => {
    const currentDate = new Date();
    const selectedDateWithTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentDate.getHours(),
      currentDate.getMinutes(),
      currentDate.getSeconds()
    );

    const selectedDateOnly = `${selectedDateWithTime.getFullYear()}-${(selectedDateWithTime.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${selectedDateWithTime.getDate().toString().padStart(2, '0')}`;

    if (isStartDate) {
      if (this.state.endDate && selectedDateOnly > this.state.endDateOnly) {
        this.setState({ errorMessage: 'Start date cannot be after end date.' });
      } else {
        const startDateEpoch = Math.floor(selectedDateWithTime.getTime() / 1000);
        this.setState({
          startDate: startDateEpoch,
          startDateOnly: selectedDateOnly,
          errorMessage: null,
        });
      }
    } else {
      const endDateOnly = `${this.state.endDate.getFullYear()}-${(this.state.endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${this.state.endDate.getDate().toString().padStart(2, '0')}`;

      if (selectedDateOnly < this.state.startDateOnly) {
        this.setState({ errorMessage: 'End date cannot be before start date.', endDate: null });
      } else {
        const endDateEpoch = Math.floor(selectedDateWithTime.getTime() / 1000);
        this.setState({
          endDate: endDateEpoch,
          endDateOnly: selectedDateOnly,
          errorMessage: null,
        });
      }
    }
  };

  render() {
    // ... rest of your component
    return (
      <div>
        {/* ... other parts of your component */}
        <input
          type="date"
          min={(new Date()).toISOString().split('T')[0]} // Set min to today's date
          max="2100-12-31" // Set max date
          value={this.state.startDateOnly || ''}
          onChange={(e) => {
            const date = new Date(e.target.value);
            this.handleDateChange(date, true);
          }}
        />
        <input
          type="date"
          min={(new Date()).toISOString().split('T')[0]} // Set min to today's date
          max="2100-12-31" // Set max date
          value={this.state.endDateOnly || ''}
          onChange={(e) => {
            const date = new Date(e.target.value);
            this.handleDateChange(date, false);
          }}
          disabled={!this.state.startDate}
        />
        {this.state.errorMessage && <div style={{ color: 'red' }}>{this.state.errorMessage}</div>}
        <div>Start Date Epoch: {this.state.startDate}</div>
        <div>End Date Epoch: {this.state.endDate}</div>
        {/* ... other parts of your component */}
      </div>
    );
  }
}

export const EditRule = reduxForm(formOptions)(EditRulePlain);
