"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function Terms() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={[styles.renderHTML, styles.mb4]}>
            <RenderHTML_1.default html={translate('termsOfUse.terms')}/>
        </react_native_1.View>);
}
Terms.displayName = 'Terms';
exports.default = Terms;
