"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const BusinessTypeSelectorModal_1 = require("./BusinessTypeSelectorModal");
function BusinessTypePicker({ errorText = '', value = '', wrapperStyle, onInputChange, label, onBlur }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = (shouldBlur = true) => {
        if (onBlur && shouldBlur) {
            onBlur();
        }
        setIsPickerVisible(false);
    };
    const updateBusinessTypeInput = (businessTypeItem) => {
        if (onInputChange && businessTypeItem.value !== value) {
            onInputChange(businessTypeItem.value);
        }
        // If the user selects any business type, call the hidePickerModal function with shouldBlur = false
        // to prevent the onBlur function from being called.
        hidePickerModal(false);
    };
    const title = value ? translate(`businessInfoStep.incorporationType.${value}`) : '';
    const descStyle = title.length === 0 ? styles.textNormal : null;
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={title} description={label} descriptionTextStyle={descStyle} onPress={showPickerModal} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText} wrapperStyle={wrapperStyle}/>
            <BusinessTypeSelectorModal_1.default isVisible={isPickerVisible} currentBusinessType={value} onClose={hidePickerModal} onBusinessTypeSelected={updateBusinessTypeInput} label={label}/>
        </react_native_1.View>);
}
BusinessTypePicker.displayName = 'BusinessTypePicker';
exports.default = BusinessTypePicker;
