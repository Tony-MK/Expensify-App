"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Environment = require("@libs/Environment/Environment");
const CONST_1 = require("@src/CONST");
const package_json_1 = require("../../package.json");
const Badge_1 = require("./Badge");
const ENVIRONMENT_SHORT_FORM = {
    [CONST_1.default.ENVIRONMENT.DEV]: 'DEV',
    [CONST_1.default.ENVIRONMENT.STAGING]: 'STG',
    [CONST_1.default.ENVIRONMENT.PRODUCTION]: 'PROD',
    [CONST_1.default.ENVIRONMENT.ADHOC]: 'ADHOC',
};
function EnvironmentBadge() {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { environment, isProduction } = (0, useEnvironment_1.default)();
    const adhoc = environment === CONST_1.default.ENVIRONMENT.ADHOC;
    const success = environment === CONST_1.default.ENVIRONMENT.STAGING;
    const error = environment !== CONST_1.default.ENVIRONMENT.STAGING && environment !== CONST_1.default.ENVIRONMENT.ADHOC;
    const badgeEnvironmentStyle = StyleUtils.getEnvironmentBadgeStyle(success, error, adhoc);
    // If we are on production, don't show any badge
    if (isProduction) {
        return null;
    }
    const text = Environment.isInternalTestBuild() ? `v${package_json_1.default.version} PR:${CONST_1.default.PULL_REQUEST_NUMBER}` : ENVIRONMENT_SHORT_FORM[environment];
    return (<Badge_1.default success={success} error={error} text={text} badgeStyles={[styles.alignSelfStart, styles.headerEnvBadge, styles.environmentBadge, badgeEnvironmentStyle]} textStyles={styles.headerEnvBadgeText} environment={environment} pressable/>);
}
EnvironmentBadge.displayName = 'EnvironmentBadge';
exports.default = EnvironmentBadge;
