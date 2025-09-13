"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
function ConnectionCompletePage() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.deeplinkWrapperContainer}>
            <react_native_1.View style={styles.deeplinkWrapperMessage}>
                <react_native_1.View style={styles.mb2}>
                    <Icon_1.default width={272} height={188} src={Expensicons.ConnectionComplete}/>
                </react_native_1.View>
                <Text_1.default style={[styles.textHeadline, styles.textXXLarge, styles.textAlignCenter]}>{translate('connectionComplete.title')}</Text_1.default>
                <react_native_1.View style={[styles.mt2, styles.mb2, { maxWidth: 280 }]}>
                    <Text_1.default style={styles.textAlignCenter}>{translate('connectionComplete.supportingText')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.deeplinkWrapperFooter}>
                <Icon_1.default width={variables_1.default.modalWordmarkWidth} height={variables_1.default.modalWordmarkHeight} fill={theme.success} src={Expensicons.ExpensifyWordmark}/>
            </react_native_1.View>
        </react_native_1.View>);
}
ConnectionCompletePage.displayName = 'ConnectionCompletePage';
exports.default = ConnectionCompletePage;
