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
const variables_1 = require("@styles/variables");
function PDFInfoMessage({ onShowForm }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.alignItemsCenter}>
            <Icon_1.default fill={theme.icon} src={Expensicons.EyeDisabled} width={variables_1.default.iconSizeSuperLarge} height={variables_1.default.iconSizeSuperLarge}/>
            <Text_1.default style={[styles.textHeadline, styles.mb3, styles.mt3]}>{translate('attachmentView.pdfPasswordForm.title')}</Text_1.default>
            <Text_1.default>{translate('attachmentView.pdfPasswordForm.infoText')}</Text_1.default>
            <Text_1.default>
                {translate('attachmentView.pdfPasswordForm.beforeLinkText')}
                <TextLink_1.default onPress={onShowForm}>{` ${translate('attachmentView.pdfPasswordForm.linkText')} `}</TextLink_1.default>
                {translate('attachmentView.pdfPasswordForm.afterLinkText')}
            </Text_1.default>
        </react_native_1.View>);
}
PDFInfoMessage.displayName = 'PDFInfoMessage';
exports.default = PDFInfoMessage;
