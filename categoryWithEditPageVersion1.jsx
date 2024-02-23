import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, searchApps } from './actions'; // Import actions accordingly

// Define your selector functions or use predefined selectors from your project
const getSearchedApps = (state) => state.searchedApps;
const getUsers = (state) => state.users;

const RuleCategoryChangeEditApproval = ({ category, carId, ruleOwner, onChange }) => {
    const dispatch = useDispatch();
    const appsSearchList = useSelector(getSearchedApps);
    const usersList = useSelector(getUsers);

    const [inputCarIdText, setInputCarIdText] = useState(carId ? carId : '');
    const [inputRuleOwnerText, setInputRuleOwnerText] = useState(ruleOwner ? ruleOwner : '');
    const [showCarIdSuggestions, setShowCarIdSuggestions] = useState(false);
    const [showRuleOwnerSuggestions, setShowRuleOwnerSuggestions] = useState(false);

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        onChange({ category: newCategory, carId, ruleOwner });
    };

    const handleCarIdInputChange = (e) => {
        setInputCarIdText(e.target.value);
        dispatch(loadUsers(e.target.value));
        setShowCarIdSuggestions(e.target.value !== '');
    };

    const handleRuleOwnerInputChange = (e) => {
        setInputRuleOwnerText(e.target.value);
        dispatch(searchApps(e.target.value));
        setShowRuleOwnerSuggestions(e.target.value !== '');
    };

    const handleCarIdSelection = (app) => {
        setInputCarIdText(`${app.applName} (${app.applId})`);
        setInputRuleOwnerText(app.techOwnerFullName);
        setShowCarIdSuggestions(false);
        setShowRuleOwnerSuggestions(false);
        onChange({ category, carId: `${app.applName} (${app.applId})`, ruleOwner: app.techOwnerFullName });
    };

    const handleRuleOwnerSelection = (user) => {
        setInputRuleOwnerText(user.techOwnerFullName);
        setShowRuleOwnerSuggestions(false);
        onChange({ category, carId, ruleOwner: user.techOwnerFullName });
    };

    const handleClearCarId = () => {
        setInputCarIdText('');
        onChange({ category, carId: '', ruleOwner });
    };

    const handleClearRuleOwner = () => {
        setInputRuleOwnerText('');
        onChange({ category, carId, ruleOwner: '' });
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-2">
                    <label>Category</label>
                </div>
                <div className="col-md-4">
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="Application Policies">Application Policies</option>
                        <option value="Organizational Policies">Organizational Policies</option>
                    </select>
                </div>
            </div>

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
                    {showCarIdSuggestions && usersList().data.length > 0 && (
                        <div className="suggestions">
                            {usersList().data.map((app) => (
                                <div className="suggestion" key={app.applId} onClick={() => handleCarIdSelection(app)}>
                                    {app.applName} ({app.applId}) - {app.techOwnerFullName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-md-4">
                    {carId && (
                        <div className="selected-value">
                            {carId}
                            <button onClick={handleClearCarId}>X</button>
                        </div>
                    )}
                </div>
            </div>

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
                    {showRuleOwnerSuggestions && appsSearchList().data.length > 0 && (
                        <div className="suggestions">
                            {appsSearchList().data.map((user) => (
                                <div className="suggestion" key={user.ecn} onClick={() => handleRuleOwnerSelection(user)}>
                                    {user.techOwnerFullName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-md-4">
                    {ruleOwner && (
                        <div className="selected-value">
                            {ruleOwner}
                            <button onClick={handleClearRuleOwner}>X</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RuleCategoryChangeEditApproval;
