Dexport const initialState: (currentPage: number (

currentPage: 8,

Jusages & skailasj

export const HomePlain (props) => {

const {

currentAppsPagello,

currentAppsPageNoApproval,

searchedRulesileta,

allRulesheta,

dispatchLoadRulesList,

dispatch LoadApprovalRulesList, dispatchSearchHomeAppsList, currentUser,

allApproval Rulesheta,

searchHomeAppsheta, dispatchLoadCurrentAppsPagello, dispatchLoadCurrentAppsSearchTxt,

dispatchLoadCurrentAppsPageNoApproval,

currentAppsSearchTxt,

= props;

const { roles currentuser.data;

const role roles;

const [state: (currentPage: any, currentPageApproval: anyt, setState] useState(initialitate {

currentPage: currentAppsPageNo,

9});

currentPageApproval: currentAppsPagelloApproval,

const [filter, setFilter) useState(currentAppsSearchTxt);

const [searchEnabled: boolean, setSearchEnabled]= useState(initialState false);

const [currentPageBackup: number, setCurrentPageBackup] useState(initialState 0);

const [currentPageBackupApproval: number, setCurrentPageBackupApproval) useState(initialitate 0);

const [ruleSearching: boolean, setRulesearching] useState(initialitate false);

useEffect( affect: ():void {

if (currentAppsSearchTxt) {

dispatchSearchHomeAppsList(filter, state.currentPage 1, PAGE SIZE, role, true);

setSearchEnabled(value true);

} else {

} dispatchLoadRulesList(state.currentPage + 1, PAGE SIZE);

, deps [role, state.currentPage, currentAppsSearchTxt]);

useEffect(effect():void

Maing

dispatch LoadApprovalRulesList(state.currentPageApproval 1, PAGE SIZE);

, dep (role, state.currentPageApproval));

1 usage & skailas

const handlePageChange (newPageBase1):void *> {

setState(u prevState: currentPage: any, currentPageApproval anyj #> ({

};

..prevState,

currentPage: neuPageBase1-1,

}));

if (searchEnabled) {

setCurrentPageBackup (currentPageBackup);

dispatchSearchliomeAppsList(filter, neuPageBasel, PAGE SIZE, role, true);

} else {

}

dispatchLoadRulesList(nesPageBase1, PAGE SIZE, true);

dispatch LoadCurrentAppsPagello (neuPageBasel - 1);

1 inage & shaile

const handleApproval PageChange (neuPageBasel) : void>

setState( prevstate (currentPage: any, currentPageApproval ant({

...prevstate,

currentPageApprovals neuPageBasel-1,

}));

if (searchEnabled) {

setCurrentPageBackupApproval(currentPageBackupApproval);

} else {

dispatchLoadApprovalRulesList(newPageBasel, PAGE SIZE, true);

dispatchLoadCurrentAppsPagelloApproval (newPageBase1 - 1);
}

const handleChangeSearch async(): Promise<void> => {

setSearchEnabled(value true);

setRuleSearching(value true);

if (filter) {

}

dispatchLoadCurrentAppsSearchTxt(filter);

const status: string 'loaded';

await dispatchSearchHomeAppsList(filter, 1, PAGE SIZE, role, true);

if (status) {

}

setState(({ currentPage: 0)));

setCurrentPageBackup(state.currentPage);

setRuleSearching( valum false);

1 usage & skailasj

const handleChangeFilter (inFilter):void => {

9};

setFilter(inFilter);

if (!inFilter) {

}

setSearchEnabled(value false);

setState(({ currentPage: currentPageBackup }));

dispatchLoadCurrentAppsSearchTxt(null);

const allRules searchEnabled? searchedRulesMeta: allRulesMeta;

return (

< Pagelirapper>

<div className="anim-slide-up">

<div className="col-md-12 pad-1 card-rounded">

<Modulellrapper

(...allRules)

whenError (() => (<ErrorComponent error (allRules.error} />)}

whenLoaded ((rulesList) => (

<Fragment>

<RulesListTable

rulesList={rulesList)

total {allRules.total

roles (roles)

currentPage (state.currentPage)

handlePageChange [handlePageChange)

dataAsOfDate (allRules.dataAsOfDate)

/>

filter (filter)

handleChangeSearch=(handleChangesearch)

handleChangeFilter=(handleChangeFilter}

ruleSearching-(ruleSearching)

searchEnabled={searchEnabled)

</Fragnent>

</div>

<div className="col-md-12 pad-1 card-rounded margin-2-t">

<Modulellrapper

{...allApprovalRulesMeta)

whenError=(() => (<ErrorComponent error (allApprovalRulesketa.error) />)}

whenLoaded={(appsList) *> (

<Fragment>

ApprovalsListTable

appsList={appsList)

total (allApprovalRulesketa.total}

roles (roles)

currentPage={state.currentPageApproval)

handlePageChange (handleApproval PageChange)

/>

</Fragment>

}

/></div>

</div>

</Pagellrapper>
);
};




child file

--------------------------++++++

export const RulesListTable (props) => {

const {

rulesList, currentPage, total,

handlePageChange, dataAsOfDate,

filter, handleChangeSearch, handleChangeFilter, rulesearching, searchEnabled, les,

}= props;

const totalPages: number lath.ceil(total / PAGE SIZE);

const showPaginator: boolean (total > PAGE SIZE);

if ((IrulesList || (rulesList 66 rulesList.length==0)) && !searchEnabled) (...)

1 usage & skailasj

const noSearchRecords ()> (

);

<div...>

const date: Date = new Date();

const day number date.getDate();

const month: number date.getMonth()+1;

const year: number date.getFullYear();

let today: string year+":"+month+":"+day;

let tine: string date.getHours()+":"+ date.getRinutes()+":"+ date.getSeconds();

return (

<div className="row pad-1-t">

{/*...*/}

<div className="col-md-12 margin-1-b nargin-2-t">

<h2 className="heading-5 text-align-left border-dark-b">Rules</h2>

</div>

<div className="col-md-12">

<div className="row">

<div className="col-md-4">

<div>

<SearchInput

type="text"

id="entGroupSearch"

placeholder="Search by Rule Name"

value={filter}

className="margin-8-b"

onSubmit (handleChangeSearch)

onChange (handLeChangeFilter)

searching (ruleSearching}

</

</div>

</div>

<div className="col-md-2">

{/*((roles [6]=='admin') && (+/

<Link

classilane "btn btn-block btn-primary margin-2-1 margin-2-t margin-0-a

to (getPathCreateNewRule)

// to (getPathEditRodifyCreateForm({ no: null, ruleName: null, action: 'create'})) title {

<span className="font-weight-medium">Create Rule</span>

</Link

{/**/}

</div>

<div classtiane "col-md-2 margin-4-1

</div>

</div>

<div classliane"col-md-12 pad-1-1r pad-1-to..>

</div>

140