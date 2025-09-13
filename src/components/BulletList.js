"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Text_1 = require("./Text");
function BulletList({ items, header }) {
    const styles = (0, useThemeStyles_1.default)();
    const baseTextStyles = [styles.mutedNormalTextLabel];
    const renderBulletListHeader = () => {
        if (typeof header === 'string') {
            return <Text_1.default style={baseTextStyles}>{header}</Text_1.default>;
        }
        return header;
    };
    const renderBulletPoint = (item) => {
        return (<Text_1.default style={baseTextStyles} key={item}>
                <Text_1.default style={[styles.ph2, baseTextStyles]}>•</Text_1.default>
                {item}
            </Text_1.default>);
    };
    return (<react_native_1.View style={[styles.w100, styles.mt2]}>
            {renderBulletListHeader()}
            <react_native_1.View>{items.map((item) => renderBulletPoint(item))}</react_native_1.View>
        </react_native_1.View>);
}
BulletList.displayName = 'BulletList';
exports.default = BulletList;
