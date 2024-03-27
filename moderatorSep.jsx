import React, { useState } from 'react';
import RuleCategoryChange from './RuleCategoryChange';

export function createRule(props) {
    const [state, setState] = useState({
        category: '',
        carId: '',
        ruleOwner: '',
        moderator: [],
        inputModeratorText: '',
        showModeratorSuggestions: false,
        selectedModerators: [],
    });

    const handleModeratorInputChange = (e) => {
        const inputText = e.target.value;
        setState((prevState) => ({
            ...prevState,
            inputModeratorText: inputText,
            showModeratorSuggestions: inputText !== '', // Show suggestions if input text is not empty
        }));
    };

    const handleModeratorSelection = (user) => {
        const updatedModerators = [...state.selectedModerators, user];
        setState((prevState) => ({
            ...prevState,
            inputModeratorText: '', // Clear input text
            showModeratorSuggestions: false, // Hide suggestions
            selectedModerators: updatedModerators,
            moderator: updatedModerators, // Update moderator state
        }));
    };

    const handleRemoveModerator = (index) => {
        const updatedModerators = [...state.selectedModerators];
        updatedModerators.splice(index, 1);
        setState((prevState) => ({
            ...prevState,
            selectedModerators: updatedModerators,
            moderator: updatedModerators, // Update moderator state
        }));
    };

    return (
        <div>
            {/* Moderator Row */}
            <div className="row">
                <div className="col-md-2">
                    <label>Moderator</label>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        value={state.inputModeratorText}
                        onChange={handleModeratorInputChange}
                        placeholder="Search by name and select"
                        style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                    />
                    {/* Show progress bar if loading user list */}
                    {props.usersList.status === 'loading' && <div className="progress-bar"></div>}
                    {/* Show suggestions if available */}
                    {state.showModeratorSuggestions && props.usersList.data.length > 0 && (
                        <div className="suggestions">
                            {props.usersList.data.map((user) => (
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
                    {state.selectedModerators.map((moderator, index) => (
                        <div key={index} className="selected-value" style={{ borderColor: 'blue' }}>
                            {moderator.userName}
                            <button onClick={() => handleRemoveModerator(index)}>X</button>
                        </div>
                    ))}
                </div>
            </div>

            <RuleCategoryChange
                onChange={(values) =>
                    setState((prevState) => ({
                        ...prevState,
                        moderator: values.moderator, // Update moderator state from child component
                    }))
                }
            />
            {/* Render other components or UI based on the state values */}
        </div>
    );
}

export default createRule;
