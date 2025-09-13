"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
function TextWithMiddleEllipsis({ text, style, textStyle }) {
    return (<Text_1.default style={[style, textStyle]} ellipsizeMode="middle" numberOfLines={1}>
            {text}
        </Text_1.default>);
}
TextWithMiddleEllipsis.displayName = 'TextWithMiddleEllipsis';
exports.default = TextWithMiddleEllipsis;
