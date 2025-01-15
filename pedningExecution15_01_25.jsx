///////////////////update 2 child compoent for go back and comment box on execution

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitExecuteRuleData } from '../../store/rules/actionCreators';
import { PageWrapper } from '../../Common/PageWrapper';
import ModuleWrapper from '../../Common/ModuleWrapper';
import ErrorComponent from '../../Common/ErrorComponent';
import { useNavigate } from 'react-router-dom';

export const ms2p = (state) => ({
    allApprovalRulesMeta: getAllApprovalRules(state),
});

export const md2p = (dispatch) =>
    bindActionCreators(
        {
            dispatchLoadApprovalRulesList: loadApprovalRulesList,
            dusptachSubmitExecuteRuleData: submitExecuteRuleData,
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ allApprovalRulesMeta, dispatchLoadApprovalRulesList, dusptachSubmitExecuteRuleData }) => {
    const page_size = 5; 
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [executeFlag, setExecuteFlag] = useState(null);
    const navigate = useNavigate();

    const totalRows = allApprovalRulesMeta?.total || 0; 
    const lastPageNumber = Math.ceil(totalRows / page_size); 

    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

    const handleRowSelection = (workItemNo) => {
        setSelectedRows((prev) =>
            prev.includes(workItemNo) 
                ? prev.filter((item) => item !== workItemNo) 
                : [...prev, workItemNo]
        );
    };

    const handleShowCommentBox = (execute) => {
        setExecuteFlag(execute);
        setShowCommentBox(true);
    };

    const handleSubmitExecuteRule = () => {
        const data = {
            workItemNos: selectedRows,
            comment,
            execute: executeFlag,
        };
        dusptachSubmitExecuteRuleData(data);
        setSelectedRows([]);
        setComment('');
        setShowCommentBox(false);
    };

    const handleGoBack = () => {
        if (showCommentBox) {
            setShowCommentBox(false);
        } else {
            navigate(-1); // Redirect to parent
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
                            <>
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

                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {Array.from({ length: lastPageNumber }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`btn btn-sm ${
                                                    currentPage === page
                                                        ? 'btn-primary'
                                                        : 'btn-secondary'
                                                }`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {currentPage < lastPageNumber && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            {'>'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    />
                </div>
                <hr />
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    {!showCommentBox ? (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={handleGoBack}
                            >
                                Go Back
                            </button>
                            <button
                                className="btn btn-success ml-3"
                                onClick={() => handleShowCommentBox(true)}
                                disabled={selectedRows.length === 0}
                            >
                                Execute
                            </button>
                            <button
                                className="btn btn-danger ml-3"
                                onClick={() => handleShowCommentBox(false)}
                                disabled={selectedRows.length === 0}
                            >
                                No-Execute
                            </button>
                        </>
                    ) : (
                        <div className="comment-section">
                            <textarea
                                className="form-control"
                                placeholder="Enter your comments"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                className="btn btn-success mt-2"
                                onClick={handleSubmitExecuteRule}
                                disabled={!comment.trim()}
                            >
                                Submit
                            </button>
                            <button
                                className="btn btn-secondary mt-2 ml-3"
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


//child file -- 
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { 
    loadApprovalRulesList, 
    submitAttestData, 
    submitChangeRuleData, 
    submitExecuteRuleData 
} from '../../store/rules/actionCreators';
import { PageWrapper } from '../../Common/PageWrapper';
import ModuleWrapper from '../../Common/ModuleWrapper';
import ErrorComponent from '../../Common/ErrorComponent';

export const ms2p = (state) => ({
    allApprovalRulesMeta: getAllApprovalRules(state),
});

export const md2p = (dispatch) =>
    bindActionCreators(
        {
            dispatchLoadApprovalRulesList: loadApprovalRulesList,
            dusptachSubmitAttestData: submitAttestData,
            dusptachSubmitChangeRuleData: submitChangeRuleData,
            dusptachSubmitExecuteRuleData: submitExecuteRuleData,
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList, 
    dusptachSubmitChangeRuleData, 
    dusptachSubmitExecuteRuleData 
}) => {
    const page_size = 5; 
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    const totalRows = allApprovalRulesMeta?.total || 0; 
    const lastPageNumber = Math.ceil(totalRows / page_size); 

    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

    const handleRowSelection = (workItemNo) => {
        setSelectedRows((prev) =>
            prev.includes(workItemNo) 
                ? prev.filter((item) => item !== workItemNo) 
                : [...prev, workItemNo]
        );
    };

    const handleShowCommentBox = () => {
        setShowCommentBox(true);
    };

    const handleSubmitChangeRule = () => {
        const data = {
            workItemNos: selectedRows,
            comment,
        };
        dusptachSubmitChangeRuleData(data);
        setSelectedRows([]);
        setComment('');
        setShowCommentBox(false);
    };

    const handleExecute = (execute) => {
        const data = {
            workItemNos: selectedRows,
            execute,
        };
        dusptachSubmitExecuteRuleData(data);
        setSelectedRows([]);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleGoBack = () => {
        setShowCommentBox(false);
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
                            <>
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

                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {Array.from({ length: lastPageNumber }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`btn btn-sm ${
                                                    currentPage === page
                                                        ? 'btn-primary'
                                                        : 'btn-secondary'
                                                }`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {currentPage < lastPageNumber && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            {'>'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    />
                </div>
                <hr />
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    {!showCommentBox ? (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={handleShowCommentBox}
                                disabled={selectedRows.length === 0}
                            >
                                Change Rule
                            </button>
                            <button
                                className="btn btn-success ml-2"
                                onClick={() => handleExecute(true)}
                                disabled={selectedRows.length === 0}
                            >
                                Execute
                            </button>
                            <button
                                className="btn btn-danger ml-2"
                                onClick={() => handleExecute(false)}
                                disabled={selectedRows.length === 0}
                            >
                                Not-Execute
                            </button>
                        </>
                    ) : (
                        <div className="comment-section">
                            <textarea
                                className="form-control"
                                placeholder="Enter your comments"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                className="btn btn-success mt-2"
                                onClick={handleSubmitChangeRule}
                                disabled={!comment.trim()}
                            >
                                Submit
                            </button>
                            <button
                                className="btn btn-secondary mt-2 ml-2"
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



//parent file 
import React from 'react';
import { connect } from 'react-redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList } from '../../store/rules/actionCreators';
import { PageWrapper } from '../Common/PageWrapper';
import { ModuleWrapper} from 'iam-react-components';
import {ErrorComponent} from '../Common/ErrorComponent';

// Map state to props
export const ms2p = (state) => ({
    allExecutionRulesMeta: getAllApprovalRules(state),
});

export const md2p = (dispatch) =>
    bindActionCreators(
        {
            dispatchLoadApprovalRulesList: loadApprovalRulesList,
        },
        dispatch
    );

export const ExecutionRules = ({ allExecutionRulesMeta, dispatchLoadApprovalRulesList }) => {
   
    useEffect(() => {
        dispatchLoadApprovalRulesList(1, 20);
    }, [dispatchLoadApprovalRulesList]);

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <ModuleWrapper
                        {...allExecutionRulesMeta}
                        whenError={() => <ErrorComponent error={allExecutionRulesMeta?.error} />}
                        whenLoaded={() => (
                            allExecutionRulesMeta?.data?.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Rule No</th>
                                            <th>Rule Name</th>
                                            <th>Rule Version</th>
                                            <th>Execution Count</th>
                                            <th>Type</th>
                                            <th>Requester Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allExecutionRulesMeta.data.map((rule) => (
                                            <tr key={rule.ruleNo}>
                                                <td>{rule.ruleNo}</td>
                                                <td>
                                                    <Link
                                                       to={getPathAttestAllByCheckBox} title={`Execeute and more actions - ${rule.ruleName}`}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </Link>
                                                </td>
                                                <td>{rule.ruleVersion}</td>
                                                <td>{rule.executionCount}</td>
                                                <td>{rule.type}</td>
                                                <td>{rule.requesterName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No execution rules found.</p>
                            )
                        )}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

// Connect component to Redux
export const executionRulesExport = connect(ms2p, md2p)(ExecutionRules);
