import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
import { PageWrapper } from '../../Common/PageWrapper';

export const ms2p = (state) => ({
    allApprovalRulesMeta: getAllApprovalRules(state),
});

export const md2p = (dispatch) =>
    bindActionCreators(
        {
            dispatchLoadApprovalRulesList: loadApprovalRulesList,
            dusptachSubmitAttestData: submitAttestData,
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList, 
    dusptachSubmitAttestData 
}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    // Load initial data
    useEffect(() => {
        dispatchLoadApprovalRulesList(1, 5);
    }, [dispatchLoadApprovalRulesList]);

    // Handle row selection
    const handleRowSelection = (workItemNo) => {
        setSelectedRows((prev) =>
            prev.includes(workItemNo) 
                ? prev.filter((item) => item !== workItemNo) 
                : [...prev, workItemNo]
        );
    };

    // Handle attest all action
    const handleAttestAll = () => {
        setShowCommentBox(true);
    };

    // Handle submit action
    const handleSubmit = () => {
        const data = {
            workItemNos: selectedRows,
            comment,
        };
        dusptachSubmitAttestData(data);
        setSelectedRows([]);
        setComment('');
        setShowCommentBox(false);
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    {/* Table to display rows */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Work Item No</th>
                                <th>Rule Name</th>
                                <th>Owner Name</th>
                                <th>Rule Category</th>
                                <th>Type</th>
                                <th>Requester Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allApprovalRulesMeta?.results?.map((rule) => (
                                <tr key={rule.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(rule.workItemNo)}
                                            onChange={() => handleRowSelection(rule.workItemNo)}
                                        />
                                    </td>
                                    <td>{rule.workItemNo}</td>
                                    <td>{rule.ruleName}</td>
                                    <td>{rule.ownerName}</td>
                                    <td>{rule.ruleCategory}</td>
                                    <td>{rule.type}</td>
                                    <td>{rule.requesterName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Attest All Button */}
                    <button
                        className="btn btn-primary"
                        onClick={handleAttestAll}
                        disabled={selectedRows.length === 0}
                    >
                        Attest All
                    </button>

                    {/* Comment Box and Submit Button */}
                    {showCommentBox && (
                        <div className="comment-section">
                            <textarea
                                className="form-control"
                                placeholder="Enter your comments"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
                                disabled={!comment.trim()}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export const attestAllByCheckBoxRowsExport = connect(ms2p, md2p)(attestAllByCheckBoxRows);
