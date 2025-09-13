"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const CONST_1 = require("@src/CONST");
const StateSelectorModal_1 = require("./StateSelectorModal");
function StatePicker({ value, errorText, onInputChange = () => { } }) {
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (item) => {
        onInputChange?.(item.value);
        hidePickerModal();
    };
    return (<>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={value ? translate(`allStates.${value}.stateName`) : undefined} description={translate('common.state')} onPress={() => setIsPickerVisible(true)} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText}/>
            <StateSelectorModal_1.default isVisible={isPickerVisible} currentState={value ?? ''} onStateSelected={updateInput} onClose={hidePickerModal} label={translate('common.state')} onBackdropPress={hidePickerModal}/>
        </>);
}
StatePicker.displayName = 'StatePicker';
exports.default = StatePicker;
