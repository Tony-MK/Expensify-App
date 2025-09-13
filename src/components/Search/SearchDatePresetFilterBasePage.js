"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Button_1 = require("@components/Button");
var FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollView_1 = require("@components/ScrollView");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SearchDatePresetFilterBase_1 = require("./SearchDatePresetFilterBase");
function SearchDatePresetFilterBasePage(_a) {
    var _b;
    var dateKey = _a.dateKey, titleKey = _a.titleKey;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var searchDatePresetFilterBaseRef = (0, react_1.useRef)(null);
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0];
    var _c = (0, react_1.useState)(null), selectedDateModifier = _c[0], setSelectedDateModifier = _c[1];
    var defaultDateValues = (_b = {},
        _b[CONST_1.default.SEARCH.DATE_MODIFIERS.ON] = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.ON)],
        _b[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE] = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE)],
        _b[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER] = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER)],
        _b);
    var presets = (0, react_1.useMemo)(function () {
        var _a;
        var hasFeed = !!((_a = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.feed) === null || _a === void 0 ? void 0 : _a.length);
        return (0, SearchUIUtils_1.getDatePresets)(dateKey, hasFeed);
    }, [dateKey, searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.feed]);
    var title = (0, react_1.useMemo)(function () {
        if (selectedDateModifier) {
            return translate("common.".concat(selectedDateModifier.toLowerCase()));
        }
        return translate(titleKey);
    }, [selectedDateModifier, titleKey, translate]);
    var goBack = (0, react_1.useCallback)(function () {
        if (selectedDateModifier) {
            setSelectedDateModifier(null);
            return;
        }
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [selectedDateModifier]);
    var reset = (0, react_1.useCallback)(function () {
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
    var save = (0, react_1.useCallback)(function () {
        var _a;
        var _b, _c, _d;
        if (!searchDatePresetFilterBaseRef.current) {
            return;
        }
        if (selectedDateModifier) {
            searchDatePresetFilterBaseRef.current.setDateValueOfSelectedDateModifier();
            goBack();
            return;
        }
        var dateValues = searchDatePresetFilterBaseRef.current.getDateValues();
        (0, Search_1.updateAdvancedFilters)((_a = {},
            _a["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.ON)] = (_b = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.ON]) !== null && _b !== void 0 ? _b : null,
            _a["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE)] = (_c = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.BEFORE]) !== null && _c !== void 0 ? _c : null,
            _a["".concat(dateKey).concat(CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER)] = (_d = dateValues[CONST_1.default.SEARCH.DATE_MODIFIERS.AFTER]) !== null && _d !== void 0 ? _d : null,
            _a));
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
