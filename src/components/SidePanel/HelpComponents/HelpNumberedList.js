"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Text_1 = require("@components/Text");
function HelpNumberedList(_a) {
    var items = _a.items, styles = _a.styles;
    return items.map(function (item, index) { return (<react_native_1.View 
    // eslint-disable-next-line react/no-array-index-key
    key={"numbered-list-item-".concat(index)} style={[styles.flexRow, styles.alignItemsStart, styles.mt3]}>
            <Text_1.default style={[styles.textNormal, styles.pr2, styles.userSelectNone]}>{"".concat(index + 1, ".")}</Text_1.default>
            <Text_1.default style={[styles.flex1]}>{item}</Text_1.default>
        </react_native_1.View>); });
}
exports.default = HelpNumberedList;
