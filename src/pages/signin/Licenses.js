"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var LocalePicker_1 = require("@components/LocalePicker");
var RenderHTML_1 = require("@components/RenderHTML");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var currentYear = new Date().getFullYear();
function Licenses() {
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    return (<>
            <Text_1.default style={[styles.textExtraSmallSupporting, styles.mb4]}>{"\u00A9 ".concat(currentYear, " Expensify")}</Text_1.default>
            <react_native_1.View style={[styles.renderHTML, styles.flexRow]}>
                <RenderHTML_1.default html={translate('termsOfUse.license')}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt4, styles.alignItemsCenter, styles.mb2, styles.flexRow, styles.justifyContentBetween]}>
                <LocalePicker_1.default size="small"/>
            </react_native_1.View>
        </>);
}
Licenses.displayName = 'Licenses';
exports.default = Licenses;
