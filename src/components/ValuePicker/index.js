"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ValueSelectionList_1 = require("./ValueSelectionList");
const ValueSelectorModal_1 = require("./ValueSelectorModal");
function ValuePicker({ value, label, items, placeholder = '', errorText = '', onInputChange, furtherDetails, shouldShowTooltips = true, shouldShowModal = true }, forwardedRef) {
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (item) => {
        if (item.value !== value) {
            onInputChange?.(item.value);
        }
        hidePickerModal();
    };
    const selectedItem = items?.find((item) => item.value === value);
    return (<react_native_1.View>
            {shouldShowModal ? (<>
                    <MenuItemWithTopDescription_1.default ref={forwardedRef} shouldShowRightIcon 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        title={selectedItem?.label || placeholder || ''} description={label} onPress={showPickerModal} furtherDetails={furtherDetails} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText}/>
                    <ValueSelectorModal_1.default isVisible={isPickerVisible} label={label} selectedItem={selectedItem} items={items} onClose={hidePickerModal} onItemSelected={updateInput} shouldShowTooltips={shouldShowTooltips} onBackdropPress={Navigation_1.default.dismissModal} shouldEnableKeyboardAvoidingView={false}/>
                </>) : (<ValueSelectionList_1.default items={items} selectedItem={selectedItem} onItemSelected={updateInput} shouldShowTooltips={shouldShowTooltips}/>)}
        </react_native_1.View>);
}
ValuePicker.displayName = 'ValuePicker';
exports.default = (0, react_1.forwardRef)(ValuePicker);
