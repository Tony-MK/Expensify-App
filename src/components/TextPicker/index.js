"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const TextSelectorModal_1 = require("./TextSelectorModal");
function TextPicker({ value, description, placeholder = '', errorText = '', onInputChange, furtherDetails, rightLabel, disabled = false, interactive = true, required = false, ...rest }, forwardedRef) {
    const styles = (0, useThemeStyles_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        if (disabled) {
            return;
        }
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (updatedValue) => {
        if (updatedValue !== value) {
            onInputChange?.(updatedValue);
        }
        hidePickerModal();
    };
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default ref={forwardedRef} shouldShowRightIcon={!disabled} title={value ?? placeholder ?? ''} description={description} onPress={showPickerModal} furtherDetails={furtherDetails} rightLabel={rightLabel} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} style={[styles.moneyRequestMenuItem]} interactive={interactive}/>
            <TextSelectorModal_1.default value={value} isVisible={isPickerVisible} description={description} onClose={hidePickerModal} onValueSelected={updateInput} disabled={disabled} required={required} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}/>
        </react_native_1.View>);
}
TextPicker.displayName = 'TextPicker';
exports.default = (0, react_1.forwardRef)(TextPicker);
