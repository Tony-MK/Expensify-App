"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AutoEmailLink_1 = require("@components/AutoEmailLink");
var Text_1 = require("@components/Text");
var TextLink_1 = require("@components/TextLink");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
function SubtitleWithBelowLink(_a) {
    var subtitle = _a.subtitle, subtitleStyle = _a.subtitleStyle, subtitleKeyBelowLink = _a.subtitleKeyBelowLink, _b = _a.onLinkPress, onLinkPress = _b === void 0 ? function () { } : _b, linkTranslationKey = _a.linkTranslationKey;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    return (<>
            <Text_1.default style={[styles.textAlignCenter]}>
                {!!subtitle && (<AutoEmailLink_1.default style={[styles.textAlignCenter, subtitleStyle]} text={subtitle}/>)}
                {!!linkTranslationKey && (<TextLink_1.default onPress={onLinkPress} style={[styles.link, styles.mt2, styles.textAlignCenter]}>
                        {" ".concat(translate(linkTranslationKey))}
                    </TextLink_1.default>)}
            </Text_1.default>
            {!!subtitleKeyBelowLink && (<AutoEmailLink_1.default style={[styles.textAlignCenter, subtitleStyle, styles.mt4]} text={translate(subtitleKeyBelowLink)}/>)}
        </>);
}
SubtitleWithBelowLink.displayName = 'SubtitleWithBelowLink';
exports.default = SubtitleWithBelowLink;
