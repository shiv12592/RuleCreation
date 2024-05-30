import React, { Component } from 'react';

class YourComponent extends Component {
  state = {
    cancelRule: false,
    showPopup: false,
    pendingValues: null,
  };

  handleCancelForm = (values) => {
    this.setState({ showPopup: true, pendingValues: values });
  };

  handleProceed = async () => {
    this.setState({ showPopup: false }); // Hide popup before proceeding
    await this.setState({ cancelRule: true });
    await this.submitFormValues(this.state.pendingValues);
  };

  handleGoBack = () => {
    this.setState({ showPopup: false, pendingValues: null });
  };

  renderPopup() {
    return (
      <div className="popup">
        <p>Are you sure you want to proceed?</p>
        <button onClick={this.handleProceed}>Proceed</button>
        <button onClick={this.handleGoBack}>Go Back</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.showPopup && this.renderPopup()}
        {/* Rest of your component's render logic */}
      </div>
    );
  }
}

export default YourComponent;



.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popup button {
  margin: 5px;
}
