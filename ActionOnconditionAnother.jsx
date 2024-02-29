import React, { Component } from 'react';

class ActionOnCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionMetMessage: props.action.conditionMet.message,
      conditionNotMetMessage: props.action.conditionNotMet.message,
    };
    this.handleConditionMetClick = this.handleConditionMetClick.bind(this);
    this.handleConditionNotMetClick = this.handleConditionNotMetClick.bind(this);
    this.handleConditionMetChange = this.handleConditionMetChange.bind(this);
    this.handleConditionNotMetChange = this.handleConditionNotMetChange.bind(this);
  }

  handleConditionMetClick() {
    alert(this.state.conditionMetMessage);
  }

  handleConditionNotMetClick() {
    alert(this.state.conditionNotMetMessage);
  }

  handleConditionMetChange(e) {
    this.setState({ conditionMetMessage: e.target.value });
    this.props.onChange({ conditionMet: { message: e.target.value } });
  }

  handleConditionNotMetChange(e) {
    this.setState({ conditionNotMetMessage: e.target.value });
    this.props.onChange({ conditionNotMet: { message: e.target.value } });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <label>Condition Met</label>
          </div>
          <div className="col">
            <button onClick={this.handleConditionMetClick}>Message</button>
          </div>
          <div className="col">
            <input
              value={this.state.conditionMetMessage}
              onChange={this.handleConditionMetChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <label>Condition Not Met</label>
          </div>
          <div className="col">
            <button onClick={this.handleConditionNotMetClick}>Message</button>
          </div>
          <div className="col">
            <input
              value={this.state.conditionNotMetMessage}
              onChange={this.handleConditionNotMetChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ActionOnCondition;
----------------------------
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionOnCondition from './ActionOnCondition';

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
    action: [],
  };

  componentDidMount() {
    const { ruleDetails: ruleDetails, dispatchInitialize } = this.props;
    const ruleCategory = ruleDetails.category;
    const carId = ruleDetails.carId;
    const ruleOwner = ruleDetails.owner;
    this.setState({
      newCategory: ruleCategory,
      newCarId: carId,
      newRuleOwner: ruleOwner,
      requestData: ruleDetails.requestData,
      action: ruleDetails.action,
    });
  }

  handleActionData = (actionData) => {
    this.setState({ action: { ...this.state.action, ...actionData } });
  };

  render() {
    const { newCategory, newCarId, newRuleOwner } = this.state;
    return (
      <div>
        <Container className="col-md-12 pad-1 card-rounded margin-1-b">
          <Row>
            <ActionOnCondition
              onChange={this.handleActionData}
              action={this.state.action}
            />
          </Row>
        </Container>
      </div>
    );
  }
}

  
