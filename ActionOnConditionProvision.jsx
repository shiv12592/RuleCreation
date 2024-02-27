import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ActionOnCondition = ({ action, onChange }) => {
  const [showInput, setShowInput] = useState({
    conditionMet: false,
    conditionNotMet: false,
    provision: action.provision.map(() => false),
  });

  const handleButtonClick = (condition, index) => {
    if (condition === 'conditionMet' || condition === 'conditionNotMet') {
      setShowInput(prevState => ({ ...prevState, [condition]: !prevState[condition] }));
    } else {
      setShowInput(prevState => ({
        ...prevState,
        provision: prevState.provision.map((value, i) => (i === index ? !value : value)),
      }));
    }
  };

  const handleInputChange = (condition, value, index) => {
    if (condition === 'conditionMet' || condition === 'conditionNotMet') {
      onChange({ ...action, [condition]: { message: value } });
    } else {
      const updatedProvisions = action.provision.map((provision, i) => {
        if (i === index) {
          return { ...provision, path: value };
        }
        return provision;
      });
      onChange({ ...action, provision: updatedProvisions });
    }
  };

  const handleAddProvision = () => {
    onChange({
      ...action,
      provision: [...action.provision, { application: 'app1', op: 'op1', path: '' }],
    });
    setShowInput(prevState => ({
      ...prevState,
      provision: [...prevState.provision, false],
    }));
  };

  const handleRemoveProvision = (index) => {
    const updatedProvisions = action.provision.filter((_, i) => i !== index);
    onChange({ ...action, provision: updatedProvisions });
    setShowInput(prevState => ({
      ...prevState,
      provision: prevState.provision.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* Render conditionMet and conditionNotMet rows */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div>Condition Met:</div>
        <button type="button" onClick={() => handleButtonClick('conditionMet')}>Message</button>
        {showInput.conditionMet && (
          <input
            type="text"
            value={action.conditionMet.message}
            onChange={(e) => handleInputChange('conditionMet', e.target.value)}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div>Condition Not Met:</div>
        <button type="button" onClick={() => handleButtonClick('conditionNotMet')}>Message</button>
        {showInput.conditionNotMet && (
          <input
            type="text"
            value={action.conditionNotMet.message}
            onChange={(e) => handleInputChange('conditionNotMet', e.target.value)}
          />
        )}
      </div>

      {/* Render provision rows */}
      {action.provision.map((provision, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <select value={provision.application} onChange={(e) => handleInputChange('provision', 'application', e.target.value, index)}>
            <option value="app1">app1</option>
            <option value="app2">app2</option>
            <option value="app3">app3</option>
          </select>
          <select value={provision.op} onChange={(e) => handleInputChange('provision', 'op', e.target.value, index)}>
            <option value="op1">op1</option>
            <option value="op2">op2</option>
            <option value="op3">op3</option>
          </select>
          <input
            type="text"
            value={provision.path}
            onChange={(e) => handleInputChange('provision', 'path', e.target.value, index)}
          />
          <button type="button" onClick={() => handleRemoveProvision(index)}>Remove Provision</button>
        </div>
      ))}
      <button type="button" onClick={handleAddProvision}>Add Provision</button>
    </div>
  );
};

ActionOnCondition.propTypes = {
  action: PropTypes.shape({
    conditionMet: PropTypes.shape({
      message: PropTypes.string,
    }),
    conditionNotMet: PropTypes.shape({
      message: PropTypes.string,
    }),
    provision: PropTypes.arrayOf(PropTypes.shape({
      application: PropTypes.string,
      op: PropTypes.string,
      path: PropTypes.string,
    })),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ActionOnCondition;

-----------------------------------

  import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActionOnCondition from './ActionOnCondition'; // Make sure to import the ActionOnCondition component

export class EditRulePlain extends Component {
  static propTypes = {
    ruleDetails: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // ... other state properties
      action: {
        conditionMet: {
          message: props.ruleDetails.action.conditionMet.message || '',
        },
        conditionNotMet: {
          message: props.ruleDetails.action.conditionNotMet.message || '',
        },
        provision: props.ruleDetails.action.provision || [
          // Default provision object if none provided
          {
            application: 'app1',
            op: 'op1',
            path: '',
          },
        ],
      },
      // ... other state properties
    };
  }

  componentDidMount() {
    // If you need to perform any setup on mount
  }

  handleRequestData = (updatedAction) => {
    // Update the state with the new action
    this.setState({ action: updatedAction });
  };

  render() {
    const { action } = this.state;

    return (
      <div>
        {/* ... other components */}
        <ActionOnCondition
          action={action}
          onChange={this.handleRequestData}
        />
        {/* ... other components */}
      </div>
    );
  }
}

export default EditRulePlain;

  
