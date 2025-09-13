"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function CustomListHeader({ canSelectMultiple, leftHeaderText = '', rightHeaderText = '', rightHeaderMinimumWidth = 60 }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const header = (<react_native_1.View style={[
            styles.flex1,
            styles.flexRow,
            styles.justifyContentBetween,
            // Required padding accounting for the checkbox in multi-select mode
            canSelectMultiple && styles.pl3,
        ]}>
            <Text_1.default style={styles.textMicroSupporting}>{leftHeaderText}</Text_1.default>
            <react_native_1.View style={[StyleUtils.getMinimumWidth(rightHeaderMinimumWidth)]}>
                <Text_1.default style={[styles.textMicroSupporting, styles.textAlignCenter]}>{rightHeaderText}</Text_1.default>
            </react_native_1.View>
        </react_native_1.View>);
    if (canSelectMultiple) {
        return header;
    }
    return <react_native_1.View style={[styles.flexRow, styles.ph9, styles.pv3, styles.pb5]}>{header}</react_native_1.View>;
}
exports.default = CustomListHeader;
