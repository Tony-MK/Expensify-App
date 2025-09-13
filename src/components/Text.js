"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var useTheme_1 = require("@hooks/useTheme");
var EmojiUtils_1 = require("@libs/EmojiUtils");
var FontUtils_1 = require("@styles/utils/FontUtils");
var variables_1 = require("@styles/variables");
var CustomStylesForChildrenProvider_1 = require("./CustomStylesForChildrenProvider");
function Text(_a) {
    var _b;
    var color = _a.color, _c = _a.fontSize, fontSize = _c === void 0 ? variables_1.default.fontSizeNormal : _c, _d = _a.textAlign, textAlign = _d === void 0 ? 'left' : _d, children = _a.children, _e = _a.family, family = _e === void 0 ? 'EXP_NEUE' : _e, _f = _a.style, style = _f === void 0 ? {} : _f, _g = _a.shouldUseDefaultLineHeight, shouldUseDefaultLineHeight = _g === void 0 ? true : _g, ref = _a.ref, props = __rest(_a, ["color", "fontSize", "textAlign", "children", "family", "style", "shouldUseDefaultLineHeight", "ref"]);
    var theme = (0, useTheme_1.default)();
    var customStyle = (0, react_1.useContext)(CustomStylesForChildrenProvider_1.CustomStylesForChildrenContext);
    var componentStyle = __assign(__assign(__assign({ color: color !== null && color !== void 0 ? color : theme.text, fontSize: fontSize, textAlign: textAlign }, FontUtils_1.default.fontFamily.platform[family]), react_native_1.StyleSheet.flatten(style)), react_native_1.StyleSheet.flatten(customStyle));
    if (!componentStyle.lineHeight && componentStyle.fontSize === variables_1.default.fontSizeNormal && shouldUseDefaultLineHeight) {
        componentStyle.lineHeight = variables_1.default.fontSizeNormalHeight;
    }
    var isOnlyCustomEmoji = (0, react_1.useMemo)(function () {
        if (typeof children === 'string') {
            return (0, EmojiUtils_1.containsOnlyCustomEmoji)(children);
        }
        if (Array.isArray(children)) {
            return children.every(function (child) {
                return child === null || child === undefined || (typeof child === 'string' && (0, EmojiUtils_1.containsOnlyCustomEmoji)(child));
            });
        }
        return false;
    }, [children]);
    if (isOnlyCustomEmoji) {
        componentStyle.fontFamily = (_b = FontUtils_1.default.fontFamily.single.CUSTOM_EMOJI_FONT) === null || _b === void 0 ? void 0 : _b.fontFamily;
    }
    return (<react_native_1.Text allowFontScaling={false} ref={ref} style={componentStyle} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}>
            {children}
        </react_native_1.Text>);
}
Text.displayName = 'Text';
exports.default = Text;
