"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CategorySelectorModal_1 = require("./CategorySelectorModal");
function CategorySelector({ defaultValue = '', wrapperStyle, label, setNewCategory, policyID, focused, isPickerVisible, showPickerModal, hidePickerModal }) {
    const styles = (0, useThemeStyles_1.default)();
    const updateCategoryInput = (categoryItem) => {
        setNewCategory(categoryItem);
        hidePickerModal();
    };
    const title = defaultValue;
    const descStyle = title.length === 0 ? styles.textNormal : null;
    return (<react_native_1.View>
            <MenuItemWithTopDescription_1.default shouldShowRightIcon title={title} description={label} descriptionTextStyle={descStyle} onPress={showPickerModal} wrapperStyle={wrapperStyle} focused={focused}/>
            <CategorySelectorModal_1.default policyID={policyID} isVisible={isPickerVisible} currentCategory={defaultValue} onClose={hidePickerModal} onCategorySelected={updateCategoryInput} label={label}/>
        </react_native_1.View>);
}
CategorySelector.displayName = 'CategorySelector';
exports.default = CategorySelector;
