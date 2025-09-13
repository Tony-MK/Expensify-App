"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useEnvironment_1 = require("@hooks/useEnvironment");
var useLocalize_1 = require("@hooks/useLocalize");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ReportUtils_1 = require("@libs/ReportUtils");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var Icon_1 = require("./Icon");
var Text_1 = require("./Text");
var TextBlock_1 = require("./TextBlock");
var TextLinkBlock_1 = require("./TextLinkBlock");
function ImportedFromAccountingSoftware(_a) {
    var policyID = _a.policyID, currentConnectionName = _a.currentConnectionName, translatedText = _a.translatedText, connectedIntegration = _a.connectedIntegration;
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var environmentURL = (0, useEnvironment_1.default)().environmentURL;
    var icon = (0, ReportUtils_1.getIntegrationIcon)(connectedIntegration);
    return (<react_native_1.View style={[styles.alignItemsCenter, styles.flexRow, styles.flexWrap]}>
            <TextBlock_1.default textStyles={[styles.textNormal, styles.colorMuted]} text={"".concat(translatedText, " ")}/>
            <TextLinkBlock_1.default style={[styles.textNormal, styles.link]} href={"".concat(environmentURL, "/").concat(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID))} text={"".concat(currentConnectionName, " ").concat(translate('workspace.accounting.settings'))} prefixIcon={icon ? (<Icon_1.default src={icon} height={variables_1.default.iconSizeMedium} width={variables_1.default.iconSizeMedium} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.SMALLER, ''), styles.appBG]}/>) : undefined}/>
            <Text_1.default style={[styles.textNormal, styles.colorMuted]}>.</Text_1.default>
        </react_native_1.View>);
}
ImportedFromAccountingSoftware.displayName = 'ImportedFromAccountingSoftware';
exports.default = ImportedFromAccountingSoftware;
