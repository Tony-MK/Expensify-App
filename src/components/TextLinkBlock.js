"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TextLinkBlock component splits a given text into individual words and displays
 * each word within a TextLink component so the link text wraps naturally.
 */
var react_1 = require("react");
var react_native_1 = require("react-native");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Link_1 = require("@userActions/Link");
var CONST_1 = require("@src/CONST");
var Pressable_1 = require("./Pressable");
var Text_1 = require("./Text");
var TextLink_1 = require("./TextLink");
function TextLinkBlock(_a) {
    var _b;
    var text = _a.text, style = _a.style, prefixIcon = _a.prefixIcon, rest = __rest(_a, ["text", "style", "prefixIcon"]);
    var words = (0, react_1.useMemo)(function () { var _a; return (_a = text.match(/(\S+\s*)/g)) !== null && _a !== void 0 ? _a : []; }, [text]);
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var styles = (0, useThemeStyles_1.default)();
    var openLink = function () {
        if (!rest.href) {
            return;
        }
        (0, Link_1.openLink)(rest.href, environmentURL);
    };
    return (<Pressable_1.PressableWithoutFeedback role={CONST_1.default.ROLE.BUTTON} style={styles.dContents} onPress={openLink} accessible accessibilityLabel={(_b = rest.href) !== null && _b !== void 0 ? _b : CONST_1.default.ROLE.BUTTON}>
            {words.map(function (word, index) { return (<react_native_1.View 
        // eslint-disable-next-line react/no-array-index-key
        key={"".concat(word, "-").concat(index)} style={[styles.dInlineFlex, styles.alignItemsCenter, styles.flexRow]}>
                    {prefixIcon && index === 0 && prefixIcon}
                    {!!prefixIcon && index === 0 && <Text_1.default> </Text_1.default>}
                    <TextLink_1.default style={style} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}>
                        {word}
                    </TextLink_1.default>
                </react_native_1.View>); })}
        </Pressable_1.PressableWithoutFeedback>);
}
TextLinkBlock.displayName = 'TextLinkBlock';
exports.default = (0, react_1.memo)(TextLinkBlock);
