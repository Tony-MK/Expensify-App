"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button_1 = require("@components/Button");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchDatePresetFilterBase_1 = require("./SearchDatePresetFilterBase");
function SearchDatePresetFilterBasePage({ dateKey, titleKey }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const searchDatePresetFilterBaseRef = (0, react_1.useRef)(null);
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const [selectedDateModifier, setSelectedDateModifier] = (0, react_1.useState)(null);
    const defaultDateValues = {
        [CONST_1.default.SEARCH.DATE_MODIFIERS.ON]: searchAdvancedFiltersForm?.[`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.ON}`],
        [CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]: searchAdvancedFiltersForm?.[`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE}`],
        [CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]: searchAdvancedFiltersForm?.[`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER}`],
    };
    const presets = (0, react_1.useMemo)(() => {
        const hasFeed = !!searchAdvancedFiltersForm?.feed?.length;
        return (0, SearchUIUtils_1.getDatePresets)(dateKey, hasFeed);
    }, [dateKey, searchAdvancedFiltersForm?.feed]);
    const title = (0, react_1.useMemo)(() => {
        if (selectedDateModifier) {
            return translate(`common.${selectedDateModifier.toLowerCase()}`);
        }
        return translate(titleKey);
    }, [selectedDateModifier, titleKey, translate]);
    const goBack = (0, react_1.useCallback)(() => {
        if (selectedDateModifier) {
            setSelectedDateModifier(null);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [selectedDateModifier]);
    const reset = (0, react_1.useCallback)(() => {
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.clearDateValueOfSelectedDateModifier();
            goBack();
            return;
        }
        searchDatePresetFilterBaseRef.current.clearDateValues();
    }, [selectedDateModifier, goBack]);
    const save = (0, react_1.useCallback)(() => {
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.setDateValueOfSelectedDateModifier();
            goBack();
            return;
        }
        const dateValues = searchDatePresetFilterBaseRef.current.getDateValues();
        (0, Search_1.updateAdvancedFilters)({
            [`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.ON}`]: dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] ?? null,
            [`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE}`]: dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] ?? null,
            [`${dateKey}${CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER}`]: dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] ?? null,
        });
        goBack();
    }, [selectedDateModifier, goBack, dateKey]);
    return (<ScreenWrapper_1.default testID={SearchDatePresetFilterBasePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={title} onBackButtonPress={goBack}/>
            <ScrollView_1.default contentContainerStyle={[styles.flexGrow1]}>
                <SearchDatePresetFilterBase_1.default ref={searchDatePresetFilterBaseRef} defaultDateValues={defaultDateValues} selectedDateModifier={selectedDateModifier} onSelectDateModifier={setSelectedDateModifier} presets={presets}/>
            </ScrollView_1.default>
            <Button_1.default text={translate('common.reset')} onPress={reset} style={[styles.mh4, styles.mt4]} large/>
            <FormAlertWithSubmitButton_1.default buttonText={translate('common.save')} containerStyles={[styles.m4, styles.mt3, styles.mb5]} onSubmit={save} enabledWhenOffline/>
        </ScreenWrapper_1.default>);
}
SearchDatePresetFilterBasePage.displayName = 'SearchDatePresetFilterBasePage';
exports.default = SearchDatePresetFilterBasePage;
