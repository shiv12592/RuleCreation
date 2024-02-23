import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, searchApps } from './actions'; // Import actions accordingly

const RuleCategoryChange = ({ category, carId, ruleOwner, onChange }) => {
    const dispatch = useDispatch();
    const [inputCarIdText, setInputCarIdText] = useState('');
    const [inputRuleOwnerText, setInputRuleOwnerText] = useState('');
    const [showCarIdSuggestions, setShowCarIdSuggestions] = useState(false);
    const [showRuleOwnerSuggestions, setShowRuleOwnerSuggestions] = useState(false);
    const appsSearchList = useSelector(state => state.appsSearchList);
    const usersList = useSelector(state => state.usersList);

    const setCategory = (newCategory) => onChange({ category: newCategory, carId, ruleOwner });
    const setCarId = (newCarId) => onChange({ category, carId: newCarId, ruleOwner });
    const setRuleOwner = (newRuleOwner) => onChange({ category, carId, ruleOwner: newRuleOwner });

    // Handle category change
    const handleCategoryChange = (e) => {
        const updatedCategory = e.target.value;
        let updatedRuleOwner = ruleOwner;

        if (updatedCategory === 'Organizational Policies') {
            updatedRuleOwner = 'Patrick Jeniffer';
        }

        setCategory(updatedCategory);
        setRuleOwner(updatedRuleOwner);
    };

    // Handle car id input change
    const handleCarIdInputChange = (e) => {
        const value = e.target.value;
        setInputCarIdText(value);
        // Dispatch action to load users based on input text
        dispatch(loadUsers(value));
        // Show suggestions if input text is not empty
        setShowCarIdSuggestions(value !== '');
    };

    // Handle car id selection from suggestions
    const handleCarIdSelection = (app) => {
        // Set car id and rule owner values based on selected app
        setCarId(`${app.applName} (${app.applId})`);
        setRuleOwner(app.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputCarIdText('');
        setShowCarIdSuggestions(false);
    };

    // Handle rule owner input change
    const handleRuleOwnerInputChange = (e) => {
        const value = e.target.value;
        setInputRuleOwnerText(value);
        // Dispatch action to search apps based on input text
        dispatch(searchApps(value));
        // Show suggestions if input text is not empty
        setShowRuleOwnerSuggestions(value !== '');
        // Set rule owner value
        setRuleOwner(value);
    };

    // Handle rule owner selection from suggestions
    const handleRuleOwnerSelection = (user) => {
        // Set rule owner value based on selected user
        setRuleOwner(user.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputRuleOwnerText('');
        setShowRuleOwnerSuggestions(false);
    };

    return (
        <div>
            {/* Category Row */}
            <div className="row">
                <div className="col-md-2">
                    <label>Category</label>
                </div>
                <div className="col-md-4">
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="">--Select--</option>
                        <option value="Application Policies">Application Policies</option>
                        <option value="Organizational Policies">Organizational Policies</option>
                    </select>
                </div>
            </div>

            {/* Car ID Row */}
            <div className="row">
                <div className="col-md-2">
                    <label>Car ID</label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={inputCarIdText}
                        onChange={handleCarIdInputChange}
                        placeholder="Search by name or ID and select"
                    />
                    {/* Show suggestions if available */}
                    {showCarIdSuggestions && usersList.status === 'loaded' && (
                        <div className="suggestions">
                            {usersList.data.map((app) => (
                                <div
                                    className="suggestion"
                                    key={app.applId}
                                    onClick={() => handleCarIdSelection(app)}
                                >
                                    {app.applName} ({app.applId}) - {app.techOwnerFullName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Rule Owner Row */}
            <div className="row">
                <div className="col-md-2">
                    <label>Rule Owner</label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={inputRuleOwnerText}
                        onChange={handleRuleOwnerInputChange}
                        placeholder="Search by name or ID and select"
                    />
                    {/* Show suggestions if available */}
                    {showRuleOwnerSuggestions && appsSearchList.status === 'loaded' && (
                        <div className="suggestions">
                            {appsSearchList.data.map((user) => (
                                <div
                                    className="suggestion"
                                    key={user.ecn}
                                    onClick={() => handleRuleOwnerSelection(user)}
                                >
                                    {user.applId}-{user.techOwnerFullName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RuleCategoryChange;
