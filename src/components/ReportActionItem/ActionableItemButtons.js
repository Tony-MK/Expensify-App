"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ActionableItemButtons(props) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[props.layout === 'horizontal' ? styles.flexRow : [styles.flexColumn, styles.alignItemsStart], styles.gap2, styles.mt2]}>
            {props.items?.map((item) => (<Button_1.default key={item.key} onPress={item.onPress} text={props.shouldUseLocalization ? translate(item.text) : item.text} medium success={item.isPrimary}/>))}
        </react_native_1.View>);
}
ActionableItemButtons.displayName = 'ActionableItemButtons';
exports.default = ActionableItemButtons;
