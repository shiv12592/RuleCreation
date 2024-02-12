import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchedApps, getUsers, loadUsers, searchApps } from './actions'; // Import actions accordingly
import { Row, Col } from 'react-bootstrap';

const RuleCategoryChange = ({ onChange }) => {
  const [category, setCategory] = useState('');
  const [inputCarIdText, setInputCarIdText] = useState('');
  const [inputRuleOwnerText, setInputRuleOwnerText] = useState('');
  const [selectedCarIdLabel, setSelectedCarIdLabel] = useState('');
  const [selectedRuleOwnerLabel, setSelectedRuleOwnerLabel] = useState('');

  const appsSearchList = useSelector(getSearchedApps);
  const usersList = useSelector(getUsers);
  
  const dispatch = useDispatch();

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    if (e.target.value === 'Organizational Policies') {
      setSelectedRuleOwnerLabel('Patrick Jeniffer');
    }
    onChange({ category: e.target.value });
  };

  // Handle car id input change
  const handleCarIdInputChange = (e) => {
    setInputCarIdText(e.target.value);
    dispatch(loadUsers(e.target.value)); // Load users based on car id input
  };

  // Handle car id suggestion selection
  const handleCarIdSuggestionSelect = (suggestion) => {
    setInputCarIdText(''); // Clear the input text
    setSelectedCarIdLabel(`${suggestion.applName} (${suggestion.applId})`); // Set the label text
    if (category === 'Application Policies' || category === '') {
      setSelectedRuleOwnerLabel(suggestion.techOwnerFullName); // Set the rule owner label text
    }
    onChange({ carId: suggestion.applId }); // Send the selected car id to parent component
  };

  // Handle rule owner input change
  const handleRuleOwnerInputChange = (e) => {
    setInputRuleOwnerText(e.target.value);
    dispatch(searchApps(e.target.value)); // Search apps based on rule owner input
  };

  // Handle rule owner suggestion selection
  const handleRuleOwnerSuggestionSelect = (suggestion) => {
    setInputRuleOwnerText(''); // Clear the input text
    setSelectedRuleOwnerLabel(suggestion.techOwnerFullName); // Set the label text
    onChange({ ruleOwner: suggestion.techOwnerFullName }); // Send the selected rule owner to parent component
  };

  // Handle car id label clear
  const handleCarIdLabelClear = () => {
    setSelectedCarIdLabel(''); // Clear the label text
    onChange({ carId: '' }); // Send an empty car id to parent component
  };

  // Handle rule owner label clear
  const handleRuleOwnerLabelClear = () => {
    setSelectedRuleOwnerLabel(''); // Clear the label text
    onChange({ ruleOwner: '' }); // Send an empty rule owner to parent component
  };

  // Render the car id suggestions list
  const renderCarIdSuggestions = () => {
    if (appsSearchList.status === 'loaded' && appsSearchList.data.length > 0) {
      return (
        <div className="suggestions-popup">
          <ul className="suggestions-list">
            {appsSearchList.data.map((suggestion) => (
              <li
                key={suggestion.applId}
                onClick={() => handleCarIdSuggestionSelect(suggestion)}
              >
                {suggestion.applName} ({suggestion.applId}) -{' '}
                {suggestion.techOwnerFullName}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Render the rule owner suggestions list
  const renderRuleOwnerSuggestions = () => {
    if (usersList.status === 'loaded' && usersList.data.length > 0) {
      return (
        <div className="suggestions-popup">
          <ul className="suggestions-list">
            {usersList.data.map((suggestion) => (
              <li
                key={suggestion.applId}
                onClick={() => handleRuleOwnerSuggestionSelect(suggestion)}
              >
                {suggestion.applId}-{suggestion.techOwnerFullName}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <Row>
      <Col>
        <label>CATEGORY</label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="">-- Select --</option>
          <option value="Application Policies">Application Policies</option>
          <option value="Organizational Policies">Organizational Policies</option>
        </select>

        {/* Car ID */}
        <div className="car-id-field">
          <label>CAR ID</label>
          <div className="car-id-input">
            <input
              type="text"
              value={inputCarIdText}
              onChange={handleCarIdInputChange}
              placeholder="Car Id - Search by name or ID and select"
            />
            {renderCarIdSuggestions()}
          </div>
          <div className="car-id-label">
            <span>{selectedCarIdLabel}</span>
            {selectedCarIdLabel && (
              <button onClick={handleCarIdLabelClear}>X</button>
            )}
          </div>
        </div>

        {/* Rule Owner */}
        <div className="rule-owner-field">
          <label>RULE OWNER</label>
          <div className="rule-owner-input">
            <input
              type="text"
              value={inputRuleOwnerText}
              onChange={handleRuleOwnerInputChange}
              placeholder="Rule Owner - Search by name and select"
            />
            {renderRuleOwnerSuggestions()}
          </div>
          <div className="rule-owner-label">
            <span>{selectedRuleOwnerLabel}</span>
            {selectedRuleOwnerLabel && (
              <button onClick={handleRuleOwnerLabelClear}>X</button>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default RuleCategoryChange;
