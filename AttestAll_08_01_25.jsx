///////////update 9 - 14-01-25 with removal of coment part and go back

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({
    allApprovalRulesMeta,
    dispatchLoadApprovalRulesList,
    dusptachSubmitAttestData,
}) => {
    const page_size = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [enforceLeastPrevilege, setEnforceLeastPrevilege] = useState(false);
    const [enforceSeperationOfDuties, setEnforceSeperationOfDuties] = useState(false);

    const totalRows = allApprovalRulesMeta?.total || 0;
    const lastPageNumber = Math.ceil(totalRows / page_size);

    // Range to show in pagination
    const visibleRange = 5; // Number of pages to show at once
    const startRange = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const endRange = Math.min(lastPageNumber, startRange + visibleRange - 1);

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

    // Handle row selection
    const handleRowSelection = (ruleId) => {
        setSelectedRows((prev) =>
            prev.includes(ruleId) ? prev.filter((item) => item !== ruleId) : [...prev, ruleId]
        );
    };

    const handleSubmit = () => {
        const data = {
            workItemNos: selectedRows,
            enforceLeastPrevilege: enforceLeastPrevilege ? 'yes' : 'no',
            enforceSeperationOfDuties: enforceSeperationOfDuties ? 'yes' : 'no',
        };
        dusptachSubmitAttestData(data);
        setSelectedRows([]);
        setIsChecked(false);
        setEnforceLeastPrevilege(false);
        setEnforceSeperationOfDuties(false);
    };

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => <ErrorComponent error={allApprovalRulesMeta.error} />}
                        whenLoaded={() => (
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
                                                        checked={selectedRows.includes(rule.id)}
                                                        onChange={() => handleRowSelection(rule.id)}
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
                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {startRange > 1 && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                            {startRange > 2 && <span className="mx-2">...</span>}
                                        </>
                                    )}
                                    {Array.from({ length: endRange - startRange + 1 }, (_, i) => startRange + i).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`btn btn-sm ${
                                                    currentPage === page ? 'btn-primary' : 'btn-secondary'
                                                }`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {endRange < lastPageNumber && (
                                        <>
                                            {endRange < lastPageNumber - 1 && <span className="mx-2">...</span>}
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(lastPageNumber)}
                                            >
                                                {lastPageNumber}
                                            </button>
                                        </>
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
                {/* Divider */}
                <hr />

                {/* Attest All Button or Comment Section */}
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <div className="checkbox-section">
                        <p>Check all that apply to your rule:</p>
                        <div>
                            <input
                                type="checkbox"
                                id="leastPrivilege"
                                checked={enforceLeastPrevilege}
                                onChange={() => setEnforceLeastPrevilege((prev) => !prev)}
                            />
                            <label htmlFor="leastPrivilege">
                                This rule enforces least privilege <a href="#">TECH09</a>
                            </label>
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                id="separationDuties"
                                checked={enforceSeperationOfDuties}
                                onChange={() => setEnforceSeperationOfDuties((prev) => !prev)}
                            />
                            <label htmlFor="separationDuties">This rule enforces separation of duties</label>
                        </div>
                    </div>
                    <div className="checkbox-section mt-3">
                        <input
                            type="checkbox"
                            id="attestAgreement"
                            checked={isChecked}
                            onChange={() => setIsChecked((prev) => !prev)}
                        />
                        <label htmlFor="attestAgreement" className="ml-2">
                            By clicking attest, I agree that as the rule owner both this rule:
                            <ul style={{ marginLeft: '1.5em' }}>
                                <li style={{ marginBottom: '0.5em' }}>
                                    I verify that I have technical business-level understanding.
                                </li>
                                <li>
                                    I validate this rule does not automatically grant and approve excessive access.
                                </li>
                            </ul>
                        </label>
                    </div>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={handleSubmit}
                        disabled={!isChecked || selectedRows.length === 0}
                    >
                        Attest All
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default connect(ms2p, md2p)(attestAllByCheckBoxRows);

///////////update 8 - 14-01-25

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({
    allApprovalRulesMeta,
    dispatchLoadApprovalRulesList,
    dusptachSubmitAttestData,
}) => {
    const page_size = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [enforceLeastPrevilege, setEnforceLeastPrevilege] = useState(null);
    const [enforceSeperationOfDuties, setEnforceSeperationOfDuties] = useState(null);

    const totalRows = allApprovalRulesMeta?.total || 0;
    const lastPageNumber = Math.ceil(totalRows / page_size);

    // Range to show in pagination
    const visibleRange = 5; // Number of pages to show at once
    const startRange = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const endRange = Math.min(lastPageNumber, startRange + visibleRange - 1);

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

    // Handle row selection
    const handleRowSelection = (ruleId) => {
        setSelectedRows((prev) =>
            prev.includes(ruleId) ? prev.filter((item) => item !== ruleId) : [...prev, ruleId]
        );
    };

    const handleAttestAll = () => {
        setShowCommentBox(true);
    };

    const handleSubmit = () => {
        const data = {
            workItemNos: selectedRows,
            comment,
            enforceLeastPrevilege: enforceLeastPrevilege === 'yes' ? 'yes' : null,
            enforceSeperationOfDuties: enforceSeperationOfDuties === 'yes' ? 'yes' : null,
        };
        dusptachSubmitAttestData(data);
        setSelectedRows([]);
        setComment('');
        setShowCommentBox(false);
        setIsChecked(false);
        setEnforceLeastPrevilege(null);
        setEnforceSeperationOfDuties(null);
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
                        whenError={() => <ErrorComponent error={allApprovalRulesMeta.error} />}
                        whenLoaded={() => (
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
                                                        checked={selectedRows.includes(rule.id)}
                                                        onChange={() => handleRowSelection(rule.id)}
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
                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {startRange > 1 && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                            {startRange > 2 && <span className="mx-2">...</span>}
                                        </>
                                    )}
                                    {Array.from({ length: endRange - startRange + 1 }, (_, i) => startRange + i).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`btn btn-sm ${
                                                    currentPage === page ? 'btn-primary' : 'btn-secondary'
                                                }`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {endRange < lastPageNumber && (
                                        <>
                                            {endRange < lastPageNumber - 1 && <span className="mx-2">...</span>}
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(lastPageNumber)}
                                            >
                                                {lastPageNumber}
                                            </button>
                                        </>
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
                {/* Divider */}
                <hr />
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <div className="checkbox-section">
                        <p>Check all that apply to your rule:</p>
                        <div>
                            <input
                                type="radio"
                                id="leastPrivilegeYes"
                                name="leastPrivilege"
                                value="yes"
                                checked={enforceLeastPrevilege === 'yes'}
                                onChange={() => setEnforceLeastPrevilege('yes')}
                            />
                            <label htmlFor="leastPrivilegeYes">
                                This rule enforces least privilege <a href="#">TECH09</a>
                            </label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="leastPrivilegeNo"
                                name="leastPrivilege"
                                value="no"
                                checked={enforceLeastPrevilege === 'no'}
                                onChange={() => setEnforceLeastPrevilege('no')}
                            />
                            <label htmlFor="leastPrivilegeNo">This rule does not enforce least privilege</label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                id="separationYes"
                                name="separationDuties"
                                value="yes"
                                checked={enforceSeperationOfDuties === 'yes'}
                                onChange={() => setEnforceSeperationOfDuties('yes')}
                            />
                            <label htmlFor="separationYes">
                                This rule enforces separation of duties
                            </label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="separationNo"
                                name="separationDuties"
                                value="no"
                                checked={enforceSeperationOfDuties === 'no'}
                                onChange={() => setEnforceSeperationOfDuties('no')}
                            />
                            <label htmlFor="separationNo">This rule does not enforce separation of duties</label>
                        </div>
                    </div>
                    <div className="checkbox-section">
                        <input
                            type="checkbox"
                            id="attestAgreement"
                            checked={isChecked}
                            onChange={() => setIsChecked((prev) => !prev)}
                        />
                        <label htmlFor="attestAgreement" className="ml-2">
                            By clicking attest, I agree that as the rule owner both this rule:
                            <ul>
                                <li>I verify that I have technical business-level understanding.</li>
                                <li>I validate this rule does not automatically grant and approve excessive access.</li>
                            </ul>
                        </label>
                    </div>
                    {!showCommentBox ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleAttestAll}
                            disabled={!isChecked || selectedRows.length === 0}
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
                            <button className="btn btn-success" onClick={handleSubmit} disabled={!comment.trim()}>
                                Submit
                            </button>
                            <button className="btn btn-secondary" onClick={handleGoBack}>
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default connect(ms2p, md2p)(attestAllByCheckBoxRows);


////////////update 7 - 08-01-25

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList, 
    dusptachSubmitAttestData 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // Track checkbox state

    const totalRows = allApprovalRulesMeta?.total || 0; // Get total entries
    const lastPageNumber = Math.ceil(totalRows / page_size); // Calculate the last page number

    // Range to show in pagination
    const visibleRange = 5; // Number of pages to show at once
    const startRange = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const endRange = Math.min(lastPageNumber, startRange + visibleRange - 1);

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

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
        setIsChecked(false); // Reset checkbox state after submission
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
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
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
                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {startRange > 1 && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                            {startRange > 2 && (
                                                <span className="mx-2">...</span>
                                            )}
                                        </>
                                    )}
                                    {Array.from({ length: endRange - startRange + 1 }, (_, i) => startRange + i).map(
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
                                    {endRange < lastPageNumber && (
                                        <>
                                            {endRange < lastPageNumber - 1 && (
                                                <span className="mx-2">...</span>
                                            )}
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(lastPageNumber)}
                                            >
                                                {lastPageNumber}
                                            </button>
                                        </>
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
                {/* Divider */}
                <hr />

                {/* Attest All Button or Comment Section */}
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <div className="checkbox-section">
                        <input
                            type="checkbox"
                            id="attestAgreement"
                            checked={isChecked}
                            onChange={() => setIsChecked((prev) => !prev)}
                        />
                        <label htmlFor="attestAgreement" className="ml-2">
                            By clicking attest, I agree that as the rule owner both this rule:
                            <ul>
                                <li>I verify that I have technical business-level understanding.</li>
                                <li>I validate this rule does not automatically grant and approve excessive access.</li>
                            </ul>
                        </label>
                    </div>

                    {!showCommentBox ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleAttestAll}
                            disabled={!isChecked || selectedRows.length === 0} // Enable only if checkbox is checked
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

////////////update 6
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList, 
    dusptachSubmitAttestData 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    const totalRows = allApprovalRulesMeta?.total || 0; // Get total entries
    const lastPageNumber = Math.ceil(totalRows / page_size); // Calculate the last page number

    // Range to show in pagination
    const visibleRange = 5; // Number of pages to show at once
    const startRange = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const endRange = Math.min(lastPageNumber, startRange + visibleRange - 1);

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

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
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
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
                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {startRange > 1 && (
                                        <>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(1)}
                                            >
                                                1
                                            </button>
                                            {startRange > 2 && (
                                                <span className="mx-2">...</span>
                                            )}
                                        </>
                                    )}
                                    {Array.from({ length: endRange - startRange + 1 }, (_, i) => startRange + i).map(
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
                                    {endRange < lastPageNumber && (
                                        <>
                                            {endRange < lastPageNumber - 1 && (
                                                <span className="mx-2">...</span>
                                            )}
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={() => handlePageChange(lastPageNumber)}
                                            >
                                                {lastPageNumber}
                                            </button>
                                        </>
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
                {/* Divider */}
                <hr />

                {/* Attest All Button or Comment Section */}
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
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


////////////////// update 5 pagination update
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const attestAllByCheckBoxRows = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList, 
    dusptachSubmitAttestData 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    const totalRows = allApprovalRulesMeta?.total || 0; // Get total entries
    const lastPageNumber = Math.ceil(totalRows / page_size); // Calculate the last page number

    // Load data for the current page
    useEffect(() => {
        dispatchLoadApprovalRulesList(currentPage, page_size);
    }, [dispatchLoadApprovalRulesList, currentPage, page_size]);

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
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
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
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {[...Array(lastPageNumber)].map((_, index) => (
                                        <button
                                            key={index}
                                            className={`btn btn-sm ${
                                                currentPage === index + 1
                                                    ? 'btn-primary'
                                                    : 'btn-secondary'
                                            }`}
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
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
                {/* Divider */}
                <hr />

                {/* Attest All Button or Comment Section */}
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
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

//////////////update 4 with module wrapper
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList, submitAttestData } from '../../store/rules/actionCreators';
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
                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => (
                            <ErrorComponent error={allApprovalRulesMeta.error} />
                        )}
                        whenLoaded={() => (
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
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(Math.ceil(allApprovalRulesMeta?.totalRows / 5) || 1)].map(
                                        (_, index) => (
                                            <button
                                                key={index}
                                                className={`btn btn-sm ${
                                                    currentPage === index + 1
                                                        ? 'btn-primary'
                                                        : 'btn-secondary'
                                                }`}
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        )
                                    )}
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={
                                            currentPage ===
                                            Math.ceil(allApprovalRulesMeta?.totalRows / 5)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    />
                </div>
                {/* Divider */}
                <hr />

                {/* Attest All Button or Comment Section */}
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
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
