{/* in below code, dispatchLoadRulesList will be load initilally if dont have any currentAppsSearchTxt 
otherwise dispatchSearchHomeAppsList will load the list by passing the filter text got from searchInput,
right now giving error when i am searching the text in searchInput, the currentPageApproval sends undefined so that faces error,
 */}
 export const initialState: = {
  currentPage: 0,
 }
   
  export const HomePlain (props) => {

  const {
  currentAppsPageNo,
  currentAppsPageNoApproval,
  searchedRulesileta,
  allRulesMeta,
  dispatchLoadRulesList,
  dispatchLoadApprovalRulesList, 
  dispatchSearchHomeAppsList, currentUser,
  searchHomeAppsheta, dispatchLoadCurrentAppsPagello, dispatchLoadCurrentAppsSearchTxt,
  dispatchLoadCurrentAppsPageNoApproval,
  currentAppsSearchTxt,
  } = props;
  
  const { roles } = currentUser.data;
  const role = roles;
  const [state , setState] = useState( {
  currentPage: currentAppsPageNo,
  currentPageApproval: currentAppsPagelloApproval,
  });
  const [filter, setFilter] = useState(currentAppsSearchTxt);
  const [searchEnabled,  setSearchEnabled]= useState( false);
  const [currentPageBackup, setCurrentPageBackup ] = useState( 0);
  const [currentPageBackupApproval, setCurrentPageBackupApproval] = useState( 0);
  const [ruleSearching, setRulesearching]= useState( false);
  useEffect(  () => {
  if (currentAppsSearchTxt) {
  dispatchSearchHomeAppsList(filter, state.currentPage + 1, PAGE_SIZE, role, true);
  setSearchEnabled(true);
  } else {
    dispatchLoadRulesList(state.currentPage + 1, PAGE_SIZE);
  } 
},  [role, state.currentPage, currentAppsSearchTxt]);
  useEffect(() => {
  dispatchLoadApprovalRulesList(state.currentPageApproval + 1, PAGE_SIZE);
  }, (role, state.currentPageApproval));
  const handlePageChange = (newPageBase1) => {
  setState( prevState => ({  
  ...prevState,
  currentPage: neuPageBase1-1,
  }));
  
  if (searchEnabled) {
  setCurrentPageBackup (currentPageBackup);
  dispatchSearchliomeAppsList(filter, neuPageBasel, PAGE_SIZE, role, true);
  } else {
    dispatchLoadRulesList(nesPageBase1, PAGE SIZE, true);
  }
  dispatchLoadCurrentAppsPagello (neuPageBasel - 1);
};
  const handleApprovalPageChange = (neuPageBase1) => {
  setState( prevstate => ({
  ...prevstate,  
  currentPageApproval: newPageBase1-1,
  }));
  
  if (searchEnabled) {
  setCurrentPageBackupApproval(currentPageBackupApproval);
  } else {
  dispatchLoadApprovalRulesList(newPageBasel, PAGE_SIZE, true);
  }
  dispatchLoadCurrentAppsPagelloApproval (newPageBase1 - 1);
  };
  
  const handleChangeSearch = async() => {
  setSearchEnabled( true);
  setRuleSearching( true);
  if (filter) {
    dispatchLoadCurrentAppsSearchTxt(filter);
      const status=  'loaded';
      await dispatchSearchHomeAppsList(filter, 1, PAGE SIZE, role, true);
      if (status) {
        setState(({ currentPage: 0}))
          setCurrentPageBackup(state.currentPage);
          setRuleSearching( false);
      }
  }
};
  const handleChangeFilter (inFilter):void => {
  
  setFilter(inFilter);
  if (!inFilter) {
    setSearchEnabled(false);
  setState(({ currentPage: currentPageBackup }));
  dispatchLoadCurrentAppsSearchTxt(null);
  }
  const allRules = searchEnabled ? searchedRulesMeta: allRulesMeta;
  return (
  < PageWrapper>
  <div className="anim-slide-up"> 
  <div className="col-md-12 pad-1 card-rounded">
  <Modulellrapper
  {...allRules}
  whenError {() => (<ErrorComponent error =(allRules.error} />)}
  whenLoaded ={(rulesList) => 
  <Fragment>
     <RulesListTable
          rulesList={rulesList}
          total ={allRules.total}
          roles ={roles}
          currentPage ={state.currentPage}
          handlePageChange= {handlePageChange}
          dataAsOfDate= {allRules.dataAsOfDate}
          filter = {filter}
          handleChangeSearch={handleChangesearch}  
          handleChangeFilter={handleChangeFilter}
          ruleSearching-{ruleSearching}
          searchEnabled={searchEnabled}
      />
  </Fragnent>
  )}
  />
  </div>
  <div className="col-md-12 pad-1 card-rounded margin-2-t">
  <ModuleWrapper 
    {...allApprovalRuleMeta}
    whenError={() => (<ErrorComponent error={allApprovalRulesMeta.error}/>}
    whenLoaded={(apssList) => (
      <Fragment>
      <ApprovalListTable
        appsList={appsList}
        total={allApprovalRulesMeta.total}
        roles={roles}
      currentPage={state.currentPageApproval}
      handlePageChange={handleApprovalPageChange}
      />
      </Fragment>
    )}
  );
  };
  
  child componnet ---
  
  export const RulesListTable =(props) => {
  
  const {
  rulesList, currentPage, total,
  handlePageChange, dataAsOfDate,
  filter, handleChangeSearch, handleChangeFilter, rulesearching, searchEnabled, les,
  }= props;
  
  const totalPages = lath.ceil(total / PAGE SIZE);
  const showPaginator= (total > PAGE_SIZE);
  
  if ((!rulesList || (rulesList 66 rulesList.length==0)) && !searchEnabled) (...)
  
 
  return (
  <div className="row pad-1-t">
  <div className="col-md-12 margin-1-b nargin-2-t">
  
  <h2 className="heading-5 text-align-left border-dark-b">Rules</h2>
    </div>
    <div className="col-md-4">
    <div>
    <SearchInput
      type="text"
      id="entGroupSearch"
      placeholder="Search by Rule Name"
      value={filter}
      className="margin-8-b"
      onSubmit ={handleChangeSearch}
      onChange= {handLeChangeFilter}
      searching ={ruleSearching}
    />
  
  </div>
  
  </div>  
  <Link
  to ={getPathCreateNewRule}
  >
  <span className="font-weight-medium">Create Rule</span>
  </Link>
  </div>
  </div>
)
