import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ActionOnCondition = ({ action, onChange }) => {
  const [showInput, setShowInput] = useState({ conditionMet: false, conditionNotMet: false });

  const handleButtonClick = (condition) => {
    setShowInput(prevState => ({ ...prevState, [condition]: !prevState[condition] }));
  };

  const handleInputChange = (condition, value) => {
    onChange({ ...action, [condition]: { message: value } });
  };

  return (
    <div>
      {['conditionMet', 'conditionNotMet'].map((condition) => (
        <div key={condition} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ marginRight: '10px' }}>{condition === 'conditionMet' ? 'Condition Met' : 'Condition Not Met'}</div>
          <button onClick={() => handleButtonClick(condition)}>Message</button>
          {showInput[condition] && (
            <input
              type="text"
              value={action[condition].message}
              onChange={(e) => handleInputChange(condition, e.target.value)}
            />
          )}
        </div>
      ))}
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
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ActionOnCondition;
-----------------------
  // ... (other imports)
import ActionOnCondition from './ActionOnCondition'; // Import the new component

export class EditRulePlain extends Component {
  // ... (other static properties)

  constructor(props) {
    super(props);
    this.state = {
      // ... (other state properties)
      action: {
        conditionMet: {
          message: '',
        },
        conditionNotMet: {
          message: '',
        },
      },
    };
  }

  componentDidMount() {
    // ... (existing componentDidMount logic)
    const action = ruleDetails.action || this.state.action;
    this.setState({ action });
  }

  handleRequestData = (updatedAction) => {
    this.setState({ action: updatedAction });
  };

  // ... (other methods)

  render() {
    // ... (existing render logic)
    const { action } = this.state;

    return (
      <div>
        {/* ... (existing JSX) */}
        <Container className="col-md-12 pad-1 card-rounded margin-1-b">
          <Row>
            <ActionOnCondition
              action={action}
              onChange={this.handleRequestData}
            />
            {/* ... (other components) */}
          </Row>
        </Container>
      </div>
    );
  }
}

// ... (existing export)


-----------------------------------------updated allow deny--------------------


import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ActionOnCondition = ({ action, onChange, ruleType }) => {
  const [showInput, setShowInput] = useState({
    conditionMet: ruleType === 'Deny', // Initially show conditionMet if ruleType is 'Deny'
    conditionNotMet: ruleType === 'Allow' // Initially show conditionNotMet if ruleType is 'Allow'
  });

  const handleButtonClick = condition => {
    setShowInput(prevState => ({ ...prevState, [condition]: !prevState[condition] }));
  };

  const handleInputChange = (condition, value) => {
    onChange({ ...action, [condition]: { message: value } });
  };

  return (
    <div>
      {ruleType === 'Allow' ? (
        <div key="conditionNotMet" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ marginRight: '10px' }}>Condition Not Met</div>
          <button onClick={() => handleButtonClick('conditionNotMet')}>Message</button>
          {showInput.conditionNotMet && (
            <input
              type="text"
              value={action.conditionNotMet.message}
              onChange={e => handleInputChange('conditionNotMet', e.target.value)}
            />
          )}
        </div>
      ) : (
        <div key="conditionMet" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ marginRight: '10px' }}>Condition Met</div>
          <button onClick={() => handleButtonClick('conditionMet')}>Message</button>
          {showInput.conditionMet && (
            <input
              type="text"
              value={action.conditionMet.message}
              onChange={e => handleInputChange('conditionMet', e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};

ActionOnCondition.propTypes = {
  action: PropTypes.shape({
    conditionMet: PropTypes.shape({
      message: PropTypes.string
    }),
    conditionNotMet: PropTypes.shape({
      message: PropTypes.string
    })
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  ruleType: PropTypes.string.isRequired
};

export default ActionOnCondition;
