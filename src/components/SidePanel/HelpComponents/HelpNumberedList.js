"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
function HelpNumberedList({ items, styles }) {
    return items.map((item, index) => (<react_native_1.View 
    // eslint-disable-next-line react/no-array-index-key
    key={`numbered-list-item-${index}`} style={[styles.flexRow, styles.alignItemsStart, styles.mt3]}>
            <Text_1.default style={[styles.textNormal, styles.pr2, styles.userSelectNone]}>{`${index + 1}.`}</Text_1.default>
            <Text_1.default style={[styles.flex1]}>{item}</Text_1.default>
        </react_native_1.View>));
}
exports.default = HelpNumberedList;
