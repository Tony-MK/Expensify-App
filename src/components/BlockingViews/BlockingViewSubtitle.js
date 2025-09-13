"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AutoEmailLink_1 = require("@components/AutoEmailLink");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function BlockingViewSubtitle({ subtitle, subtitleStyle, onLinkPress = () => { }, linkTranslationKey, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<>
            {!!subtitle && (<AutoEmailLink_1.default style={[styles.textAlignCenter, subtitleStyle]} text={subtitle}/>)}
            {!!linkTranslationKey && (<TextLink_1.default onPress={onLinkPress} style={[styles.link, styles.mt2]}>
                    {translate(linkTranslationKey)}
                </TextLink_1.default>)}
        </>);
}
BlockingViewSubtitle.displayName = 'BlockingViewSubtitle';
exports.default = BlockingViewSubtitle;
