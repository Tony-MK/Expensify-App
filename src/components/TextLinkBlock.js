"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TextLinkBlock component splits a given text into individual words and displays
 * each word within a TextLink component so the link text wraps naturally.
 */
const react_1 = require("react");
const react_native_1 = require("react-native");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const Pressable_1 = require("./Pressable");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
function TextLinkBlock({ text, style, prefixIcon, ...rest }) {
    const words = (0, react_1.useMemo)(() => text.match(/(\S+\s*)/g) ?? [], [text]);
    const { environmentURL } = (0, useEnvironment_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const openLink = () => {
        if (!rest.href) {
            return;
        }
        (0, Link_1.openLink)(rest.href, environmentURL);
    };
    return (<Pressable_1.PressableWithoutFeedback role={CONST_1.default.ROLE.BUTTON} style={styles.dContents} onPress={openLink} accessible accessibilityLabel={rest.href ?? CONST_1.default.ROLE.BUTTON}>
            {words.map((word, index) => (<react_native_1.View 
        // eslint-disable-next-line react/no-array-index-key
        key={`${word}-${index}`} style={[styles.dInlineFlex, styles.alignItemsCenter, styles.flexRow]}>
                    {prefixIcon && index === 0 && prefixIcon}
                    {!!prefixIcon && index === 0 && <Text_1.default> </Text_1.default>}
                    <TextLink_1.default style={style} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}>
                        {word}
                    </TextLink_1.default>
                </react_native_1.View>))}
        </Pressable_1.PressableWithoutFeedback>);
}
TextLinkBlock.displayName = 'TextLinkBlock';
exports.default = (0, react_1.memo)(TextLinkBlock);
