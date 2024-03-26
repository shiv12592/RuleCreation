import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSearchedApps, getUsers, loadUsers, searchApps } from './actions'; // Import actions accordingly

const RuleCategoryChange = ({ onChange }) => {
    const dispatch = useDispatch();
    const appsSearchList = useSelector(getSearchedApps);
    const usersList = useSelector(getUsers);

    const [category, setCategory] = useState('');
    const [carId, setCarId] = useState('');
    const [ruleOwner, setRuleOwner] = useState('');
    const [moderator, setModerator] = useState('');
    const [inputCarIdText, setInputCarIdText] = useState('');
    const [inputRuleOwnerText, setInputRuleOwnerText] = useState('');
    const [inputModeratorText, setInputModeratorText] = useState('');
    const [showCarIdSuggestions, setShowCarIdSuggestions] = useState(false);
    const [showRuleOwnerSuggestions, setShowRuleOwnerSuggestions] = useState(false);
    const [showModeratorSuggestions, setShowModeratorSuggestions] = useState(false);
    const [selectedModerators, setSelectedModerators] = useState([]);

    // Handle category change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        if (e.target.value === 'Organizational Policies') {
            setRuleOwner('Patrick Jeniffer');
        }
        // Send selected values back to parent component
        onChange({ category: e.target.value, carId, ruleOwner, moderator });
    };

    // Handle car id input change
    const handleCarIdInputChange = (e) => {
        setInputCarIdText(e.target.value);
        // Dispatch action to load users based on input text
        dispatch(loadUsers(e.target.value));
        // Show suggestions if input text is not empty
        setShowCarIdSuggestions(e.target.value !== '');
    };

    // Handle car id selection from suggestions
    const handleCarIdSelection = (app) => {
        // Set car id and rule owner values based on selected app
        setCarId(`${app.applName} (${app.applId})`);
        setRuleOwner(app.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputCarIdText('');
        setShowCarIdSuggestions(false);
        // Send selected values back to parent component
        onChange({ category, carId: `${app.applName} (${app.applId})`, ruleOwner: app.techOwnerFullName, moderator });
    };

    // Handle rule owner input change
    const handleRuleOwnerInputChange = (e) => {
        setInputRuleOwnerText(e.target.value);
        // Dispatch action to search apps based on input text
        dispatch(searchApps(e.target.value));
        // Show suggestions if input text is not empty
        setShowRuleOwnerSuggestions(e.target.value !== '');
    };

    // Handle rule owner selection from suggestions
    const handleRuleOwnerSelection = (user) => {
        // Set rule owner value based on selected user
        setRuleOwner(user.techOwnerFullName);
        // Clear input text and hide suggestions
        setInputRuleOwnerText('');
        setShowRuleOwnerSuggestions(false);
        // Send selected values back to parent component
        onChange({ category, carId, ruleOwner: user.techOwnerFullName, moderator });
    };

    // Handle moderator input change
    const handleModeratorInputChange = (e) => {
        setInputModeratorText(e.target.value);
        // Dispatch action to load users based on input text
        dispatch(loadUsers(e.target.value));
        // Show suggestions if input text is not empty
        setShowModeratorSuggestions(e.target.value !== '');
    };

    // Handle moderator selection from suggestions
    const handleModeratorSelection = (user) => {
        // Add selected moderator to the list
        setSelectedModerators([...selectedModerators, user]);
        // Clear input text and hide suggestions
        setInputModeratorText('');
        setShowModeratorSuggestions(false);
        // Send selected values back to parent component
        onChange({ category, carId, ruleOwner, moderator: [...selectedModerators, user] });
    };

    // Handle remove moderator
    const handleRemoveModerator = (index) => {
        const updatedModerators = [...selectedModerators];
        updatedModerators.splice(index, 1);
        setSelectedModerators(updatedModerators);
        // Send updated list of moderators back to parent component
        onChange({ category, carId, ruleOwner, moderator: updatedModerators });
    };

    // Handle clear button for car id
    const handleClearCarId = () => {
        // Reset car id and rule owner values
        setCarId('');
        setRuleOwner('');
        // Send selected values back to parent component
        onChange({ category, carId: '', ruleOwner: '', moderator });
    };

    // Handle clear button for rule owner
    const handleClearRuleOwner = () => {
        // Reset rule owner value
        setRuleOwner('');
        // Send selected values back to parent component
        onChange({ category, carId, ruleOwner: '', moderator });
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
                    <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
                        Car ID
                    </label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={inputCarIdText}
                        onChange={handleCarIdInputChange}
                        placeholder="Search by name or ID and select"
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {/* Show progress bar if loading users */}
                    {usersList.status === 'loading' && <div className="progress-bar"></div>}
                    {/* Show suggestions if available */}
                    {showCarIdSuggestions && usersList.data.length > 0 && (
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
                <div className="col-md-4">
                    {/* Show selected car id value with clear button */}
                    {carId && (
                        <div className="selected-value" style={{ borderColor: 'blue' }}>
                            {carId}
                            <button onClick={handleClearCarId}>X</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Rule Owner Row */}
            {/* Rule Owner Row */}
            <div className="row">
                <div className="col-md-2">
                    <label style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
                        Rule Owner
                    </label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={inputRuleOwnerText}
                        onChange={handleRuleOwnerInputChange}
                        placeholder="Search by name or ID and select"
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {/* Show progress bar if searching apps */}
                    {appsSearchList.status === 'loading' && <div className="progress-bar"></div>}
                    {/* Show suggestions if available */}
                    {showRuleOwnerSuggestions && appsSearchList.data.length > 0 && (
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
                <div className="col-md-4">
                    {/* Show selected rule owner value with clear button */}
                    {ruleOwner && (
                        <div className="selected-value" style={{ borderColor: 'blue' }}>
                            {ruleOwner}
                            <button onClick={handleClearRuleOwner}>X</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Moderator Row */}
            <div className="row">
                <div className="col-md-2">
                    <label>Moderator</label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={inputModeratorText}
                        onChange={handleModeratorInputChange}
                        placeholder="Search by name and select"
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {/* Show progress bar if loading user list */}
                    {usersList.status === 'loading' && <div className="progress-bar"></div>}
                    {/* Show suggestions if available */}
                    {showModeratorSuggestions && usersList.data.length > 0 && (
                        <div className="suggestions">
                            {usersList.data.map((user) => (
                                <div
                                    className="suggestion"
                                    key={user.userId}
                                    onClick={() => handleModeratorSelection(user)}
                                >
                                    {user.userName}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="col-md-4">
                    {/* Show selected moderators with clear button */}
                    {selectedModerators.map((moderator, index) => (
                        <div key={index} className="selected-value" style={{ borderColor: 'blue' }}>
                            {moderator.userName}
                            <button onClick={() => handleRemoveModerator(index)}>X</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RuleCategoryChange;
