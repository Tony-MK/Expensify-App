"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViolationMessages;
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const Text_1 = require("./Text");
function ViolationMessages({ violations, isLast, containerStyle, textStyle, canEdit }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const violationMessages = (0, react_1.useMemo)(() => violations.map((violation) => [violation.name, ViolationsUtils_1.default.getViolationTranslation(violation, translate, canEdit)]), [canEdit, translate, violations]);
    return (<react_native_1.View style={[styles.mtn1, isLast ? styles.mb2 : styles.mb1, containerStyle, styles.gap1]}>
            {violationMessages.map(([name, message]) => (<Text_1.default key={`violationMessages.${name}`} style={[styles.ph5, styles.textLabelError, textStyle]}>
                    {message}
                </Text_1.default>))}
        </react_native_1.View>);
}
