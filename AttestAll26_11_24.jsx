//////////////////////upadte 3 with loading 

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
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state

    // Load data for the current page
    useEffect(() => {
        setLoading(true);
        dispatchLoadApprovalRulesList(currentPage, 5).finally(() => setLoading(false));
    }, [dispatchLoadApprovalRulesList, currentPage]);

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

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle "Go Back" action
    const handleGoBack = () => {
        setShowCommentBox(false);
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    {/* Loading Indicator */}
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
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
                                    {allApprovalRulesMeta?.data?.map((rule) => (
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

                            {/* Pagination Controls */}
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                >
                                    Previous
                                </button>
                                {[...Array(Math.ceil(allApprovalRulesMeta?.totalRows / 5) || 1)].map(
                                    (_, index) => (
                                        <button
                                            key={index}
                                            className={`btn ${
                                                currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'
                                            }`}
                                            onClick={() => handlePageChange(index + 1)}
                                            disabled={loading}
                                        >
                                            {index + 1}
                                        </button>
                                    )
                                )}
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(allApprovalRulesMeta?.totalRows / 5) || loading}
                                >
                                    Next
                                </button>
                            </div>

                            {/* Attest All Button or Comment Box */}
                            {!showCommentBox ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAttestAll}
                                    disabled={selectedRows.length === 0 || loading}
                                >
                                    Attest All
                                </button>
                            ) : (
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
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleGoBack}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export const attestAllByCheckBoxRowsExport = connect(ms2p, md2p)(attestAllByCheckBoxRows);


/////////////////////update 2 with pagination///////////////
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
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, 5);
    }, [dispatchLoadApprovalRulesList, currentPage]);

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

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle "Go Back" action
    const handleGoBack = () => {
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
                            {allApprovalRulesMeta?.data?.map((rule) => (
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

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(Math.ceil(allApprovalRulesMeta?.totalRows / 5) || 1)].map(
                            (_, index) => (
                                <button
                                    key={index}
                                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            )
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(allApprovalRulesMeta?.totalRows / 5)}
                        >
                            Next
                        </button>
                    </div>

                    {/* Attest All Button or Comment Box */}
                    {!showCommentBox ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleAttestAll}
                            disabled={selectedRows.length === 0}
                        >
                            Attest All
                        </button>
                    ) : (
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
                            <button
                                className="btn btn-secondary"
                                onClick={handleGoBack}
                            >
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export const attestAllByCheckBoxRowsExport = connect(ms2p, md2p)(attestAllByCheckBoxRows);


/////////////////update 1//////////////////////////////
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
