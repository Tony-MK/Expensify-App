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
const CONST_1 = require("@src/CONST");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
function ConfirmCustomSegmentStep({ onMove, customSegmentType, netSuiteCustomFieldFormValues: values, onNext }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const fieldNames = [NetSuiteCustomFieldForm_1.default.SEGMENT_NAME, NetSuiteCustomFieldForm_1.default.INTERNAL_ID, NetSuiteCustomFieldForm_1.default.SCRIPT_ID, NetSuiteCustomFieldForm_1.default.MAPPING];
    const { isOffline } = (0, useNetwork_1.default)();
    const bottomSafeAreaPaddingStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({ addBottomSafeAreaPadding: true });
    if (!values.mapping) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<react_native_1.View style={[styles.flex1, bottomSafeAreaPaddingStyle]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('workspace.common.letsDoubleCheck')}</Text_1.default>
            {fieldNames.map((fieldName, index) => (<MenuItemWithTopDescription_1.default key={fieldName} description={translate(`workspace.netsuite.import.importCustomFields.customSegments.fields.${fieldName === NetSuiteCustomFieldForm_1.default.SCRIPT_ID && customSegmentType === CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_RECORD
                ? `${CONST_1.default.NETSUITE_CUSTOM_RECORD_TYPES.CUSTOM_RECORD}ScriptID`
                : `${fieldName}`}`)} title={fieldName === NetSuiteCustomFieldForm_1.default.MAPPING ? translate(`workspace.netsuite.import.importTypes.${values[fieldName]}.label`) : values[fieldName]} shouldShowRightIcon onPress={() => {
                onMove(index + 1);
            }}/>))}
            <react_native_1.View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
                <Button_1.default isDisabled={isOffline} success large style={[styles.w100]} onPress={onNext} text={translate('common.confirm')}/>
            </react_native_1.View>
        </react_native_1.View>);
}
ConfirmCustomSegmentStep.displayName = 'ConfirmCustomSegmentStep';
exports.default = ConfirmCustomSegmentStep;
