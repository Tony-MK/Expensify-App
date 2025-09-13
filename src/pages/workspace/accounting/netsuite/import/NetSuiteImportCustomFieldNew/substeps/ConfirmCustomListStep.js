"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
function ConfirmCustomListStep({ onMove, netSuiteCustomFieldFormValues: values, onNext }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const bottomSafeAreaPaddingStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true });
    const fieldNames = [NetSuiteCustomFieldForm_1.default.LIST_NAME, NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID, NetSuiteCustomFieldForm_1.default.MAPPING];
    if (!values.mapping) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<react_native_1.View style={[styles.flex1, styles.mt3, bottomSafeAreaPaddingStyle]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('workspace.common.letsDoubleCheck')}</Text_1.default>
            {fieldNames.map((fieldName, index) => (<MenuItemWithTopDescription_1.default key={fieldName} description={translate(`workspace.netsuite.import.importCustomFields.customLists.fields.${fieldName}`)} title={fieldName === NetSuiteCustomFieldForm_1.default.MAPPING && values[fieldName]
                ? translate(`workspace.netsuite.import.importTypes.${values[fieldName]}.label`)
                : values[fieldName]} shouldShowRightIcon onPress={() => {
                onMove(index);
            }}/>))}
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
                <Button_1.default isDisabled={isOffline} success large style={[styles.w100]} onPress={onNext} text={translate('common.confirm')}/>
            </react_native_1.View>
        </react_native_1.View>);
}
ConfirmCustomListStep.displayName = 'ConfirmCustomListStep';
exports.default = ConfirmCustomListStep;
