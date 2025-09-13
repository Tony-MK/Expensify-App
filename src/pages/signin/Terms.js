"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var RenderHTML_1 = require("@components/RenderHTML");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
function Terms() {
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    return (<react_native_1.View style={[styles.renderHTML, styles.mb4]}>
            <RenderHTML_1.default html={translate('termsOfUse.terms')}/>
        </react_native_1.View>);
}
Terms.displayName = 'Terms';
exports.default = Terms;
