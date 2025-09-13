"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FixedFooter_1 = require("@components/FixedFooter");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const Link = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctUserDimensionsPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const config = policy?.connections?.intacct?.config;
    const userDimensions = policy?.connections?.intacct?.config?.mappings?.dimensions ?? [];
    return (<ConnectionLayout_1.default displayName={SageIntacctUserDimensionsPage.displayName} headerTitle="workspace.intacct.userDefinedDimension" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} shouldUseScrollView={false} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT.getRoute(policyID))}>
            {userDimensions?.length === 0 ? (<react_native_1.View style={[styles.alignItemsCenter, styles.flex1, styles.justifyContentCenter]}>
                    <Icon_1.default src={Illustrations.FolderWithPapers} width={160} height={100}/>

                    <react_native_1.View style={[styles.w100, styles.pt5]}>
                        <react_native_1.View style={[styles.justifyContentCenter, styles.ph5]}>
                            <Text_1.default style={[styles.notFoundTextHeader]}>{translate('workspace.intacct.addAUserDefinedDimension')}</Text_1.default>
                        </react_native_1.View>

                        <react_native_1.View style={[styles.ph5]}>
                            <Text_1.default style={[styles.textAlignCenter]}>
                                <TextLink_1.default style={styles.link} onPress={() => {
                Link.openExternalLink(CONST_1.default.SAGE_INTACCT_INSTRUCTIONS);
            }}>
                                    {translate('workspace.intacct.detailedInstructionsLink')}
                                </TextLink_1.default>
                                <Text_1.default>{translate('workspace.intacct.detailedInstructionsRestOfSentence')}</Text_1.default>
                            </Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>) : (<>
                    <react_native_1.View style={[styles.ph5]}>
                        <Text_1.default style={[styles.textAlignLeft]}>
                            <TextLink_1.default style={styles.link} onPress={() => {
                Link.openExternalLink(CONST_1.default.SAGE_INTACCT_INSTRUCTIONS);
            }}>
                                {translate('workspace.intacct.detailedInstructionsLink')}
                            </TextLink_1.default>
                            <Text_1.default>{translate('workspace.intacct.detailedInstructionsRestOfSentence')}</Text_1.default>
                        </Text_1.default>
                    </react_native_1.View>
                    <ScrollView_1.default addBottomSafeAreaPadding>
                        {userDimensions.map((userDimension) => (<OfflineWithFeedback_1.default key={userDimension.dimension} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${userDimension.dimension}`], config?.pendingFields)}>
                                <MenuItemWithTopDescription_1.default title={userDimension.dimension} description={translate('workspace.intacct.userDefinedDimension')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EDIT_USER_DIMENSION.getRoute(policyID, userDimension.dimension))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([`${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${userDimension.dimension}`], config?.errorFields)
                    ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                    : undefined}/>
                            </OfflineWithFeedback_1.default>))}
                    </ScrollView_1.default>
                </>)}
            <FixedFooter_1.default style={[styles.mt5]} addBottomSafeAreaPadding>
                <Button_1.default success text={translate('workspace.intacct.addUserDefinedDimension')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADD_USER_DIMENSION.getRoute(policyID))} pressOnEnter large/>
            </FixedFooter_1.default>
        </ConnectionLayout_1.default>);
}
SageIntacctUserDimensionsPage.displayName = 'SageIntacctUserDimensionsPage';
exports.default = (0, withPolicy_1.default)(SageIntacctUserDimensionsPage);
