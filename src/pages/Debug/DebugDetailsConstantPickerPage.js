"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CategoryPicker_1 = require("@components/CategoryPicker");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Url_1 = require("@libs/Url");
const CONST_1 = require("@src/CONST");
const DebugTransactionForm_1 = require("@src/types/form/DebugTransactionForm");
const ConstantPicker_1 = require("./ConstantPicker");
const DebugTagPicker_1 = require("./DebugTagPicker");
function DebugDetailsConstantPickerPage({ route: { params: { formType, fieldName, fieldValue, policyID = '', backTo = '' }, }, navigation, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const onSubmit = (0, react_1.useCallback)((item) => {
        const value = item.text === fieldValue ? '' : (item.text ?? '');
        // Check the navigation state and "backTo" parameter to decide navigation behavior
        if (navigation.getState().routes.length === 1 && !backTo) {
            // If there is only one route and "backTo" is empty, go back in navigation
            Navigation_1.default.goBack();
        }
        else if (!!backTo && navigation.getState().routes.length === 1) {
            // If "backTo" is not empty and there is only one route, go back to the specific route defined in "backTo" with a country parameter
            Navigation_1.default.goBack((0, Url_1.appendParam)(backTo, fieldName, value));
        }
        else {
            // Otherwise, navigate to the specific route defined in "backTo" with a country parameter
            Navigation_1.default.navigate((0, Url_1.appendParam)(backTo, fieldName, value));
        }
    }, [backTo, fieldName, fieldValue, navigation]);
    const renderPicker = (0, react_1.useCallback)(() => {
        if ([DebugTransactionForm_1.default.CURRENCY, DebugTransactionForm_1.default.MODIFIED_CURRENCY, DebugTransactionForm_1.default.ORIGINAL_CURRENCY].includes(fieldName)) {
            return (<CurrencySelectionList_1.default onSelect={({ currencyCode }) => onSubmit({
                    text: currencyCode,
                })} searchInputLabel={translate('common.search')}/>);
        }
        if (formType === CONST_1.default.DEBUG.FORMS.TRANSACTION) {
            if (fieldName === DebugTransactionForm_1.default.CATEGORY) {
                return (<CategoryPicker_1.default policyID={policyID} selectedCategory={fieldValue} onSubmit={onSubmit}/>);
            }
            if (fieldName === DebugTransactionForm_1.default.TAG) {
                return (<DebugTagPicker_1.default policyID={policyID} tagName={fieldValue} onSubmit={onSubmit}/>);
            }
        }
        return (<ConstantPicker_1.default formType={formType} fieldName={fieldName} fieldValue={fieldValue} onSubmit={onSubmit}/>);
    }, [fieldName, fieldValue, formType, onSubmit, policyID, translate]);
    return (<ScreenWrapper_1.default testID={DebugDetailsConstantPickerPage.displayName}>
            <HeaderWithBackButton_1.default title={fieldName}/>
            <react_native_1.View style={styles.containerWithSpaceBetween}>{renderPicker()}</react_native_1.View>
        </ScreenWrapper_1.default>);
}
DebugDetailsConstantPickerPage.displayName = 'DebugDetailsConstantPickerPage';
exports.default = DebugDetailsConstantPickerPage;
