"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
function PrevNextButtons({ isPrevButtonDisabled, isNextButtonDisabled, onNext, onPrevious }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    return (<react_native_1.View style={styles.flexRow}>
            <PressableWithFeedback_1.default accessible accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={CONST_1.default.ROLE.BUTTON} disabled={isPrevButtonDisabled} style={[styles.h10, styles.mr1, styles.alignItemsCenter, styles.justifyContentCenter]} onPress={onPrevious}>
                <react_native_1.View style={[styles.reportActionContextMenuMiniButton, { backgroundColor: theme.borderLighter }, isPrevButtonDisabled && styles.buttonOpacityDisabled]}>
                    <Icon_1.default src={Expensicons.BackArrow} small fill={theme.icon} isButtonIcon/>
                </react_native_1.View>
            </PressableWithFeedback_1.default>
            <PressableWithFeedback_1.default accessible accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel={CONST_1.default.ROLE.BUTTON} disabled={isNextButtonDisabled} style={[styles.h10, styles.alignItemsCenter, styles.justifyContentCenter]} onPress={onNext}>
                <react_native_1.View style={[styles.reportActionContextMenuMiniButton, { backgroundColor: theme.borderLighter }, isNextButtonDisabled && styles.buttonOpacityDisabled]}>
                    <Icon_1.default src={Expensicons.ArrowRight} small fill={theme.icon} isButtonIcon/>
                </react_native_1.View>
            </PressableWithFeedback_1.default>
        </react_native_1.View>);
}
exports.default = PrevNextButtons;
