////////////////////update 4 ------filters for search
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import {
    loadApprovalRulesList,
    loadApprovalRulesByFilter,
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
            dispatchLoadApprovalRulesByFilter: loadApprovalRulesByFilter,
        },
        dispatch
    );

export const auditLogForRules = ({
    allApprovalRulesMeta,
    dispatchLoadApprovalRulesList,
    dispatchLoadApprovalRulesByFilter,
}) => {
    const page_size = 5; // Page size
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRule, setSelectedRule] = useState(null);
    const [filters, setFilters] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);

    const totalRows = allApprovalRulesMeta?.total || 0; // Total entries
    const lastPageNumber = Math.ceil(totalRows / page_size); // Last page
    const visibleRange = 5; // Range of pages visible
    const startRange = Math.max(1, currentPage - Math.floor(visibleRange / 2));
    const endRange = Math.min(lastPageNumber, startRange + visibleRange - 1);

    // Load data (with or without filters)
    useEffect(() => {
        if (isFiltered) {
            const filterString = JSON.stringify(filters);
            dispatchLoadApprovalRulesByFilter(filterString, currentPage, page_size);
        } else {
            dispatchLoadApprovalRulesList(currentPage, page_size);
        }
    }, [dispatchLoadApprovalRulesList, dispatchLoadApprovalRulesByFilter, currentPage, page_size, isFiltered, filters]);

    // Handle rule click
    const handleRuleClick = (rule) => setSelectedRule(rule);

    // Close popup
    const closePopup = () => setSelectedRule(null);

    // Add a filter row
    const addFilter = () => {
        setFilters([...filters, { field: '', operator: 'Equals', value: '' }]);
    };

    // Update a filter row
    const updateFilter = (index, key, value) => {
        const updatedFilters = [...filters];
        updatedFilters[index][key] = value;
        setFilters(updatedFilters);
    };

    // Remove a filter row
    const removeFilter = (index) => {
        const updatedFilters = filters.filter((_, i) => i !== index);
        setFilters(updatedFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters([]);
        setIsFiltered(false);
        setCurrentPage(1);
        dispatchLoadApprovalRulesList(1, page_size);
    };

    // Perform search
    const searchWithFilters = () => {
        setIsFiltered(true);
        setCurrentPage(1);
    };

    // Render filters UI
    const renderFilters = () =>
        filters.map((filter, index) => (
            <div key={index} className="filter-row">
                <select
                    className="form-control"
                    value={filter.field}
                    onChange={(e) => updateFilter(index, 'field', e.target.value)}
                >
                    <option value="">Select Field</option>
                    <option value="workItemNo">Work Item No</option>
                    <option value="ruleName">Rule Name</option>
                    <option value="ownerName">Owner Name</option>
                    <option value="ruleCategory">Rule Category</option>
                    <option value="type">Type</option>
                    <option value="requesterName">Requester Name</option>
                </select>
                <select
                    className="form-control"
                    value={filter.operator}
                    onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                >
                    <option value="Equals">Equals</option>
                    <option value="NotEquals">Not Equals</option>
                </select>
                <input
                    type="text"
                    className="form-control"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                />
                <button className="btn btn-danger" onClick={() => removeFilter(index)}>
                    Remove
                </button>
            </div>
        ));

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    {/* Filters Section */}
                    <div className="filter-section">
                        <button className="btn btn-primary" onClick={addFilter}>
                            Add Filter
                        </button>
                        {renderFilters()}
                        <div className="filter-actions">
                            <button className="btn btn-secondary" onClick={clearFilters}>
                                Clear All
                            </button>
                            <button className="btn btn-success" onClick={searchWithFilters}>
                                Search
                            </button>
                        </div>
                    </div>

                    <ModuleWrapper
                        {...allApprovalRulesMeta}
                        whenError={() => <ErrorComponent error={allApprovalRulesMeta.error} />}
                        whenLoaded={() => (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
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
                                                <td>{rule.workItemNo}</td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleRuleClick(rule)}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </a>
                                                </td>
                                                <td>{rule.ownerName}</td>
                                                <td>{rule.ruleCategory}</td>
                                                <td>{rule.type}</td>
                                                <td>{rule.requesterName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="pagination d-flex justify-content-center align-items-center">
                                    {currentPage > 1 && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            {'<'}
                                        </button>
                                    )}
                                    {startRange > 1 && <span className="mx-2">...</span>}
                                    {Array.from({ length: endRange - startRange + 1 }, (_, i) => startRange + i).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                className={`btn ${
                                                    currentPage === page ? 'btn-primary' : 'btn-secondary'
                                                }`}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {endRange < lastPageNumber && <span className="mx-2">...</span>}
                                    {currentPage < lastPageNumber && (
                                        <button
                                            className="btn btn-sm text-primary font-weight-bold"
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            {'>'}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    />
                </div>

                {/* Popup */}
                {selectedRule && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-btn" onClick={closePopup}>
                                &times;
                            </button>
                            <h3 className="popup-title">
                                Audit Log for <strong>{selectedRule.ruleName}</strong>
                            </h3>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Work Item No</th>
                                        <td>{selectedRule.workItemNo}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule ID</th>
                                        <td>{selectedRule.ruleId}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Name</th>
                                        <td>{selectedRule.ruleName}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Category</th>
                                        <td>{selectedRule.ruleCategory}</td>
                                    </tr>
                                    <tr>
                                        <th>Requester ECN</th>
                                        <td>{selectedRule.requesterECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Requester Name</th>
                                        <td>{selectedRule.requesterName}</td>
                                    </tr>
                                    <tr>
                                        <th>Approval Name</th>
                                        <td>{selectedRule.approvalName}</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>{new Date(selectedRule.createdDate * 1000).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <td>{selectedRule.type}</td>
                                    </tr>
                                    <tr>
                                        <th>Owner ECN</th>
                                        <td>{selectedRule.ownerECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Owner Name</th>
                                        <td>{selectedRule.ownerName}</td>
                                    </tr>
                                    <tr>
                                        <th>Previous Owner ECN</th>
                                        <td>{selectedRule.prevOwnerECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{selectedRule.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Request No</th>
                                        <td>{selectedRule.requestNo}</td>
                                    </tr>
                                    <tr>
                                        <th>Expiration Date</th>
                                        <td>{new Date(selectedRule.expirationDate * 1000).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export const auditLogForRulesExport = connect(ms2p, md2p)(auditLogForRules);



///////////////////update 3 - for all data show on popup
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const auditLogForRules = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRule, setSelectedRule] = useState(null);

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

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rule name click
    const handleRuleClick = (rule) => {
        setSelectedRule(rule);
    };

    // Close the popup
    const closePopup = () => {
        setSelectedRule(null);
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
                                                <td>{rule.workItemNo}</td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleRuleClick(rule)}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </a>
                                                </td>
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
                {/* Rule Details Popup */}
                {selectedRule && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-btn" onClick={closePopup}>
                                &times;
                            </button>
                            <h3 className="popup-title">
                                Audit Log for <strong>{selectedRule.ruleName}</strong>
                            </h3>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Work Item No</th>
                                        <td>{selectedRule.workItemNo}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule ID</th>
                                        <td>{selectedRule.ruleId}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Name</th>
                                        <td>{selectedRule.ruleName}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Category</th>
                                        <td>{selectedRule.ruleCategory}</td>
                                    </tr>
                                    <tr>
                                        <th>Requester ECN</th>
                                        <td>{selectedRule.requesterECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Requester Name</th>
                                        <td>{selectedRule.requesterName}</td>
                                    </tr>
                                    <tr>
                                        <th>Approval Name</th>
                                        <td>{selectedRule.approvalName}</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>{new Date(selectedRule.createdDate * 1000).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <td>{selectedRule.type}</td>
                                    </tr>
                                    <tr>
                                        <th>Owner ECN</th>
                                        <td>{selectedRule.ownerECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Owner Name</th>
                                        <td>{selectedRule.ownerName}</td>
                                    </tr>
                                    <tr>
                                        <th>Previous Owner ECN</th>
                                        <td>{selectedRule.prevOwnerECN}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{selectedRule.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Request No</th>
                                        <td>{selectedRule.requestNo}</td>
                                    </tr>
                                    <tr>
                                        <th>Expiration Date</th>
                                        <td>{new Date(selectedRule.expirationDate * 1000).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export const auditLogForRulesExport = connect(ms2p, md2p)(auditLogForRules);


.popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 80%;
    max-height: 90%; /* Ensures the popup doesn't exceed 90% of the viewport height */
    overflow-y: auto; /* Adds vertical scrolling if content overflows */
    border-radius: 10px;
    padding: 20px;
}

.popup-content {
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
}

.popup-title {
    margin-bottom: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
}

.table {
    width: 100%;
    margin-bottom: 1rem;
    background-color: transparent;
    border-collapse: collapse;
}

.table-bordered {
    border: 1px solid #dee2e6;
}

.table-bordered th,
.table-bordered td {
    border: 1px solid #dee2e6;
    padding: 8px;
    vertical-align: top;
}

.table th {
    font-weight: bold;
    text-align: left;
}



////////////////////////update 2 --pop-up
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const approvalRulesTable = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRule, setSelectedRule] = useState(null);

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

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rule name click
    const handleRuleClick = (rule) => {
        setSelectedRule(rule);
    };

    // Close the popup
    const closePopup = () => {
        setSelectedRule(null);
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
                                                <td>{rule.workItemNo}</td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleRuleClick(rule)}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </a>
                                                </td>
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
                {/* Rule Details Popup */}
                {selectedRule && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-btn" onClick={closePopup}>
                                &times;
                            </button>
                            <h3 className="popup-title">
                                Audit Log for <strong>{selectedRule.ruleName}</strong>
                            </h3>
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Work Item No</th>
                                        <td>{selectedRule.workItemNo}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Name</th>
                                        <td>{selectedRule.ruleName}</td>
                                    </tr>
                                    <tr>
                                        <th>Owner Name</th>
                                        <td>{selectedRule.ownerName}</td>
                                    </tr>
                                    <tr>
                                        <th>Rule Category</th>
                                        <td>{selectedRule.ruleCategory}</td>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <td>{selectedRule.type}</td>
                                    </tr>
                                    <tr>
                                        <th>Requester Name</th>
                                        <td>{selectedRule.requesterName}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export const approvalRulesTableExport = connect(ms2p, md2p)(approvalRulesTable);


.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
}

.popup-title {
    text-align: center;
    margin-bottom: 20px;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    color: #ff0000;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #cc0000;
}





//////////////////////////update 1
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllApprovalRules } from '../../store/rules/selectors';
import { loadApprovalRulesList } from '../../store/rules/actionCreators';
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
        },
        dispatch
    );

export const approvalRulesTable = ({ 
    allApprovalRulesMeta, 
    dispatchLoadApprovalRulesList 
}) => {
    const page_size = 5; // Set page size here
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRule, setSelectedRule] = useState(null);

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

    // Handle pagination navigation
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rule name click
    const handleRuleClick = (rule) => {
        setSelectedRule(rule);
    };

    // Close the popup
    const closePopup = () => {
        setSelectedRule(null);
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
                                                <td>{rule.workItemNo}</td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={() => handleRuleClick(rule)}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </a>
                                                </td>
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
                {/* Rule Details Popup */}
                {selectedRule && (
                    <div className="popup">
                        <div className="popup-content">
                            <button className="close-btn" onClick={closePopup}>
                                &times;
                            </button>
                            <h3>Rule Details</h3>
                            <p><strong>Work Item No:</strong> {selectedRule.workItemNo}</p>
                            <p><strong>Rule Name:</strong> {selectedRule.ruleName}</p>
                            <p><strong>Owner Name:</strong> {selectedRule.ownerName}</p>
                            <p><strong>Rule Category:</strong> {selectedRule.ruleCategory}</p>
                            <p><strong>Type:</strong> {selectedRule.type}</p>
                            <p><strong>Requester Name:</strong> {selectedRule.requesterName}</p>
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export const approvalRulesTableExport = connect(ms2p, md2p)(approvalRulesTable);



.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

