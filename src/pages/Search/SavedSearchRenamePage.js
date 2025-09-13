"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchSavedSearchRenameForm_1 = require("@src/types/form/SearchSavedSearchRenameForm");
function SavedSearchRenamePage({ route }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { q, name } = route.params;
    const [newName, setNewName] = (0, react_1.useState)(name);
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const applyFiltersAndNavigate = () => {
        (0, Search_1.clearAdvancedFilters)();
        Navigation_1.default.dismissModal();
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                query: q,
                name: newName?.trim(),
            }));
        });
    };
    const onSaveSearch = () => {
        const queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(q || (0, SearchQueryUtils_1.buildCannedSearchQuery)()) ?? {};
        (0, Search_1.saveSearch)({
            queryJSON,
            newName: newName?.trim() || q,
        });
        applyFiltersAndNavigate();
    };
    return (<ScreenWrapper_1.default testID={SavedSearchRenamePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom>
            <HeaderWithBackButton_1.default title={translate('common.rename')}/>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.SEARCH_SAVED_SEARCH_RENAME_FORM} submitButtonText={translate('common.save')} onSubmit={onSaveSearch} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={SearchSavedSearchRenameForm_1.default.NAME} label={translate('search.searchName')} accessibilityLabel={translate('search.searchName')} role={CONST_1.default.ROLE.PRESENTATION} onChangeText={(renamedName) => setNewName(renamedName)} ref={inputCallbackRef} defaultValue={name}/>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
SavedSearchRenamePage.displayName = 'SavedSearchRenamePage';
exports.default = SavedSearchRenamePage;
