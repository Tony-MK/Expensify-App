"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useOnyx_1 = require("@hooks/useOnyx");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const InitialListValueSelectorModal_1 = require("./InitialListValueSelectorModal");
function InitialListValueSelector({ value = '', label = '', rightLabel, subtitle = '', errorText = '', onInputChange }, forwardedRef) {
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
        (0, blurActiveElement_1.default)();
    };
    const updateValueInput = (initialValue) => {
        onInputChange?.(value === initialValue ? '' : initialValue);
        hidePickerModal();
    };
    (0, react_1.useEffect)(() => {
        const currentValueIndex = Object.values(formDraft?.listValues ?? {}).findIndex((listValue) => listValue === value);
        const isCurrentValueDisabled = formDraft?.disabledListValues?.[currentValueIndex] ?? true;
        if (isCurrentValueDisabled && value !== '') {
            onInputChange?.('');
        }
    }, [formDraft?.disabledListValues, formDraft?.listValues, onInputChange, value]);
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default ref={forwardedRef} shouldShowRightIcon title={value} description={label} rightLabel={rightLabel} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} onPress={showPickerModal}/>
            <InitialListValueSelectorModal_1.default isVisible={isPickerVisible} currentValue={value} onClose={hidePickerModal} onValueSelected={updateValueInput} label={label} subtitle={subtitle}/>
        </react_native_1.View>);
}
InitialListValueSelector.displayName = 'InitialListValueSelector';
exports.default = (0, react_1.forwardRef)(InitialListValueSelector);
