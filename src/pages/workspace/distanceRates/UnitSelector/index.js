"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const UnitSelectorModal_1 = require("./UnitSelectorModal");
function UnitSelector({ defaultValue, wrapperStyle, label, setNewUnit }) {
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        setIsPickerVisible(true);
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateUnitInput = (unit) => {
        setNewUnit(unit);
        hidePickerModal();
    };
    const title = defaultValue ? expensify_common_1.Str.recapitalize(translate((0, WorkspacesSettingsUtils_1.getUnitTranslationKey)(defaultValue))) : '';
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={title} description={label} onPress={showPickerModal} wrapperStyle={wrapperStyle}/>
            <UnitSelectorModal_1.default isVisible={isPickerVisible} currentUnit={defaultValue} onClose={hidePickerModal} onUnitSelected={updateUnitInput} label={label}/>
        </react_native_1.View>);
}
UnitSelector.displayName = 'UnitSelector';
exports.default = UnitSelector;
