"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const CONST_1 = require("@src/CONST");
function HelpBulletList({ items, styles }) {
    return items.map((item, index) => (<react_native_1.View 
    // eslint-disable-next-line react/no-array-index-key
    key={`bullet-list-item-${index}`} style={[styles.flexRow, styles.alignItemsStart, styles.mt3]}>
            <Text_1.default style={[styles.textNormal, styles.pr2, styles.userSelectNone]}>{CONST_1.default.DOT_SEPARATOR}</Text_1.default>
            <react_native_1.View style={[styles.flex1]}>{item}</react_native_1.View>
        </react_native_1.View>));
}
exports.default = HelpBulletList;
