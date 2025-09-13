"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const blurActiveElement_1 = require("@libs/Accessibility/blurActiveElement");
const CONST_1 = require("@src/CONST");
const callOrReturn_1 = require("@src/types/utils/callOrReturn");
const AmountSelectorModal_1 = require("./AmountSelectorModal");
function AmountPicker({ value, description, title, errorText = '', onInputChange, furtherDetails, rightLabel, ...rest }, forwardedRef) {
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
        (0, blurActiveElement_1.default)();
    };
    const updateInput = (updatedValue) => {
        if (updatedValue !== value) {
            // We cast the updatedValue to a number and then back to a string to remove any leading zeros and separating commas
            onInputChange?.(String(Number(updatedValue)));
        }
        hidePickerModal();
    };
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default ref={forwardedRef} shouldShowRightIcon title={(0, callOrReturn_1.default)(title, value)} description={description} onPress={showPickerModal} furtherDetails={furtherDetails} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} rightLabel={rightLabel} errorText={errorText}/>
            <AmountSelectorModal_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} value={value} isVisible={isPickerVisible} description={description} onClose={hidePickerModal} onValueSelected={updateInput}/>
        </react_native_1.View>);
}
AmountPicker.displayName = 'AmountPicker';
exports.default = (0, react_1.forwardRef)(AmountPicker);
