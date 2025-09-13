"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function NextStepEmailRenderer({ tnode }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<Text_1.default testID="email-with-break-opportunities" style={[styles.breakWord, styles.textLabelSupporting, styles.textStrong]}>
            {'data' in tnode ? tnode.data : ''}
        </Text_1.default>);
}
NextStepEmailRenderer.displayName = 'NextStepEmailRenderer';
exports.default = NextStepEmailRenderer;
