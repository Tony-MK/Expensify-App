"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const Icon_1 = require("./Icon");
const Text_1 = require("./Text");
const TextBlock_1 = require("./TextBlock");
const TextLinkBlock_1 = require("./TextLinkBlock");
function ImportedFromAccountingSoftware({ policyID, currentConnectionName, translatedText, connectedIntegration }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const icon = (0, ReportUtils_1.getIntegrationIcon)(connectedIntegration);
    return (<react_native_1.View style={[styles.alignItemsCenter, styles.flexRow, styles.flexWrap]}>
            <TextBlock_1.default textStyles={[styles.textNormal, styles.colorMuted]} text={`${translatedText} `}/>
            <TextLinkBlock_1.default style={[styles.textNormal, styles.link]} href={`${environmentURL}/${ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID)}`} text={`${currentConnectionName} ${translate('workspace.accounting.settings')}`} prefixIcon={icon ? (<Icon_1.default src={icon} height={variables_1.default.iconSizeMedium} width={variables_1.default.iconSizeMedium} additionalStyles={[StyleUtils.getAvatarBorderStyle(CONST_1.default.AVATAR_SIZE.SMALLER, ''), styles.appBG]}/>) : undefined}/>
            <Text_1.default style={[styles.textNormal, styles.colorMuted]}>.</Text_1.default>
        </react_native_1.View>);
}
ImportedFromAccountingSoftware.displayName = 'ImportedFromAccountingSoftware';
exports.default = ImportedFromAccountingSoftware;
