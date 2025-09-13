"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormHelpMessage_1 = require("./FormHelpMessage");
const RadioButtonWithLabel_1 = require("./RadioButtonWithLabel");
function RadioButtons({ items, onPress, defaultCheckedValue = '', radioButtonStyle, errorText, onInputChange = () => { }, value }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const [checkedValue, setCheckedValue] = (0, react_1.useState)(defaultCheckedValue);
    (0, react_1.useEffect)(() => {
        if (value === checkedValue || value === undefined) {
            return;
        }
        setCheckedValue(value ?? '');
    }, [checkedValue, value]);
    return (<>
            <react_native_1.View style={styles.mt6} ref={ref}>
                {items.map((item) => (<RadioButtonWithLabel_1.default key={item.value} isChecked={item.value === checkedValue} style={[styles.mb4, radioButtonStyle]} onPress={() => {
                setCheckedValue(item.value);
                onInputChange(item.value);
                return onPress(item.value);
            }} label={item.label}/>))}
            </react_native_1.View>
            {!!errorText && <FormHelpMessage_1.default message={errorText}/>}
        </>);
}
RadioButtons.displayName = 'RadioButtons';
exports.default = (0, react_1.forwardRef)(RadioButtons);
