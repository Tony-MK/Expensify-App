"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchFilterPageFooterButtons_1 = require("@components/Search/SearchFilterPageFooterButtons");
const SelectionList_1 = require("@components/SelectionList");
const UserListItem_1 = require("@components/SelectionList/UserListItem");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspaceList_1 = require("@hooks/useWorkspaceList");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const updateWorkspaceFilter = (policyID) => {
    (0, Search_1.updateAdvancedFilters)({
        policyID,
    });
    Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
};
function SearchFiltersWorkspacePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const [policies, policiesResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [currentUserLogin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.email, canBeMissing: false });
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: true });
    const [searchTerm, debouncedSearchTerm, setSearchTerm] = (0, useDebouncedState_1.default)('');
    const shouldShowLoadingIndicator = isLoadingApp && !isOffline;
    const [selectedOptions, setSelectedOptions] = (0, react_1.useState)(() => (searchAdvancedFiltersForm?.policyID ? Array.from(searchAdvancedFiltersForm?.policyID) : []));
    const { sections, shouldShowNoResultsFoundMessage, shouldShowSearchInput } = (0, useWorkspaceList_1.default)({
        policies,
        currentUserLogin,
        shouldShowPendingDeletePolicy: false,
        selectedPolicyIDs: selectedOptions,
        searchTerm: debouncedSearchTerm,
        localeCompare,
    });
    const selectWorkspace = (0, react_1.useCallback)((option) => {
        const optionIndex = selectedOptions.findIndex((selectedOption) => {
            const matchesPolicyId = selectedOption && selectedOption === option?.policyID;
            return matchesPolicyId;
        });
        if (optionIndex === -1 && option?.policyID) {
            setSelectedOptions([...selectedOptions, option.policyID]);
        }
        else {
            const newSelectedOptions = [...selectedOptions.slice(0, optionIndex), ...selectedOptions.slice(optionIndex + 1)];
            setSelectedOptions(newSelectedOptions);
        }
    }, [selectedOptions]);
    const applyChanges = (0, react_1.useCallback)(() => {
        const policyIds = selectedOptions.map((option) => (option ? option.toString() : undefined)).filter(Boolean);
        updateWorkspaceFilter(policyIds);
    }, [selectedOptions]);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedOptions([]);
    }, []);
    return (<ScreenWrapper_1.default testID={SearchFiltersWorkspacePage.displayName} includeSafeAreaPaddingBottom shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('workspace.common.workspace')} onBackButtonPress={() => {
                Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
            }}/>
                    {shouldShowLoadingIndicator ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative]}/>) : (<SelectionList_1.default ListItem={UserListItem_1.default} sections={sections} canSelectMultiple shouldUseDefaultRightHandSideCheckmark textInputLabel={shouldShowSearchInput ? translate('common.search') : undefined} textInputValue={searchTerm} onChangeText={setSearchTerm} onSelectRow={selectWorkspace} headerMessage={shouldShowNoResultsFoundMessage ? translate('common.noResultsFound') : ''} showLoadingPlaceholder={(0, isLoadingOnyxValue_1.default)(policiesResult) || !didScreenTransitionEnd} footerContent={<SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>}/>)}
                </>)}
        </ScreenWrapper_1.default>);
}
SearchFiltersWorkspacePage.displayName = 'SearchFiltersWorkspacePage';
exports.default = SearchFiltersWorkspacePage;
