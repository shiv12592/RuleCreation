import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllExecutionRules } from '../../store/rules/selectors';
import { PageWrapper } from '../Common/PageWrapper';
import ModuleWrapper from 'iam-react-components';
import ErrorComponent from '../Common/ErrorComponent';

// Map state to props
export const ms2p = (state) => ({
    allExecutionRulesMeta: getAllExecutionRules(state),
});

// Map dispatch to props (can be empty if not needed)
export const md2p = () => ({});

// Default data for demonstration purposes
const defaultExecutionRules = [
    {
        ruleNo: 1,
        ruleName: "Default Rule 1",
        ruleVersion: "1.0",
        executionCount: 100,
        type: "Type A",
        requesterName: "Requester A",
    },
    {
        ruleNo: 2,
        ruleName: "Default Rule 2",
        ruleVersion: "2.0",
        executionCount: 200,
        type: "Type B",
        requesterName: "Requester B",
    },
];

export const executionRules = ({ allExecutionRulesMeta }) => {
    const data = allExecutionRulesMeta?.data?.length
        ? allExecutionRulesMeta.data
        : defaultExecutionRules;

    const handleRuleClick = (rule) => {
        console.log("Rule clicked:", rule);
        // Logic to open `attestAllByCheckBoxRowsExport` component
        // Example: Update state or routing logic here
    };

    return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded margin-2-t">
                    <ModuleWrapper
                        {...allExecutionRulesMeta}
                        whenError={() => <ErrorComponent error={allExecutionRulesMeta?.error} />}
                        whenLoaded={() => (
                            <>
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
                                        {data.map((rule) => (
                                            <tr key={rule.ruleNo}>
                                                <td>{rule.ruleNo}</td>
                                                <td>
                                                    <a
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRuleClick(rule);
                                                        }}
                                                        className="text-primary"
                                                    >
                                                        {rule.ruleName}
                                                    </a>
                                                </td>
                                                <td>{rule.ruleVersion}</td>
                                                <td>{rule.executionCount}</td>
                                                <td>{rule.type}</td>
                                                <td>{rule.requesterName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

// Connect component to Redux
export const executionRulesExport = connect(ms2p, md2p)(executionRules);
