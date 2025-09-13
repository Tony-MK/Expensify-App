"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const Text_1 = require("./Text");
function TextPill({ color, textStyles, children }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Text_1.default style={[{ backgroundColor: color ?? colors_1.default.red, borderRadius: 6 }, styles.overflowHidden, styles.textStrong, styles.ph2, styles.pv1, styles.flexShrink0, textStyles]}>
            {children}
        </Text_1.default>);
}
TextPill.displayName = 'TextPill';
exports.default = TextPill;
