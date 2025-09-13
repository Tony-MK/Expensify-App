"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SearchFilterPageFooterButtons_1 = require("@components/Search/SearchFilterPageFooterButtons");
var SelectionList_1 = require("@components/SelectionList");
var UserListItem_1 = require("@components/SelectionList/UserListItem");
var useDebouncedState_1 = require("@hooks/useDebouncedState");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWorkspaceList_1 = require("@hooks/useWorkspaceList");
var Search_1 = require("@libs/actions/Search");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
var updateWorkspaceFilter = function (policyID) {
    (0, Search_1.updateAdvancedFilters)({
        policyID: policyID,
    });
    Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
};
function SearchFiltersWorkspacePage() {
    var styles = (0, useThemeStyles_1.default)();
    var _a = (0, useLocalize_1.default)(), translate = _a.translate, localeCompare = _a.localeCompare;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0];
    var _b = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true }), policies = _b[0], policiesResult = _b[1];
    var currentUserLogin = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: function (session) { return session === null || session === void 0 ? void 0 : session.email; }, canBeMissing: false })[0];
    var isLoadingApp = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true })[0];
    var _c = (0, useDebouncedState_1.default)(''), searchTerm = _c[0], debouncedSearchTerm = _c[1], setSearchTerm = _c[2];
    var shouldShowLoadingIndicator = isLoadingApp && !isOffline;
    var _d = (0, react_1.useState)(function () { return ((searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.policyID) ? Array.from(searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.policyID) : []); }), selectedOptions = _d[0], setSelectedOptions = _d[1];
    var _e = (0, useWorkspaceList_1.default)({
        policies: policies,
        currentUserLogin: currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: selectedOptions,
        searchTerm: debouncedSearchTerm,
        localeCompare: localeCompare,
    }), sections = _e.sections, shouldShowNoResultsFoundMessage = _e.shouldShowNoResultsFoundMessage, shouldShowSearchInput = _e.shouldShowSearchInput;
    var selectWorkspace = (0, react_1.useCallback)(function (option) {
        var optionIndex = selectedOptions.findIndex(function (selectedOption) {
            var matchesPolicyId = selectedOption && selectedOption === (option === null || option === void 0 ? void 0 : option.policyID);
            return matchesPolicyId;
        });
        if (optionIndex === -1 && (option === null || option === void 0 ? void 0 : option.policyID)) {
            setSelectedOptions(__spreadArray(__spreadArray([], selectedOptions, true), [option.policyID], false));
        }
        else {
            var newSelectedOptions = __spreadArray(__spreadArray([], selectedOptions.slice(0, optionIndex), true), selectedOptions.slice(optionIndex + 1), true);
            setSelectedOptions(newSelectedOptions);
        }
    }, [selectedOptions]);
    var applyChanges = (0, react_1.useCallback)(function () {
        var policyIds = selectedOptions.map(function (option) { return (option ? option.toString() : undefined); }).filter(Boolean);
        updateWorkspaceFilter(policyIds);
    }, [selectedOptions]);
    var resetChanges = (0, react_1.useCallback)(function () {
        setSelectedOptions([]);
    }, []);
    return (<ScreenWrapper_1.default testID={SearchFiltersWorkspacePage.displayName} includeSafeAreaPaddingBottom shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            {function (_a) {
            var didScreenTransitionEnd = _a.didScreenTransitionEnd;
            return (<>
                    <HeaderWithBackButton_1.default title={translate('workspace.common.workspace')} onBackButtonPress={function () {
                    Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
                }}/>
                    {shouldShowLoadingIndicator ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<SelectionList_1.default ListItem={UserListItem_1.default} sections={sections} canSelectMultiple shouldUseDefaultRightHandSideCheckmark textInputLabel={shouldShowSearchInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} onSelectRow={selectWorkspace} headerMessage={shouldShowNoResultsFoundMessage ? translate('common.noResultsFound') : ''} showLoadingPlaceholder={(0, isLoadingOnyxValue_1.default)(policiesResult) || !didScreenTransitionEnd} footerContent={<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>}/>)}
                </>);
        }}
        </ScreenWrapper_1.default>);
}
SearchFiltersWorkspacePage.displayName = 'SearchFiltersWorkspacePage';
exports.default = SearchFiltersWorkspacePage;
