//////////change 1 - saving approval list and pgination

export const HomePlain = (props) => {
  const {
    currentAppsPageNo,
    currentAppsPageNoApproval,
    searchedRulesMeta,
    allRulesMeta,
    dispatchLoadRulesList,
    dispatchLoadApprovalRulesList,
    allApprovalRulesMeta,
    dispatchSearchHomeAppsList,
    currentUser,
    dispatchLoadCurrentAppsPageNo,
    dispatchLoadCurrentAppsPageNoApproval,
    dispatchLoadCurrentAppsSearchTxt,
    currentAppsSearchTxt,
  } = props;

  const { roles } = currentUser.data;
  const role = roles[0];
  const [state, setState] = useState({
    currentPage: currentAppsPageNo,
    currentPageApproval: currentAppsPageNoApproval,
  });
  // Filter now is an object. Default to empty object.
  const [filter, setFilter] = useState(currentAppsSearchTxt || {});
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [currentPageBackup, setCurrentPageBackup] = useState(0);
  const [ruleSearching, setRuleSearching] = useState(false);

  useEffect(() => {
    if (currentAppsSearchTxt && Object.keys(currentAppsSearchTxt).length > 0) {
      dispatchSearchHomeAppsList(filter, state.currentPage + 1, PAGE_SIZE, role, true);
      setSearchEnabled(true);
    } else {
      dispatchLoadRulesList(state.currentPage + 1, PAGE_SIZE, role);
    }
  }, [role, state.currentPage, currentAppsSearchTxt]);

  useEffect(() => {
    dispatchLoadApprovalRulesList(state.currentPageApproval + 1, PAGE_SIZE);
  }, [role, state.currentPageApproval]);

  const handlePageChange = (newPageBase1) => {
    setState(prevState => ({
      ...prevState,
      currentPage: newPageBase1 - 1,
    }));
    if (searchEnabled) {
      dispatchSearchHomeAppsList(filter, newPageBase1, PAGE_SIZE, role, true);
    } else {
      dispatchLoadRulesList(newPageBase1, PAGE_SIZE, role);
    }
    dispatchLoadCurrentAppsPageNo(newPageBase1 - 1);
  };

  const handleApprovalPageChange = (newPageBase1) => {
    setState(prevState => ({
      ...prevState,
      currentPageApproval: newPageBase1 - 1,
    }));
    dispatchLoadApprovalRulesList(newPageBase1, PAGE_SIZE, true);
    dispatchLoadCurrentAppsPageNoApproval(newPageBase1 - 1);
  };

  // Accept filters as an object instead of a single string
  const handleChangeSearch = async (newFilters) => {
    setSearchEnabled(true);
    setRuleSearching(true);
    const searchFilters = newFilters !== undefined ? newFilters : filter;
    if (searchFilters && Object.keys(searchFilters).length > 0) {
      dispatchLoadCurrentAppsSearchTxt(searchFilters);
      const status = await dispatchSearchHomeAppsList(searchFilters, 1, PAGE_SIZE, role, true);
      if (status) {
        setState(prevState => ({
          ...prevState,
          currentPage: 0,
        }));
        setRuleSearching(false);
      }
    }
  };

  // Update the filter object. If empty, reset searchEnabled.
  const handleChangeFilter = (inFilter) => {
    setFilter(inFilter);
    if (!inFilter || Object.keys(inFilter).length === 0) {
      setSearchEnabled(false);
      setState(prevState => ({
        ...prevState,
        currentPage: currentPageBackup,
      }));
      dispatchLoadCurrentAppsSearchTxt(null);
    }
  };

  const allRules = searchEnabled ? searchedRulesMeta : allRulesMeta;

  return (
    <PageWrapper>
      <div className="anim-slide-up">
        <div className="col-md-12 pad-1 card-rounded">
          <ModuleWrapper
            {...allRules}
            whenError={() => (<ErrorComponent error={allRules.error} />)}
            whenLoaded={(rulesList) => (
              <React.Fragment>
                <RulesListTable
                  rulesList={rulesList}
                  total={allRules.total}
                  roles={roles}
                  currentPage={state.currentPage}
                  handlePageChange={handlePageChange}
                  dataAsOfDate={allRules.dataAsOfDate}
                  filter={filter}
                  handleChangeSearch={handleChangeSearch}
                  handleChangeFilter={handleChangeFilter}
                  ruleSearching={ruleSearching}
                  searchEnabled={searchEnabled}
                />
              </React.Fragment>
            )}
          />
        </div>
        {/* ApprovalList part is unchanged */}
        <div className="col-md-12 pad-1 card-rounded margin-2-t">
          <ModuleWrapper
            {...allApprovalRulesMeta}
            whenError={() => (<ErrorComponent error={allApprovalRulesMeta.error} />)}
            whenLoaded={(appsList) => (
              <React.Fragment>
                <ApprovalsListTable
                  appsList={appsList}
                  total={allApprovalRulesMeta.total}
                  roles={roles}
                  currentPage={state.currentPageApproval}
                  handlePageChange={handleApprovalPageChange}
                />
              </React.Fragment>
            )}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

HomePlain.propTypes = {
  allRulesMeta: PropTypes.object,
  allApprovalRulesMeta: PropTypes.object,
  dispatchLoadRulesList: PropTypes.func.isRequired,
  dispatchLoadApprovalRulesList: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  searchedRulesMeta: PropTypes.object,
  dispatchLoadCurrentAppsPageNo: PropTypes.func.isRequired,
  dispatchLoadCurrentAppsPageNoApproval: PropTypes.func.isRequired,
  currentAppsPageNo: PropTypes.number,
  currentAppsPageNoApproval: PropTypes.number,
  dispatchLoadCurrentAppsSearchTxt: PropTypes.func.isRequired,
  currentAppsSearchTxt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dispatchLoadCurrentEntimsSearchTxt: PropTypes.func.isRequired,
};

HomePlain.defaultProps = {
  currentAppsPageNo: 0,
  currentAppsPageNoApproval: 0,
  currentAppsSearchTxt: {},
};

export const Home = connect(ms2p, md2p)(HomePlain);



import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paginator } from '../Common/Paginator';
import { getPathCreateNewRule } from '../getPaths';
import { MSG_NO_APP_RECORDS_SEARCH, PAGE_SIZE } from './constants';
import { RuleNoField } from "./RuleNoField";
import { RuleStatusField } from './RuleStatusField';
import { RuleStateField } from "./RuleStateField";
import { RuleNameField } from './RuleNameField';
import { RuleOwnerField } from './RuleOwnerField';
import { RuleCategoryField } from './RuleCategoryField';
import { RuleTypeField } from './RuleTypeField';

export const RulesListTable = (props) => {
  const {
    rulesList,
    currentPage,
    total,
    handlePageChange,
    dataAsOfDate,
    handleChangeSearch,
    handleChangeFilter,
    ruleSearching,
    searchEnabled,
    roles,
  } = props;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showPaginator = total > PAGE_SIZE;

  // Local state for filter inputs (one per column)
  const [localFilters, setLocalFilters] = useState({
    ruleNo: "",
    status: "",
    state: "",
    name: "",
    owner: "",
    category: "",
    type: ""
  });

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters and pass an empty object upward
  const handleClearFilters = () => {
    const cleared = {
      ruleNo: "",
      status: "",
      state: "",
      name: "",
      owner: "",
      category: "",
      type: ""
    };
    setLocalFilters(cleared);
    handleChangeFilter({});
  };

  // Build the filter object from non-empty values and pass it upward
  const handleResultFilters = () => {
    const filterObject = {};
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key]) {
        filterObject[key] = localFilters[key];
      }
    });
    handleChangeFilter(filterObject);
    handleChangeSearch(filterObject);
  };

  return (
    <div className="row pad-0-t">
      <table className="table">
        <thead>
          {/* Heading row for column titles */}
          <tr>
            <th>Rule No.</th>
            <th>Status</th>
            <th>State</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Category</th>
            <th>Type</th>
          </tr>
          {/* Filter row with input/select controls */}
          <tr>
            <th>
              <input
                type="number"
                placeholder="Rule No"
                value={localFilters.ruleNo}
                onChange={(e) => handleFilterChange('ruleNo', e.target.value)}
                className="form-control"
              />
            </th>
            <th>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-control"
              >
                <option value="">Status</option>
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Deactivate">Deactivate</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="form-control"
              >
                <option value="">State</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                placeholder="Name"
                value={localFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="form-control"
                pattern="[A-Za-z0-9 ]*"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Owner"
                value={localFilters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="form-control"
                pattern="^\\S*$"
              />
            </th>
            <th>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-control"
              >
                <option value="">Category</option>
                <option value="Application">Application</option>
                <option value="Organization">Organization</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-control"
              >
                <option value="">Type</option>
                <option value="Allow">Allow</option>
                <option value="Deny">Deny</option>
                <option value="Auto Provision">Auto Provision</option>
                <option value="Auto Revoke">Auto Revoke</option>
              </select>
            </th>
          </tr>
          {/* Action row for Clear and Result buttons, right-aligned */}
          <tr>
            <th colSpan="7" className="text-right">
              <button className="btn btn-sm btn-secondary mr-2" onClick={handleClearFilters}>
                Clear Filter
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleResultFilters}>
                Result
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {(!rulesList || rulesList.length === 0) && searchEnabled ? (
            <tr>
              <td colSpan="7">{MSG_NO_APP_RECORDS_SEARCH}</td>
            </tr>
          ) : (
            rulesList && rulesList.map((rule, index) => (
              <tr key={index}>
                <td>{<RuleNoField appDetails={rule} />}</td>
                <td>{<RuleStatusField appDetails={rule} />}</td>
                <td>{<RuleStateField appDetails={rule} />}</td>
                <td>{<RuleNameField appDetails={rule} />}</td>
                <td>{<RuleOwnerField appDetails={rule} />}</td>
                <td>{<RuleCategoryField appDetails={rule} />}</td>
                <td>{<RuleTypeField appDetails={rule} />}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showPaginator && (
        <Paginator
          key={`pg${currentPage}`}
          totalPages={totalPages}
          currentPage={currentPage + 1}
          handLePageChange={handlePageChange}
        />
      )}
      <h6 className="btn-tertiary mt-2" style={{ fontStyle: "italic" }}>
        Total Count of Rules: {total}
      </h6>
    </div>
  );
};

RulesListTable.propTypes = {
  rulesList: PropTypes.array,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  dataAsOfDate: PropTypes.string.isRequired,
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
};

RulesListTable.defaultProps = {
  rulesList: null,
};


//////dynamic filter

export const searchHomeRules = (
  filters, // now an object of field/value pairs
  pageno,
  pagesize,
  role,
  forceFetch = false
) =>
  LoadResource({
    action: ACTIONS.searchHomeRules,
    apiUrl: `${apiUrl}v1/rules?${qs.stringify({ pageno, pagesize, ...filters })}`,
    forceFetch,
    path: ['homeRulesSearchList', 'all', 'search'],
    datapath: ['homeRulesSearchList', 'all', 'search', 'data'],
  });




export const HomePlain = (props) => {
  const {
    currentAppsPageNo,
    currentAppsPageNoApproval,
    searchedRulesMeta,
    allRulesMeta,
    dispatchLoadRulesList,
    dispatchLoadApprovalRulesList,
    allApprovalRulesMeta,
    dispatchSearchHomeAppsList,
    currentUser,
    dispatchLoadCurrentAppsPageNo,
    dispatchLoadCurrentAppsPageNoApproval,
    dispatchLoadCurrentAppsSearchTxt,
    currentAppsSearchTxt,
  } = props;

  const { roles } = currentUser.data;
  const role = roles[0];
  const [state, setState] = useState({
    currentPage: currentAppsPageNo,
    currentPageApproval: currentAppsPageNoApproval,
  });
  // Filter is now an object (empty by default)
  const [filter, setFilter] = useState(currentAppsSearchTxt || {});
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [currentPageBackup, setCurrentPageBackup] = useState(0);
  const [currentPageBackupApproval, setCurrentPageBackupApproval] = useState(0);
  const [ruleSearching, setRuleSearching] = useState(false);

  useEffect(() => {
    if (currentAppsSearchTxt && Object.keys(currentAppsSearchTxt).length > 0) {
      dispatchSearchHomeAppsList(filter, state.currentPage + 1, PAGE_SIZE, role, true);
      setSearchEnabled(true);
    } else {
      dispatchLoadRulesList(state.currentPage + 1, PAGE_SIZE, role);
    }
  }, [role, state.currentPage, currentAppsSearchTxt]);

  useEffect(() => {
    dispatchLoadApprovalRulesList(state.currentPageApproval + 1, PAGE_SIZE);
  }, [role, state.currentPageApproval]);

  // Accept filters as an object
  const handleChangeSearch = async (newFilters) => {
    setSearchEnabled(true);
    setRuleSearching(true);
    const searchFilters = newFilters !== undefined ? newFilters : filter;
    if (searchFilters && Object.keys(searchFilters).length > 0) {
      dispatchLoadCurrentAppsSearchTxt(searchFilters);
      const status = await dispatchSearchHomeAppsList(searchFilters, 1, PAGE_SIZE, role, true);
      if (status) {
        setState(prevState => ({
          ...prevState,
          currentPage: 0,
        }));
        setCurrentPageBackup(state.currentPage);
        setRuleSearching(false);
      }
    }
  };

  const handleChangeFilter = (inFilter) => {
    setFilter(inFilter);
    if (!inFilter || Object.keys(inFilter).length === 0) {
      setSearchEnabled(false);
      setState(prevState => ({
        ...prevState,
        currentPage: currentPageBackup,
      }));
      dispatchLoadCurrentAppsSearchTxt(null);
    }
  };

  const allRules = searchEnabled ? searchedRulesMeta : allRulesMeta;

  return (
    <PageWrapper>
      <div className="anim-slide-up">
        <div className="col-md-12 pad-1 card-rounded">
          <ModuleWrapper
            {...allRules}
            whenError={() => (<ErrorComponent error={allRules.error} />)}
            whenLoaded={(rulesList) => (
              <React.Fragment>
                <RulesListTable
                  rulesList={rulesList}
                  total={allRules.total}
                  roles={roles}
                  currentPage={state.currentPage}
                  handlePageChange={handlePageChange}
                  dataAsOfDate={allRules.dataAsOfDate}
                  filter={filter}
                  handleChangeSearch={handleChangeSearch}
                  handleChangeFilter={handleChangeFilter}
                  ruleSearching={ruleSearching}
                  searchEnabled={searchEnabled}
                />
              </React.Fragment>
            )}
          />
        </div>
        <div className="col-md-12 pad-1 card-rounded margin-2-t">
          <ModuleWrapper
            {...allApprovalRulesMeta}
            whenError={() => (<ErrorComponent error={allApprovalRulesMeta.error} />)}
            whenLoaded={(appsList) => (
              <React.Fragment>
                <ApprovalsListTable
                  appsList={appsList}
                  total={allApprovalRulesMeta.total}
                  roles={roles}
                  currentPage={state.currentPageApproval}
                  handlePageChange={handleApprovalPageChange}
                />
              </React.Fragment>
            )}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

HomePlain.propTypes = {
  allRulesMeta: PropTypes.object,
  allApprovalRulesMeta: PropTypes.object,
  dispatchLoadRulesList: PropTypes.func.isRequired,
  dispatchLoadApprovalRulesList: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  searchedRulesMeta: PropTypes.object,
  dispatchLoadCurrentAppsPageNo: PropTypes.func.isRequired,
  dispatchLoadCurrentAppsPageNoApproval: PropTypes.func.isRequired,
  currentAppsPageNo: PropTypes.number,
  currentAppsPageNoApproval: PropTypes.number,
  dispatchLoadCurrentAppsSearchTxt: PropTypes.func.isRequired,
  currentAppsSearchTxt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  dispatchLoadCurrentEntimsSearchTxt: PropTypes.func.isRequired,
};

HomePlain.defaultProps = {
  currentAppsPageNo: 0,
  currentAppsPageNoApproval: 0,
  currentAppsSearchTxt: {},
};

export const Home = connect(ms2p, md2p)(HomePlain);





import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paginator } from '../Common/Paginator';
import { getPathCreateNewRule } from '../getPaths';
import { MSG_NO_APP_RECORDS_SEARCH, PAGE_SIZE } from './constants';
import { RuleNoField } from "./RuleNoField";
import { RuleStatusField } from './RuleStatusField';
import { RuleStateField } from "./RuleStateField";
import { RuleNameField } from './RuleNameField';
import { RuleOwnerField } from './RuleOwnerField';
import { RuleCategoryField } from './RuleCategoryField';
import { RuleTypeField } from './RuleTypeField';

export const RulesListTable = (props) => {
  const {
    rulesList,
    currentPage,
    total,
    handlePageChange,
    dataAsOfDate,
    handleChangeSearch,
    handleChangeFilter,
    ruleSearching,
    searchEnabled,
    roles,
  } = props;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showPaginator = total > PAGE_SIZE;

  // Local state for filter inputs
  const [localFilters, setLocalFilters] = useState({
    ruleNo: "",
    status: "",
    state: "",
    name: "",
    owner: "",
    category: "",
    type: ""
  });

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear filters and pass an empty object upward
  const handleClearFilters = () => {
    const cleared = {
      ruleNo: "",
      status: "",
      state: "",
      name: "",
      owner: "",
      category: "",
      type: ""
    };
    setLocalFilters(cleared);
    handleChangeFilter({});
  };

  // Build the filter object from non-empty values and pass it upward
  const handleResultFilters = () => {
    const filterObject = {};
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key]) {
        filterObject[key] = localFilters[key];
      }
    });
    handleChangeFilter(filterObject);
    handleChangeSearch(filterObject);
  };

  return (
    <div className="row pad-0-t">
      <table className="table">
        <thead>
          {/* Heading row for column titles */}
          <tr>
            <th>Rule No.</th>
            <th>Status</th>
            <th>State</th>
            <th>Name</th>
            <th>Owner</th>
            <th>Category</th>
            <th>Type</th>
          </tr>
          {/* Filter row with input/select controls */}
          <tr>
            <th>
              <input
                type="number"
                placeholder="Rule No"
                value={localFilters.ruleNo}
                onChange={(e) => handleFilterChange('ruleNo', e.target.value)}
                className="form-control"
              />
            </th>
            <th>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-control"
              >
                <option value="">Status</option>
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Deactivate">Deactivate</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="form-control"
              >
                <option value="">State</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                placeholder="Name"
                value={localFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="form-control"
                pattern="[A-Za-z0-9 ]*"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Owner"
                value={localFilters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="form-control"
                pattern="^\\S*$"
              />
            </th>
            <th>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-control"
              >
                <option value="">Category</option>
                <option value="Application">Application</option>
                <option value="Organization">Organization</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-control"
              >
                <option value="">Type</option>
                <option value="Allow">Allow</option>
                <option value="Deny">Deny</option>
                <option value="Auto Provision">Auto Provision</option>
                <option value="Auto Revoke">Auto Revoke</option>
              </select>
            </th>
          </tr>
          {/* Action row for Clear and Result buttons */}
          <tr>
            <th colSpan="7" className="text-right">
              <button className="btn btn-sm btn-secondary mr-2" onClick={handleClearFilters}>
                Clear Filter
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleResultFilters}>
                Result
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {(!rulesList || rulesList.length === 0) && searchEnabled ? (
            <tr>
              <td colSpan="7">{MSG_NO_APP_RECORDS_SEARCH}</td>
            </tr>
          ) : (
            rulesList && rulesList.map((rule, index) => (
              <tr key={index}>
                <td>{<RuleNoField appDetails={rule} />}</td>
                <td>{<RuleStatusField appDetails={rule} />}</td>
                <td>{<RuleStateField appDetails={rule} />}</td>
                <td>{<RuleNameField appDetails={rule} />}</td>
                <td>{<RuleOwnerField appDetails={rule} />}</td>
                <td>{<RuleCategoryField appDetails={rule} />}</td>
                <td>{<RuleTypeField appDetails={rule} />}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showPaginator && (
        <Paginator
          key={`pg${currentPage}`}
          totalPages={totalPages}
          currentPage={currentPage + 1}
          handLePageChange={handlePageChange}
        />
      )}
      <h6 className="btn-tertiary mt-2" style={{ fontStyle: "italic" }}>
        Total Count of Rules: {total}
      </h6>
    </div>
  );
};

RulesListTable.propTypes = {
  rulesList: PropTypes.array,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  dataAsOfDate: PropTypes.string.isRequired,
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
};

RulesListTable.defaultProps = {
  rulesList: null,
};


/////////////////2nd attemp filter withintable header

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paginator } from '../Common/Paginator';
import { getPathCreateNewRule } from '../getPaths';
import { MSG_NO_APP_RECORDS_SEARCH, PAGE_SIZE } from './constants';
import { RuleNoField } from "./RuleNoField";
import { RuleStatusField } from './RuleStatusField';
import { RuleStateField } from "./RuleStateField";
import { RuleNameField } from './RuleNameField';
import { RuleOwnerField } from './RuleOwnerField';
import { RuleCategoryField } from './RuleCategoryField';
import { RuleTypeField } from './RuleTypeField';

export const TABLE_LABELS = {
  ruleNo: 'Rule No. ',
  Name: 'Name',
  owner: 'Owner',
  category: 'Category',
  accessType: 'Type',
  status: 'Status',
  state: 'State',
  action: 'Action',
};

export const columns = [
  {
    title: TABLE_LABELS.ruleNo,
    value: (ruleDetails) => <RuleNoField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.status,
    value: (ruleDetails) => <RuleStatusField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.state,
    value: (ruleDetails) => <RuleStateField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.Name,
    value: (ruleDetails) => <RuleNameField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.owner,
    value: (ruleDetails) => <RuleOwnerField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.category,
    value: (ruleDetails) => <RuleCategoryField appDetails={ruleDetails} />,
  },
  {
    title: TABLE_LABELS.accessType,
    value: (ruleDetails) => <RuleTypeField appDetails={ruleDetails} />,
  },
];

export const RulesListTable = (props) => {
  const {
    rulesList,
    currentPage,
    total,
    handlePageChange,
    dataAsOfDate,
    handleChangeSearch,
    handleChangeFilter,
    ruleSearching,
    searchEnabled,
    roles,
  } = props;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showPaginator = total > PAGE_SIZE;

  // Local state for each of the 7 filter inputs
  const [localFilters, setLocalFilters] = useState({
    ruleNo: "",
    status: "",
    state: "",
    name: "",
    owner: "",
    category: "",
    type: ""
  });

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters and notify the parent with an empty string.
  const handleClearFilters = () => {
    const cleared = {
      ruleNo: "",
      status: "",
      state: "",
      name: "",
      owner: "",
      category: "",
      type: ""
    };
    setLocalFilters(cleared);
    handleChangeFilter("");
  };

  // Build the filter string (e.g., "ruleNo=100&status=Approved&name=shiv") and notify parent.
  const handleResultFilters = () => {
    const filterParts = [];
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key]) {
        filterParts.push(`${key}=${encodeURIComponent(localFilters[key])}`);
      }
    });
    const filterString = filterParts.join("&");
    handleChangeFilter(filterString);
    handleChangeSearch(filterString);
  };

  // When no data is found (and search is active), render a table with the filter row and a "no records" row.
  if ((!rulesList || rulesList.length === 0) && searchEnabled) {
    return (
      <div className="border">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="number"
                  placeholder="Rule No"
                  value={localFilters.ruleNo}
                  onChange={(e) => handleFilterChange('ruleNo', e.target.value)}
                  className="form-control"
                />
              </th>
              <th>
                <select
                  value={localFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="form-control"
                >
                  <option value="">Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Draft">Draft</option>
                  <option value="Deactivate">Deactivate</option>
                </select>
              </th>
              <th>
                <select
                  value={localFilters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="form-control"
                >
                  <option value="">State</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Name"
                  value={localFilters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="form-control"
                  pattern="[A-Za-z0-9 ]*"
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Owner"
                  value={localFilters.owner}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                  className="form-control"
                  pattern="^\\S*$"
                />
              </th>
              <th>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="form-control"
                >
                  <option value="">Category</option>
                  <option value="Application">Application</option>
                  <option value="Organization">Organization</option>
                </select>
              </th>
              <th>
                <select
                  value={localFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="form-control"
                >
                  <option value="">Type</option>
                  <option value="Allow">Allow</option>
                  <option value="Deny">Deny</option>
                  <option value="Auto Provision">Auto Provision</option>
                  <option value="Auto Revoke">Auto Revoke</option>
                </select>
              </th>
            </tr>
            <tr>
              <th colSpan="7">
                <button className="btn btn-secondary" onClick={handleClearFilters}>
                  Clear Filter
                </button>
                <button className="btn btn-primary ml-2" onClick={handleResultFilters}>
                  Result
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7">{MSG_NO_APP_RECORDS_SEARCH}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="row pad-0-t">
      {/* Custom table with filter row as the header */}
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="number"
                placeholder="Rule No"
                value={localFilters.ruleNo}
                onChange={(e) => handleFilterChange('ruleNo', e.target.value)}
                className="form-control"
              />
            </th>
            <th>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-control"
              >
                <option value="">Status</option>
                <option value="Approved">Approved</option>
                <option value="Draft">Draft</option>
                <option value="Deactivate">Deactivate</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="form-control"
              >
                <option value="">State</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="Inactive">Inactive</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                placeholder="Name"
                value={localFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="form-control"
                pattern="[A-Za-z0-9 ]*"
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Owner"
                value={localFilters.owner}
                onChange={(e) => handleFilterChange('owner', e.target.value)}
                className="form-control"
                pattern="^\\S*$"
              />
            </th>
            <th>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-control"
              >
                <option value="">Category</option>
                <option value="Application">Application</option>
                <option value="Organization">Organization</option>
              </select>
            </th>
            <th>
              <select
                value={localFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-control"
              >
                <option value="">Type</option>
                <option value="Allow">Allow</option>
                <option value="Deny">Deny</option>
                <option value="Auto Provision">Auto Provision</option>
                <option value="Auto Revoke">Auto Revoke</option>
              </select>
            </th>
          </tr>
          <tr>
            <th colSpan="7">
              <button className="btn btn-secondary" onClick={handleClearFilters}>
                Clear Filter
              </button>
              <button className="btn btn-primary ml-2" onClick={handleResultFilters}>
                Result
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rulesList && rulesList.map((rule, index) => (
            <tr key={index}>
              <td>{columns[0].value(rule)}</td>
              <td>{columns[1].value(rule)}</td>
              <td>{columns[2].value(rule)}</td>
              <td>{columns[3].value(rule)}</td>
              <td>{columns[4].value(rule)}</td>
              <td>{columns[5].value(rule)}</td>
              <td>{columns[6].value(rule)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPaginator && (
        <Paginator
          key={`pg${currentPage}`}
          totalPages={totalPages}
          currentPage={currentPage + 1}
          handLePageChange={handlePageChange}
        />
      )}
      <h6 className="btn-tertiary margin-1-l" style={{ fontStyle: "italic" }}>
        Total Count of Rules : {total}
      </h6>
    </div>
  );
};

RulesListTable.propTypes = {
  rulesList: PropTypes.array,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  dataAsOfDate: PropTypes.string.isRequired,
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
};

RulesListTable.defaultProps = {
  rulesList: null,
};

//////////////////////////////1st attempt
export const HomePlain = (props) => {
  const {
    currentAppsPageNo,
    currentAppsPageNoApproval,
    searchedRulesMeta,
    allRulesMeta,
    dispatchLoadRulesList,
    dispatchLoadApprovalRulesList,
    allApprovalRulesMeta,
    dispatchSearchHomeAppsList,
    currentUser,
    dispatchLoadCurrentAppsPageNo,
    dispatchLoadCurrentAppsPageNoApproval,
    dispatchLoadCurrentAppsSearchTxt,
    currentAppsSearchTxt,
  } = props;

  const { roles } = currentUser.data;
  const role = roles[0];
  const [state, setState] = useState({
    currentPage: currentAppsPageNo,
    currentPageApproval: currentAppsPageNoApproval,
  });
  const [filter, setFilter] = useState(currentAppsSearchTxt);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [currentPageBackup, setCurrentPageBackup] = useState(0);
  const [currentPageBackupApproval, setCurrentPageBackupApproval] = useState(0);
  const [ruleSearching, setRuleSearching] = useState(false);

  useEffect(() => {
    if (currentAppsSearchTxt) {
      dispatchSearchHomeAppsList(filter, state.currentPage + 1, PAGE_SIZE, role, true);
      setSearchEnabled(true);
    } else {
      dispatchLoadRulesList(state.currentPage + 1, PAGE_SIZE, role);
    }
  }, [role, state.currentPage, currentAppsSearchTxt]);

  useEffect(() => {
    dispatchLoadApprovalRulesList(state.currentPageApproval + 1, PAGE_SIZE);
  }, [role, state.currentPageApproval]);

  const handlePageChange = (newPageBase1) => {
    setState(prevState => ({
      ...prevState,
      currentPage: newPageBase1 - 1,
    }));
    if (searchEnabled) {
      setCurrentPageBackup(currentPageBackup);
      dispatchSearchHomeAppsList(filter, newPageBase1, PAGE_SIZE, role, true);
    } else {
      dispatchLoadRulesList(newPageBase1, PAGE_SIZE, role);
    }
    dispatchLoadCurrentAppsPageNo(newPageBase1 - 1);
  };

  const handleApprovalPageChange = (newPageBase1) => {
    setState(prevState => ({
      ...prevState,
      currentPageApproval: newPageBase1 - 1,
    }));
    dispatchLoadApprovalRulesList(newPageBase1, PAGE_SIZE, true);
    dispatchLoadCurrentAppsPageNoApproval(newPageBase1 - 1);
  };

  // UPDATED: Allow an optional newFilter string passed from the child.
  const handleChangeSearch = async (newFilter) => {
    setSearchEnabled(true);
    setRuleSearching(true);
    const searchFilter = newFilter !== undefined ? newFilter : filter;
    if (searchFilter) {
      dispatchLoadCurrentAppsSearchTxt(searchFilter);
      const status = await dispatchSearchHomeAppsList(searchFilter, 1, PAGE_SIZE, role, true);
      if (status) {
        setState(prevState => ({
          ...prevState,
          currentPage: 0,
        }));
        setCurrentPageBackup(state.currentPage);
        setRuleSearching(false);
      }
    }
  };

  const handleChangeFilter = (inFilter) => {
    setFilter(inFilter);
    if (!inFilter) {
      setSearchEnabled(false);
      setState(prevState => ({
        ...prevState,
        currentPage: currentPageBackup,
      }));
      dispatchLoadCurrentAppsSearchTxt(null);
    }
  };

  const allRules = searchEnabled ? searchedRulesMeta : allRulesMeta;

  return (
    <PageWrapper>
      <div className="anim-slide-up">
        <div className="col-md-12 pad-1 card-rounded">
          <ModuleWrapper
            {...allRules}
            whenError={() => (<ErrorComponent error={allRules.error} />)}
            whenLoaded={(rulesList) => (
              <Fragment>
                <RulesListTable
                  rulesList={rulesList}
                  total={allRules.total}
                  roles={roles}
                  currentPage={state.currentPage}
                  handlePageChange={handlePageChange}
                  dataAsOfDate={allRules.dataAsOfDate}
                  filter={filter}
                  handleChangeSearch={handleChangeSearch}
                  handleChangeFilter={handleChangeFilter}
                  ruleSearching={ruleSearching}
                  searchEnabled={searchEnabled}
                />
              </Fragment>
            )}
          />
        </div>
        <div className="col-md-12 pad-1 card-rounded margin-2-t">
          <ModuleWrapper
            {...allApprovalRulesMeta}
            whenError={() => (<ErrorComponent error={allApprovalRulesMeta.error} />)}
            whenLoaded={(appsList) => (
              <Fragment>
                <ApprovalsListTable
                  appsList={appsList}
                  total={allApprovalRulesMeta.total}
                  roles={roles}
                  currentPage={state.currentPageApproval}
                  handlePageChange={handleApprovalPageChange}
                />
              </Fragment>
            )}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

HomePlain.propTypes = {
  allRulesMeta: PropTypes.object,
  allApprovalRulesMeta: PropTypes.object,
  dispatchLoadRulesList: PropTypes.func.isRequired,
  dispatchLoadApprovalRulesList: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  searchedRulesMeta: PropTypes.object,
  dispatchLoadCurrentAppsPageNo: PropTypes.func.isRequired,
  dispatchLoadCurrentAppsPageNoApproval: PropTypes.func.isRequired,
  currentAppsPageNo: PropTypes.number,
  currentAppsPageNoApproval: PropTypes.number,
  dispatchLoadCurrentAppsSearchTxt: PropTypes.func.isRequired,
  currentAppsSearchTxt: PropTypes.string,
  dispatchLoadCurrentEntimsSearchTxt: PropTypes.func.isRequired,
};

HomePlain.defaultProps = {
  currentAppsPageNo: 0,
  currentAppsPageNoApproval: 0,
  currentAppsSearchTxt: '',
};

export const Home = connect(ms2p, md2p)(HomePlain);


import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { DataTable } from 'axp-base';
import { Column, Heading } from 'iam-react-components';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  DataTableV2,
  DataTableBodyV2,
  DataTableRowV2,
  DataTableCelLV2,
  DataTableHeadCeLlV2,
  DataTableHeadV2,
} from '@americanexpress/dls-react';
import { RuleNameField } from './RuleNameField';
import { RuleOwnerField } from './RuleOwnerField';
import { RuleCategoryField } from './RuleCategoryField';
import { RuleTypeField } from './RuleTypeField';
import { RuleStatusField } from './RuleStatusField';
import { MSG_NO_APP_RECORDS_SEARCH, PAGE_SIZE } from './constants';
import { Paginator } from '../Common/Paginator';
import { RulesListTableEmpty } from './RulesListTableEmpty';
import { getPathCreateNewRule } from '../getPaths';
import { RuleNoField } from "./RuleNoField";
import { RuleStateField } from "./RuleStateField";

export const TABLE_LABELS = {
  ruleNo: 'Rule No. ',
  Name: 'Name',
  owner: 'Owner',
  category: 'Category',
  accessType: 'Type',
  status: 'status',
  state: 'state',
  action: 'Action',
};

export const columns = [
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 1, visibility: true } },
    title: TABLE_LABELS.ruleNo,
    value: (ruleDetails) => <RuleNoField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.status,
    value: (ruleDetails) => <RuleStatusField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 1, visibility: true } },
    title: TABLE_LABELS.state,
    value: (ruleDetails) => <RuleStateField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 4, visibility: true } },
    title: TABLE_LABELS.Name,
    value: (ruleDetails) => <RuleNameField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.owner,
    value: (ruleDetails) => <RuleOwnerField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.category,
    value: (ruleDetails) => <RuleCategoryField appDetails={ruleDetails} />,
  },
  {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.accessType,
    value: (ruleDetails) => <RuleTypeField appDetails={ruleDetails} />,
  },
];

export const RulesListTable = (props) => {
  const {
    rulesList,
    currentPage,
    total,
    handlePageChange,
    dataAsOfDate,
    handleChangeSearch,
    handleChangeFilter,
    ruleSearching,
    searchEnabled,
    roles,
  } = props;

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const showPaginator = total > PAGE_SIZE;

  // Local state for each of the 7 filter inputs
  const [localFilters, setLocalFilters] = useState({
    ruleNo: "",
    status: "",
    state: "",
    name: "",
    owner: "",
    category: "",
    type: ""
  });

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters and send an empty string upward
  const handleClearFilters = () => {
    setLocalFilters({
      ruleNo: "",
      status: "",
      state: "",
      name: "",
      owner: "",
      category: "",
      type: ""
    });
    handleChangeFilter("");
  };

  // Build the filter string and trigger search in the parent
  const handleResultFilters = () => {
    const filterParts = [];
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key]) {
        filterParts.push(`${key}=${encodeURIComponent(localFilters[key])}`);
      }
    });
    const filterString = filterParts.join("&");
    handleChangeFilter(filterString);
    handleChangeSearch(filterString);
  };

  const noSearchRecords = () => (
    <div>
      <DataTableV2>
        <DataTableHeadV2>
          <DataTableRowV2>
            <DataTableHeadCeLlV2>Rule No .</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>Status</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>State</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>Name</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>Owner</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>Category</DataTableHeadCeLlV2>
            <DataTableHeadCeLlV2>Type</DataTableHeadCeLlV2>
          </DataTableRowV2>
        </DataTableHeadV2>
        <DataTableBodyV2>
          <DataTableRowV2>
            <DataTableCelLV2 colSpan="7">{MSG_NO_APP_RECORDS_SEARCH}</DataTableCelLV2>
          </DataTableRowV2>
        </DataTableBodyV2>
      </DataTableV2>
    </div>
  );

  return (
    <div className="row pad-0-t">
      <div className="col-md-12 margin-0-b margin-2-t">
        <h2 className="heading-5 text-align-left border-dark-b">Rules</h2>
      </div>
      {roles[0] === 'admin' && (
        <div className="col-md-12 margin-2-t">
          <Link
            className="btn btn-block btn-primary"
            to={getPathCreateNewRule}
          >
            <span className="font-weight-medium">Create Rule</span>
          </Link>
        </div>
      )}
      {/* NEW FILTER ROW */}
      <div className="col-md-12 pad-1-lr pad-1-tb">
        <div className="row">
          <div className="col">
            <input
              type="number"
              placeholder="Rule No"
              value={localFilters.ruleNo}
              onChange={(e) => handleFilterChange('ruleNo', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col">
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-control"
            >
              <option value="">Status</option>
              <option value="Approved">Approved</option>
              <option value="Draft">Draft</option>
              <option value="Deactivate">Deactivate</option>
            </select>
          </div>
          <div className="col">
            <select
              value={localFilters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="form-control"
            >
              <option value="">State</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Name"
              value={localFilters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="form-control"
              pattern="[A-Za-z0-9 ]*"
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Owner"
              value={localFilters.owner}
              onChange={(e) => handleFilterChange('owner', e.target.value)}
              className="form-control"
              pattern="^\\S*$"
            />
          </div>
          <div className="col">
            <select
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-control"
            >
              <option value="">Category</option>
              <option value="Application">Application</option>
              <option value="Organization">Organization</option>
            </select>
          </div>
          <div className="col">
            <select
              value={localFilters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="form-control"
            >
              <option value="">Type</option>
              <option value="Allow">Allow</option>
              <option value="Deny">Deny</option>
              <option value="Auto Provision">Auto Provision</option>
              <option value="Auto Revoke">Auto Revoke</option>
            </select>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear Filter
            </button>
            <button className="btn btn-primary ml-2" onClick={handleResultFilters}>
              Result
            </button>
          </div>
        </div>
      </div>
      {/* TABLE DISPLAY */}
      <div className="col-md-12 pad-1-lr pad-1-tb">
        {((!rulesList || (rulesList && rulesList.length <= 0)) && searchEnabled) ? (
          <div className="border">{noSearchRecords()}</div>
        ) : (
          <div className="border">
            <DataTable
              key={`dt${currentPage}`}
              data={rulesList}
              columns={columns}
              selectAll={false}
            />
            {showPaginator && (
              <Paginator
                key={`pg${currentPage}`}
                totalPages={totalPages}
                currentPage={currentPage + 1}
                handLePageChange={handlePageChange}
              />
            )}
            <h6 className="btn-tertiary margin-1-l" style={{ fontStyle: "italic" }}>
              Total Count of Rules : {total}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

RulesListTable.propTypes = {
  rulesList: PropTypes.array,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  dataAsOfDate: PropTypes.string.isRequired,
  handleChangeSearch: PropTypes.func.isRequired,
  handleChangeFilter: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  ruleSearching: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
};

RulesListTable.defaultProps = {
  rulesList: null,
};




/////////////////////////////base serach
need code changes in below two files,
where parent homePlain calling indexRuleList with props and indexRuleList dsiaplays the list of Rules,
  so here we have to remove the old search input box with new filter row above the rule table, consider this as 1st Row,
 now the 1st row of the table will be consist of filters, verey cell of row can be act as filter 
and below to that row need two buttons clear Filter and Result
when click on clear button it will clear all filter and pass filter as empty
once click on Result the selected values from cell of row will collecteed as single string and pass to filter 
prop and passing same to HomePlain and when filter changes the new string will pass to handleChangeSearch method 
the string will be pass to filter as string formate is ruleNo=100&status=Approved&name=shiv
(here i selected only rule no, status and name)
we have 7 columns in table so 7 filters will be needed in 1st row
1. Rule no value will be text type only number
2. Status value will be dropdown selectable Approved, Draft, Deactivate
3. State will be dropdown Active, Disabled, Inactive
4. Name will text box avoid specal charecters
5. Owner will be text box avaoid spacel charceters
6. Category will be dropdwon Application and Oraganization
7. Type will be doropdown Allow, Deny, Auto Provision, Auto Revoke


//////////Parent component 

export const ms2p = (state)  => ({
    allRulesMeta: getAllRulesMeta(state),
    allApprovalRulesMeta: getAllApprovalRules(state),
    currentUser: getAEMUser(state),
    currentAppsPageNo: getCurrentAppsPageNo(state),
    currentAppsPageNoApproval: getCurrentAppsPageNoApproval(state),
    currentAppsSearchTxt: getCurrentAppsSearchTxt(state),
    searchedRulesMeta: getSearchHomeRulesMeta(state),
})
export const md2p = (dispatch)  => (bindActionCreators(  {
    dispatchLoadRulesList: loadRulesList,//loadAppsList
    dispatchLoadApprovalRulesList: loadApprovalRulesList,
    dispatchSearchHomeAppsList: searchHomeRules, //rule search -- handlePageChange searchHomeApps
    dispatchLoadCurrentAppsPageNo: loadCurrentAppsPageNo,
    dispatchLoadCurrentAppsPageNoApproval: loadCurrentAppsPageNoApproval,
    dispatchLoadCurrentAppsSearchTxt: loadCurrentAppsSearchTxt, //rule serach
    }, dispatch));
    export const initialState = {
    currentPage: 8,
    };
   
 export const HomePlain = (props) => {
    const {
    currentAppsPageNo,
    currentAppsPageNoApproval,
    searchedRulesMeta,
    allRulesMeta,
    dispatchLoadRulesList,
    dispatchLoadApprovalRulesList,
    allApprovalRulesMeta,
    dispatchSearchHomeAppsList,
    currentUser,
    dispatchLoadCurrentAppsPageNo,
    dispatchLoadCurrentAppsPageNoApproval,
    dispatchLoadCurrentAppsSearchTxt,
    currentAppsSearchTxt,
    } = props;

        const { roles } = currentUser.data;
        const role = roles[0];
        const [state , setState] = useState( {
        currentPage: currentAppsPageNo,
        currentPageApproval: currentAppsPageNoApproval,
        })
        const [filter, setFilter] = useState(currentAppsSearchTxt);
        const [searchEnabled  , setSearchEnabled] = useState( false);
        const [currentPageBackup , setCurrentPageBackup] = useState(  0);
        const [currentPageBackupApproval , setCurrentPageBackupApproval] = useState( 0);
        const [ruleSearching  , setRuleSearching] = useState(  false);

useEffect( ()  => {
        if (currentAppsSearchTxt) {
            dispatchSearchHomeAppsList(filter, state.currentPage + 1, PAGE_SIZE, role, true);
            setSearchEnabled( true);
        } else {
            dispatchLoadRulesList(state.currentPage + 1, PAGE_SIZE, role);
        }
        }, [role, state.currentPage, currentAppsSearchTxt]);

        useEffect( ()  => {
         dispatchLoadApprovalRulesList(state.currentPageApproval + 1, PAGE_SIZE);
        }, [role, state.currentPageApproval]);

        const handlePageChange = (newPageBase1)  => {
            setState(  prevState  => ({
                ... prevState,
                currentPage: newPageBase1-1,
            }));
                if (searchEnabled) {
                    setCurrentPageBackup(currentPageBackup);
                    dispatchSearchHomeAppsList(filter, newPageBase1, PAGE_SIZE, role, true);
                } else{
                    dispatchLoadRulesList(newPageBase1, PAGE_SIZE, role);
                }
            dispatchLoadCurrentAppsPageNo(newPageBase1 - 1);    
    };
    
   
    const handleApprovalPageChange = (newPageBase1)  => {
        setState(  prevState => ({
            ... prevState,
            currentPageApproval: newPageBase1-1,
        }));
        // if (searchEnabled) {
        // setCurrentPageBackupApproval(currentPageBackupApproval);
        // } else {
        dispatchLoadApprovalRulesList(newPageBase1, PAGE_SIZE, true);
        // }
        dispatchLoadCurrentAppsPageNoApproval(newPageBase1- 1);
    };

    const handleChangeSearch = async ()  => {
        setSearchEnabled(  true);
        setRuleSearching(  true);
        if (filter) {
            dispatchLoadCurrentAppsSearchTxt(filter);
            const status = await dispatchSearchHomeAppsList(filter, 1, PAGE_SIZE, role, true);
            if (status) {
                // setState(({ currentPage: 0 }));
                setState(  prevState => ({
                ... prevState,
                currentPage: 0,
                }));
                setCurrentPageBackup(state.currentPage);
                setRuleSearching( false);

            }
        }
    };

    const handleChangeFilter = (inFilter) => {
        setFilter(inFilter);
        if (!inFilter) {
        setSearchEnabled( false);
        // setState(({ currentPage: currentPageBackup }));
        setState( prevState  => ({
        ... prevState,
        currentPage: currentPageBackup,
        }));
        dispatchLoadCurrentAppsSearchTxt(null);
        }
    };
        const allRules = searchEnabled ? searchedRulesMeta : allRulesMeta;
        
 return (
        <PageWrapper>
            <div className="anim-slide-up">
                <div className="col-md-12 pad-1 card-rounded">
                <ModuleWrapper
                    { ... allRules}
                    whenError={() => (<ErrorComponent error={allRules.error} />)}
                    whenLoaded={(rulesList) => (
                        <Fragment>
                        <RulesListTable
                            rulesList={rulesList}
                            total={allRules.total}
                            roles={roles}
                            currentPage={state.currentPage}
                            handlePageChange={handLePageChange}
                            dataAsOfDate={allRules.dataAsOfDate}
                            filter={filter}
                            handleChangeSearch={handleChangeSearch}
                            handleChangeFilter={handleChangeFilter}
                            ruleSearching={ruleSearching}
                            searchEnabled={searchEnabled}
                            />
                            </Fragment>
                        )}

        />
        </div>
            <div className="col-md-12 pad-1 card-rounded margin-2-t">
                <ModuleWrapper
                    { ... allApprovalRulesMeta}
                    whenError={() => (<ErrorComponent error={allApprovalRulesMeta.error} />)}
                    whenLoaded={(appsList) => (
                        <Fragment>
                        <ApprovalsListTable
                            appsList={appsList}
                            total={allApprovalRulesMeta.total}
                            roles={roles}
                            currentPage={state.currentPageApproval}
                            handlePageChange={handleApprovalPageChange}

                         />

                  </Fragment>
                )}
                /></div>
                </div>
             </PageWrapper>
            );
        };


  HomePlain.propTypes = {
            // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
            allRulesMeta: PropTypes.object,
            allApprovalRulesMeta:PropTypes.object,
            dispatchLoadRulesList: PropTypes.func.isRequired,
            dispatchLoadApprovalRulesList: PropTypes.func.isRequired,
            // eslint-disable-next-line react/forbid-prop-types
            currentUser: PropTypes.object.isRequired,
            // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
            searchedRulesMeta: PropTypes.object,
            dispatchLoadCurrentAppsPageNo: PropTypes.func.isRequired,
            dispatchLoadCurrentAppsPageNoApproval: PropTypes.func.isRequired,
            currentAppsPageNo: PropTypes.number,
            currentAppsPageNoApproval: PropTypes.number,
            dispatchLoadCurrentAppsSearchTxt: PropTypes.func.isRequired,
            currentAppsSearchTxt: PropTypes.string,
            dispatchLoadCurrentEntimsSearchTxt: PropTypes.func.isRequired,
  };
   HomePlain.defaultProps = {
            currentAppsPageNo: 0,
            currentAppsPageNoApproval:0,
            currentAppsSearchTxt: '',
   };

           
 export const Home=  connect(ms2p, md2p)(HomePlain);

//Child Compopenet 
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import { DataTable, SearchInput } from 'axp-base';
import {Column, Heading} from 'iam-react-components';
import { Link } from 'react-router-dom';
import {
Tooltip,
DataTableV2,
DataTableBodyV2,
DataTableRowV2,
DataTableCelLV2,
DataTableHeadCeLlV2,
DataTableHeadV2,
} from '@americanexpress/dls-react';
import { RuleNameField } from './RuleNameField';
import { RuleOwnerField } from './RuleOwnerField';
import { RuleCategoryField } from './RuleCategoryField';
import { RuleTypeField } from './RuleTypeField';
import { RuleStatusField } from './RuleStatusField';

import {
MSG_NO_APP_RECORDS_SEARCH,
PAGE_SIZE,
} from './constants';
import { Paginator } from ' .. /Common/Paginator';
import { RulesListTableEmpty } from './RulesListTableEmpty';
import {getPathCreateNewRule} from " .. /getPaths";
import {RuleNoField} from "./RuleNoField";
import {RuleStateField} from "./RuleStateField";

export const TABLE_LABELS  = {
ruleNo: 'Rule No. ',
Name: 'Name',
owner: 'Owner',
category: 'Category',
accessType: 'Type',
status: 'status',
state: 'state',
action: 'Action',
}

export const columns  = [
    {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 1, visibility: true } },
    title: TABLE_LABELS.ruleNo,
    value: (ruleDetails) => <RuleNoField appDetails={ruleDetails} />,  
    },
    {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.status,
    value: (ruleDetails) => <RuleStatusField appDetails={ruleDetails} />,
    },
    {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 1, visibility: true } },
    title: TABLE_LABELS.state,
    value: (ruleDetails) => <RuleStateField appDetails={ruleDetails} />,
    },
    {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 4, visibility: true } },
    title: TABLE_LABELS. Name,
    value: (ruleDetails) => <RuleNameField appDetails={ruleDetails} />,
    },
    {
    className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.owner,
    value: (ruleDetails) => <RuleOwnerField appDetails={ruleDetails} />,
    },
    {
        className: 'pad-1',
    headerClassName: 'pad-1',
    layout: { md: { size: 2, visibility: true } },
    title: TABLE_LABELS.category,
    value: (ruleDetails) => <RuleCategoryField appDetails={ruleDetails} />,
    },
    {
        className: 'pad-1',
        headerClassName: 'pad-1',
        layout: { md: { size: 2, visibility: true } },
        title: TABLE_LABELS.accessType,
        value: (ruleDetails) => <RuleTypeField appDetails={ruleDetails} />,
    }
];

// eslint-disable-next-line complexitydispatchSearchHomeAppsList
export const RulesListTable = (props) => {
    const {
        rulesList, currentPage, total,
        handlePageChange, dataAs0fDate,
        filter, handleChangeSearch, handleChangeFilter, ruleSearching, searchEnabled, roles,
    } = props;

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const showPaginator  = (total > PAGE_SIZE);

    if ((!rulesList |I (rulesList && rulesList. length === 0)) && !searchEnabled) {
    return (
    <div>
    <div className="col-md-12 margin-1-b margin-2-t">
    <h2 className="heading-5 text-align-left border-dark-b">Rules</h2>
    </div>
    <RulesListTableEmpty />
        {(roles[0] === 'admin') && (
        <Link
        className="btn btn-block btn-primary margin-2-l margin-2-t margin-e-b"
        to={getPathCreateNewRule}
        >
        <span className="font-weight-medium">Create Rule</span>
        </Link>
    )}
    </div>);
    }
const noSearchRecords = () => (
    <div>
    <DataTableV2>
    <DataTableHeadV2>
    <DataTableRowV2>
        <DataTableHeadCellV2>Rule No .</DataTableHeadCellV2>
        <DataTableHeadCellV2>Status</DataTableHeadCellV2>
        <DataTableHeadCellV2>State</DataTableHeadCellV2>
        <DataTableHeadCellV2>Name</DataTableHeadCellV2>
        <DataTableHeadCellV2>Owner</DataTableHeadCellV2>
        <DataTableHeadCellV2>Category</DataTableHeadCellV2>
        <DataTableHeadCellV2>Type</DataTableHeadCellV2>
    </DataTableRowV2>
    </DataTableHeadV2>
    <DataTableBodyV2>
    <DataTableRowV2>
    <DataTableCellV2 colSpan="4">{MSG_NO_APP_RECORDS_SEARCH}</DataTableCellV2>
    </DataTableRowV2>
    </DataTableBodyV2>
    </DataTableV2>
    </div>
);

return (
<div className="row pad-0-t">
        <div className="col-md-12 margin-0-b margin-2-t">
            <div className="row align-items-center justify-content-between">

                </div>

                <h2 className="heading-5 text-align-left border-dark-b">Rules</h2>
        </div>
        <div className="col-md-12">
        <div className="row">
            <div className="col-md-8">
                <div className="row">
                    <div className="col-md-4">
                        <SearchInput
                            type="text"
                            id="entGroupSearch"
                            placeholder="Search Rule"
                            value={filter}
                            className="margin-0-b margin-e-l"
                            onSubmit={handleChangeSearch}
                            onChange={handleChangeFilter}
                            searching={ruleSearching}
                        />
            </div>
                <div className="col-md-2">
                {(roles[0] === 'admin') && (

                <Link
                    className="btn btn-block btn-primary margin-2-l margin-2-t margin-0-b"
                    to={getPathCreateNewRule}
                    >

                    <span className="font-weight-medium">Create Rule</span>
                </Link>
                    )}

            </div>

            </div>
                </div>

        </div>
        </div>
        <div className="col-md-12 pad-1-lr pad-1-tb">
               {
                        ((!rulesList || (rulesList && rulesList.length <= 0)) && searchEnabled)
                        ? (
                            <div className="border">
                                {noSearchRecords()}
                            </div>

                        )
                        :(

                        <div className="border">
                                <DataTable
                                    key={'dt${currentPage}'}
                                    data={rulesList}
                                    columns={columns}
                                    selectAll={false}
                                />
                        {showPaginator && (
                            <Paginator
                                key={`pg${currentPage}`}
                                totalPages={totalPages}
                                currentPage={currentPage + 1}
                                handLePageChange={handlePageChange}
                                />
                        )  }
                   <h6 className='btn-tertiary margin-1-l' style={{fontStyle: "italic"}}>Total Count of Rules : {total}</h6>
            </div>
                        )
                    }
         </div>
        </div>
                );
            };

RulesListTable.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    rulesList: PropTypes.array,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    // setState: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    dataAsOfDate: PropTypes.string.isRequired,
    handleChangeSearch: PropTypes.func.isRequired,
    handleChangeFilter: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    ruleSearching: PropTypes.bool.isRequired,
    searchEnabled: PropTypes.bool.isRequired,
    roles: PropTypes.array.isRequired,
};

RulesListTable.defaultProps = {
    rulesList: null,
    };

