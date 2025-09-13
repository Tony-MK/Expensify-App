"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const OptionItem_1 = require("./OptionItem");
function OptionsPicker({ options, selectedOption, onOptionSelected, style, isDisabled }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    if (shouldUseNarrowLayout) {
        return (<react_native_1.View style={[styles.flexColumn, styles.flex1, style]}>
                {options.map((option, index) => (<react_1.Fragment key={option.key}>
                        <OptionItem_1.default title={option.title} icon={option.icon} isSelected={selectedOption === option.key} isDisabled={isDisabled} onPress={() => onOptionSelected(option.key)}/>
                        {index < options.length - 1 && <react_native_1.View style={styles.mb3}/>}
                    </react_1.Fragment>))}
            </react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.flexRow, styles.flex1, style]}>
            {options.map((option, index) => (<react_1.Fragment key={option.key}>
                    <OptionItem_1.default title={option.title} icon={option.icon} isSelected={selectedOption === option.key} isDisabled={isDisabled} onPress={() => onOptionSelected(option.key)}/>
                    {index < options.length - 1 && <react_native_1.View style={styles.mr3}/>}
                </react_1.Fragment>))}
        </react_native_1.View>);
}
OptionsPicker.displayName = 'OptionsPicker';
exports.default = OptionsPicker;
