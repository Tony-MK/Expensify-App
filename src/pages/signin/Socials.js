"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Link = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const socialList = [
    {
        iconURL: Expensicons.Podcast,
        link: CONST_1.default.SOCIALS.PODCAST,
    },
    {
        iconURL: Expensicons.Twitter,
        link: CONST_1.default.SOCIALS.TWITTER,
    },
    {
        iconURL: Expensicons.Instagram,
        link: CONST_1.default.SOCIALS.INSTAGRAM,
    },
    {
        iconURL: Expensicons.Facebook,
        link: CONST_1.default.SOCIALS.FACEBOOK,
    },
    {
        iconURL: Expensicons.Linkedin,
        link: CONST_1.default.SOCIALS.LINKEDIN,
    },
];
function Socials() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexRow, styles.flexWrap]}>
            {socialList.map((social) => (<PressableWithoutFeedback_1.default key={social.link} href={social.link} onPress={(e) => {
                e?.preventDefault();
                Link.openExternalLink(social.link);
            }} accessible={false} style={[styles.mr1, styles.mt1]} shouldUseAutoHitSlop={false}>
                    {({ hovered, pressed }) => (<Icon_1.default src={social.iconURL} height={variables_1.default.iconSizeLarge} width={variables_1.default.iconSizeLarge} fill={hovered || pressed ? theme.link : theme.textLight}/>)}
                </PressableWithoutFeedback_1.default>))}
        </react_native_1.View>);
}
Socials.displayName = 'Socials';
exports.default = Socials;
