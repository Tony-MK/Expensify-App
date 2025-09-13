"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AutoEmailLink_1 = require("@components/AutoEmailLink");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function SubtitleWithBelowLink({ subtitle, subtitleStyle, subtitleKeyBelowLink, onLinkPress = () => { }, linkTranslationKey, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<>
            <Text_1.default style={[styles.textAlignCenter]}>
                {!!subtitle && (<AutoEmailLink_1.default style={[styles.textAlignCenter, subtitleStyle]} text={subtitle}/>)}
                {!!linkTranslationKey && (<TextLink_1.default onPress={onLinkPress} style={[styles.link, styles.mt2, styles.textAlignCenter]}>
                        {` ${translate(linkTranslationKey)}`}
                    </TextLink_1.default>)}
            </Text_1.default>
            {!!subtitleKeyBelowLink && (<AutoEmailLink_1.default style={[styles.textAlignCenter, subtitleStyle, styles.mt4]} text={translate(subtitleKeyBelowLink)}/>)}
        </>);
}
SubtitleWithBelowLink.displayName = 'SubtitleWithBelowLink';
exports.default = SubtitleWithBelowLink;
