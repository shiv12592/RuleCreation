import React from 'react';
import { connect } from 'react-redux';
import { getAllExecutionRules } from '../../store/rules/selectors';
import { PageWrapper } from '../Common/PageWrapper';
import ModuleWrapper from 'iam-react-components';
import ErrorComponent from '../Common/ErrorComponent';

// Map state to props
export const ms2p = (state) => ({
    allExecutionRulesMeta: getAllExecutionRules(state) || { loaded: true, data: [] },
});

// Map dispatch to props (can be empty if not needed)
export const md2p = () => ({});

export const executionRules = ({ allExecutionRulesMeta }) => {
    const handleRuleClick = (rule) => {
        console.log("Rule clicked:", rule);
        // Logic to open `attestAllByCheckBoxRowsExport` component
    };

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
export const executionRulesExport = connect(ms2p, md2p)(executionRules);
