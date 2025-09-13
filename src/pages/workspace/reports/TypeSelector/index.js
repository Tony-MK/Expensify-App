"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const CONST_1 = require("@src/CONST");
const TypeSelectorModal_1 = require("./TypeSelectorModal");
function TypeSelector({ value, label = '', rightLabel, subtitle = '', errorText = '', onInputChange, onTypeSelected }, forwardedRef) {
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateTypeInput = (reportField) => {
        onInputChange?.(reportField.value);
        onTypeSelected?.(reportField.value);
        hidePickerModal();
    };
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default ref={forwardedRef} shouldShowRightIcon title={value ? expensify_common_1.Str.recapitalize(translate((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(value))) : ''} description={label} rightLabel={rightLabel} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} onPress={showPickerModal}/>
            <TypeSelectorModal_1.default isVisible={isPickerVisible} currentType={value} onClose={hidePickerModal} onTypeSelected={updateTypeInput} label={label} subtitle={subtitle}/>
        </react_native_1.View>);
}
TypeSelector.displayName = 'TypeSelector';
exports.default = (0, react_1.forwardRef)(TypeSelector);
