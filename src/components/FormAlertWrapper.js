"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FormHelpMessage_1 = require("./FormHelpMessage");
const RenderHTML_1 = require("./RenderHTML");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
// The FormAlertWrapper offers a standardized way of showing error messages and offline functionality.
//
// This component takes other components as a child prop. It will then render any wrapped components as a function using "render props",
// and passes it a (bool) isOffline parameter. Child components can then use the isOffline variable to determine offline behavior.
function FormAlertWrapper({ children, containerStyles, errorMessageStyle, isAlertVisible = false, isMessageHtml = false, message = '', onFixTheErrorsLinkPressed = () => { }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    let content;
    if (!message?.length) {
        content = (<Text_1.default style={[styles.formError, styles.mb0]}>
                {`${translate('common.please')} `}
                <TextLink_1.default style={styles.label} onPress={onFixTheErrorsLinkPressed}>
                    {translate('common.fixTheErrors')}
                </TextLink_1.default>
                {` ${translate('common.inTheFormBeforeContinuing')}.`}
            </Text_1.default>);
    }
    else if (isMessageHtml && typeof message === 'string') {
        content = <RenderHTML_1.default html={`<alert-text>${message}</alert-text>`}/>;
    }
    return (<react_native_1.View style={containerStyles}>
            {isAlertVisible && (<FormHelpMessage_1.default message={message} style={[styles.mb3, errorMessageStyle]}>
                    {content}
                </FormHelpMessage_1.default>)}
            {children(isOffline)}
        </react_native_1.View>);
}
FormAlertWrapper.displayName = 'FormAlertWrapper';
exports.default = FormAlertWrapper;
