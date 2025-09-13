"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const NetSuiteCustomListSelectorModal_1 = require("./NetSuiteCustomListSelectorModal");
function NetSuiteCustomListPicker({ value, policy, internalIDInputID, errorText, onInputChange = () => { } }) {
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateInput = (item) => {
        onInputChange?.(item.value);
        if (internalIDInputID) {
            onInputChange(item.id, internalIDInputID);
        }
        hidePickerModal();
    };
    return (<>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={value} description={translate('workspace.netsuite.import.importCustomFields.customLists.fields.listName')} onPress={() => setIsPickerVisible(true)} brickRoadIndicator={errorText ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} errorText={errorText}/>
            <NetSuiteCustomListSelectorModal_1.default isVisible={isPickerVisible} currentCustomListValue={value ?? ''} onCustomListSelected={updateInput} onClose={hidePickerModal} label={translate('workspace.netsuite.import.importCustomFields.customLists.fields.listName')} policy={policy} onBackdropPress={Navigation_1.default.dismissModal}/>
        </>);
}
NetSuiteCustomListPicker.displayName = 'NetSuiteCustomListPicker';
exports.default = NetSuiteCustomListPicker;
