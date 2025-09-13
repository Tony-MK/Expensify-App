"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const LocalePicker_1 = require("@components/LocalePicker");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const currentYear = new Date().getFullYear();
function Licenses() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<>
            <Text_1.default style={[styles.textExtraSmallSupporting, styles.mb4]}>{`© ${currentYear} Expensify`}</Text_1.default>
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
