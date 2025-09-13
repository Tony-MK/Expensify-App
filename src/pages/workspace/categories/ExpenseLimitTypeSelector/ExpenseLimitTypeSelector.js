"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const keyboard_1 = require("@src/utils/keyboard");
const ExpenseLimitTypeSelectorModal_1 = require("./ExpenseLimitTypeSelectorModal");
function ExpenseLimitTypeSelector({ defaultValue, wrapperStyle, label, setNewExpenseLimitType }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isPickerVisible, setIsPickerVisible] = (0, react_1.useState)(false);
    const showPickerModal = () => {
        keyboard_1.default.dismiss().then(() => {
            setIsPickerVisible(true);
        });
    };
    const hidePickerModal = () => {
        setIsPickerVisible(false);
    };
    const updateExpenseLimitTypeInput = (expenseLimitType) => {
        setNewExpenseLimitType(expenseLimitType);
        hidePickerModal();
    };
    const title = translate(`workspace.rules.categoryRules.expenseLimitTypes.${defaultValue}`);
    const descStyle = !title ? styles.textNormal : null;
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={title} description={label} descriptionTextStyle={descStyle} onPress={showPickerModal} wrapperStyle={wrapperStyle}/>
            <ExpenseLimitTypeSelectorModal_1.default isVisible={isPickerVisible} currentExpenseLimitType={defaultValue} onClose={hidePickerModal} onExpenseLimitTypeSelected={updateExpenseLimitTypeInput} label={label}/>
        </react_native_1.View>);
}
ExpenseLimitTypeSelector.displayName = 'ExpenseLimitTypeSelector';
exports.default = ExpenseLimitTypeSelector;
