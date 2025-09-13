"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function HelpLinks({ containerStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, containerStyles]}>
            <Icon_1.default src={Expensicons.QuestionMark} width={12} height={12} fill={theme.icon}/>
            <react_native_1.View style={[styles.ml2, styles.dFlex, styles.flexRow]}>
                <TextLink_1.default style={[styles.textMicro]} href={CONST_1.default.BANK_ACCOUNT_PERSONAL_DOCUMENTATION_INFO_URL}>
                    {translate('requestorStep.learnMore')}
                </TextLink_1.default>
                <Text_1.default style={[styles.textMicroSupporting]}>{' | '}</Text_1.default>
                <TextLink_1.default style={[styles.textMicro]} href={CONST_1.default.PERSONAL_DATA_PROTECTION_INFO_URL}>
                    {translate('requestorStep.isMyDataSafe')}
                </TextLink_1.default>
            </react_native_1.View>
        </react_native_1.View>);
}
HelpLinks.displayName = 'HelpLinks';
exports.default = HelpLinks;
