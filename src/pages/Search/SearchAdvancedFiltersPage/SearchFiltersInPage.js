"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var SearchFiltersChatsSelector_1 = require("@components/Search/SearchFiltersChatsSelector");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Navigation_1 = require("@libs/Navigation/Navigation");
var Search_1 = require("@userActions/Search");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function SearchFiltersInPage() {
    var _a;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var _b = (0, react_1.useState)(false), isScreenTransitionEnd = _b[0], setIsScreenTransitionEnd = _b[1];
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true })[0];
    var handleScreenTransitionEnd = function () {
        setIsScreenTransitionEnd(true);
    };
    return (<ScreenWrapper_1.default testID={SearchFiltersInPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} onEntryTransitionEnd={handleScreenTransitionEnd} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.in')} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchFiltersChatsSelector_1.default isScreenTransitionEnd={isScreenTransitionEnd} onFiltersUpdate={function (selectedAccountIDs) {
            (0, Search_1.updateAdvancedFilters)({
                in: selectedAccountIDs,
            });
        }} initialReportIDs={(_a = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm.in) !== null && _a !== void 0 ? _a : []}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersInPage.displayName = 'SearchFiltersInPage';
exports.default = SearchFiltersInPage;
