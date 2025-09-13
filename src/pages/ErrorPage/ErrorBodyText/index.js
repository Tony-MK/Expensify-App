"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ErrorBodyText() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {`${translate('genericErrorPage.body.helpTextMobile')} `}
            <TextLink_1.default href={CONST_1.default.NEW_EXPENSIFY_URL} style={[styles.link]}>
                {translate('genericErrorPage.body.helpTextWeb')}
            </TextLink_1.default>
        </Text_1.default>);
}
ErrorBodyText.displayName = 'ErrorBodyText';
exports.default = ErrorBodyText;
