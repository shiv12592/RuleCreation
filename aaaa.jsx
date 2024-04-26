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
    startDateOnly: null, // Add startDateOnly state
    endDateOnly: null, // Add endDateOnly state
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
      .padStart(2, '0')}-${startTime.getDate().toString().padStart(2, '0')}`; // Extract year-mm-dd
    this.setState({
      newCategory: ruleCategory,
      newCarId: carId,
      newRuleOwner: ruleOwner,
      requestData: ruleDetails.requestData,
      startDate: startTime,
      endDate: endTime,
      startDateOnly, // Set startDateOnly state
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
      .padStart(2, '0')}-${selectedDateWithTime.getDate().toString().padStart(2, '0')}`; // Extract year-mm-dd

    if (isStartDate) {
      this.setState({ startDate: selectedDateWithTime, startDateOnly: selectedDateOnly, endDate: null });
    } else {
      if (selectedDateWithTime < this.state.startDate) {
        this.setState({ errorMessage: 'End date cannot be before start date.' });
      } else {
        this.setState({
          endDate: selectedDateWithTime,
          endDateOnly: selectedDateOnly,
          errorMessage: null,
        });
      }
    }
  };

  convertToEpoch = (date) => {
    return date ? Math.floor(date.getTime() / 1000) : '';
  };

  render() {
    // ... rest of your component
    return (
      <div>
        {/* ... other parts of your component */}
        <input
          type="date"
          value={this.state.startDateOnly || ''}
          onChange={(e) => {
            const date = new Date(e.target.value);
            this.handleDateChange(date, true);
          }}
        />
        <input
          type="date"
          value={this.state.endDateOnly || ''}
          onChange={(e) => {
            const date = new Date(e.target.value);
            this.handleDateChange(date, false);
          }}
          disabled={!this.state.startDate}
        />
        {this.state.errorMessage && <div style={{ color: 'red' }}>{this.state.errorMessage}</div>}
        <div>Start Date Epoch: {this.convertToEpoch(this.state.startDate)}</div>
        <div>End Date Epoch: {this.convertToEpoch(this.state.endDate)}</div>
        {/* ... other parts of your component */}
      </div>
    );
  }
}

export const EditRule = reduxForm(formOptions)(EditRulePlain);
