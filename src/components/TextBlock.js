"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TextBlock component splits a given text into individual words and displays
 * each word within a Text component.
 */
const react_1 = require("react");
const Text_1 = require("./Text");
function TextBlock({ color, textStyles, text }) {
    const words = (0, react_1.useMemo)(() => text.match(/(\S+\s*)/g) ?? [], [text]);
    return (<>
            {words.map((word) => (<Text_1.default color={color} style={textStyles} key={word}>
                    {word}
                </Text_1.default>))}
        </>);
}
TextBlock.displayName = 'TextBlock';
exports.default = (0, react_1.memo)(TextBlock);
