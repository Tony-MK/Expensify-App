"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const searchOptions_1 = require("@libs/searchOptions");
const StringUtils_1 = require("@libs/StringUtils");
const Url_1 = require("@libs/Url");
function StateSelectionPage() {
    const route = (0, native_1.useRoute)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const params = route.params;
    const currentState = params?.state;
    const label = params?.label;
    const countryStates = (0, react_1.useMemo)(() => Object.keys(expensify_common_1.CONST.STATES).map((state) => {
        const stateName = translate(`allStates.${state}.stateName`);
        const stateISO = translate(`allStates.${state}.stateISO`);
        return {
            value: stateISO,
            keyForList: stateISO,
            text: stateName,
            isSelected: currentState === stateISO,
            searchValue: StringUtils_1.default.sanitizeString(`${stateISO}${stateName}`),
        };
    }), [translate, currentState]);
    const searchResults = (0, searchOptions_1.default)(searchValue, countryStates);
    const headerMessage = searchValue.trim() && !searchResults.length ? translate('common.noResultsFound') : '';
    const selectCountryState = (0, react_1.useCallback)((option) => {
        const backTo = params?.backTo ?? '';
        // Check the "backTo" parameter to decide navigation behavior
        if (!backTo) {
            Navigation_1.default.goBack();
        }
        else {
            // Set compareParams to false because we want to goUp to this particular screen and update params (state).
            Navigation_1.default.goBack((0, Url_1.appendParam)(backTo, 'state', option.value), { compareParams: false });
        }
    }, [params?.backTo]);
    return (<ScreenWrapper_1.default testID={StateSelectionPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
            <HeaderWithBackButton_1.default 
    // Label can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    title={label || translate('common.state')} shouldShowBackButton onBackButtonPress={() => {
            const backTo = params?.backTo ?? '';
            let backToRoute;
            if (backTo) {
                backToRoute = (0, Url_1.appendParam)(backTo, 'state', currentState ?? '');
            }
            Navigation_1.default.goBack(backToRoute);
        }}/>
            {/* This empty, non-harmful view fixes the issue with SelectionList scrolling and shouldUseDynamicMaxToRenderPerBatch. It can be removed without consequences if a solution for SelectionList is found. See comment https://github.com/Expensify/App/pull/36770#issuecomment-2017028096 */}
            <react_native_1.View />

            <SelectionList_1.default onSelectRow={selectCountryState} shouldSingleExecuteRowSelect headerMessage={headerMessage} 
    // Label can be an empty string
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    textInputLabel={label || translate('common.state')} textInputValue={searchValue} sections={[{ data: searchResults }]} onChangeText={setSearchValue} initiallyFocusedOptionKey={currentState} shouldUseDynamicMaxToRenderPerBatch ListItem={RadioListItem_1.default} addBottomSafeAreaPadding/>
        </ScreenWrapper_1.default>);
}
StateSelectionPage.displayName = 'StateSelectionPage';
exports.default = StateSelectionPage;
