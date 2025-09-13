"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const fileDownload_1 = require("@libs/fileDownload");
const ReceiptUploadRetryHandler_1 = require("@libs/ReceiptUploadRetryHandler");
const ConfirmModal_1 = require("./ConfirmModal");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function DotIndicatorMessage({ messages = {}, style, type, textStyles, dismissError = () => { } }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [shouldShowErrorModal, setShouldShowErrorModal] = (0, react_1.useState)(false);
    if (Object.keys(messages).length === 0) {
        return null;
    }
    // Fetch the keys, sort them, and map through each key to get the corresponding message
    const sortedMessages = Object.keys(messages)
        .sort()
        .map((key) => messages[key])
        .filter((message) => message !== null);
    // Removing duplicates using Set and transforming the result into an array
    const uniqueMessages = [...new Set(sortedMessages)].map((message) => message);
    const isErrorMessage = type === 'error';
    const renderMessage = (message, index) => {
        if ((0, ErrorUtils_1.isReceiptError)(message)) {
            return (<>
                    <Text_1.default key={index} style={styles.offlineFeedback.text}>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles(isErrorMessage)]}>{translate('iou.error.receiptFailureMessage')}</Text_1.default>
                        <TextLink_1.default style={[StyleUtils.getDotIndicatorTextStyles(), styles.link]} onPress={() => (0, ReceiptUploadRetryHandler_1.default)(message, dismissError, setShouldShowErrorModal)}>
                            {translate('iou.error.tryAgainMessage')}
                        </TextLink_1.default>
                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles(isErrorMessage)]}>{translate('common.or')}</Text_1.default>
                        <TextLink_1.default style={[StyleUtils.getDotIndicatorTextStyles(), styles.link]} onPress={() => {
                    (0, fileDownload_1.default)(message.source, message.filename).finally(() => dismissError());
                }}>
                            {translate('iou.error.saveFileMessage')}
                        </TextLink_1.default>

                        <Text_1.default style={[StyleUtils.getDotIndicatorTextStyles(isErrorMessage)]}>{translate('iou.error.uploadLaterMessage')}</Text_1.default>
                    </Text_1.default>

                    <ConfirmModal_1.default isVisible={shouldShowErrorModal} onConfirm={() => {
                    setShouldShowErrorModal(false);
                }} prompt={translate('common.genericErrorMessage')} confirmText={translate('common.ok')} shouldShowCancelButton={false}/>
                </>);
        }
        return (<Text_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={index} style={[StyleUtils.getDotIndicatorTextStyles(isErrorMessage), textStyles]}>
                {(0, ErrorUtils_1.isTranslationKeyError)(message) ? translate(message.translationKey) : message}
            </Text_1.default>);
    };
    return (<react_native_1.View style={[styles.dotIndicatorMessage, style]}>
            <react_native_1.View style={styles.offlineFeedback.errorDot}>
                <Icon_1.default src={Expensicons.DotIndicator} fill={isErrorMessage ? theme.danger : theme.success}/>
            </react_native_1.View>
            <react_native_1.View style={styles.offlineFeedback.textContainer}>{uniqueMessages.map(renderMessage)}</react_native_1.View>
        </react_native_1.View>);
}
DotIndicatorMessage.displayName = 'DotIndicatorMessage';
exports.default = DotIndicatorMessage;
