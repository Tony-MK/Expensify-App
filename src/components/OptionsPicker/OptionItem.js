"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Pressable_1 = require("@components/Pressable");
const SelectCircle_1 = require("@components/SelectCircle");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
function OptionItem({ title, icon, onPress, isSelected = false, isDisabled, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Pressable_1.PressableWithFeedback onPress={onPress} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate(title)} disabled={isDisabled} wrapperStyle={[styles.flex1, style]}>
            <react_native_1.View style={[styles.borderedContentCard, isSelected && styles.borderColorFocus, styles.p5]}>
                <react_native_1.View>
                    <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween]}>
                        <Icon_1.default src={icon} width={variables_1.default.iconHeader} height={variables_1.default.iconHeader}/>
                        {!isDisabled && (<react_native_1.View>
                                <SelectCircle_1.default isChecked={isSelected} selectCircleStyles={styles.sectionSelectCircle}/>
                            </react_native_1.View>)}
                    </react_native_1.View>
                    <Text_1.default style={[styles.headerText, styles.mt2]} numberOfLines={1}>
                        {translate(title)}
                    </Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
        </Pressable_1.PressableWithFeedback>);
}
OptionItem.displayName = 'OptionItem';
exports.default = OptionItem;
