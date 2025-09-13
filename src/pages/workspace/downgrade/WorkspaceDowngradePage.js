"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useCardFeeds_1 = require("@hooks/useCardFeeds");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Policy_1 = require("@src/libs/actions/Policy/Policy");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const DowngradeConfirmation_1 = require("./DowngradeConfirmation");
const DowngradeIntro_1 = require("./DowngradeIntro");
function WorkspaceDowngradePage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const policyID = route.params?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const [cardFeeds] = (0, useCardFeeds_1.default)(policyID);
    const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeeds);
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const [isDowngradeWarningModalOpen, setIsDowngradeWarningModalOpen] = (0, react_1.useState)(false);
    const canPerformDowngrade = (0, react_1.useMemo)(() => (0, PolicyUtils_1.canModifyPlan)(policyID), [policyID]);
    const isDowngraded = (0, react_1.useMemo)(() => (0, PolicyUtils_1.isCollectPolicy)(policy), [policy]);
    const onDowngradeToTeam = () => {
        if (!canPerformDowngrade || !policy) {
            return;
        }
        if (Object.keys(companyFeeds).length > 1) {
            setIsDowngradeWarningModalOpen(true);
            return;
        }
        (0, Policy_1.downgradeToTeam)(policy.id);
    };
    const onClose = () => {
        setIsDowngradeWarningModalOpen(false);
        Navigation_1.default.dismissModal();
    };
    const onMoveToCompanyCardFeeds = () => {
        if (!policyID) {
            return;
        }
        setIsDowngradeWarningModalOpen(false);
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS.getRoute(policyID));
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_COMPANY_CARDS_SELECT_FEED.getRoute(policyID));
    };
    if (!canPerformDowngrade) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default shouldShowOfflineIndicator testID="workspaceDowngradePage" offlineIndicatorStyle={styles.mtAuto}>
            <HeaderWithBackButton_1.default title={translate('common.downgradeWorkspace')} onBackButtonPress={() => {
            if (isDowngraded) {
                Navigation_1.default.dismissModal();
            }
            else {
                Navigation_1.default.goBack();
            }
        }}/>
            <ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
                {isDowngraded && !!policyID && (<DowngradeConfirmation_1.default onConfirmDowngrade={() => {
                Navigation_1.default.dismissModal();
            }} policyID={policyID}/>)}
                {!isDowngraded && (<DowngradeIntro_1.default policyID={policyID} onDowngrade={onDowngradeToTeam} buttonDisabled={isOffline} loading={policy?.isPendingDowngrade} backTo={route.params.backTo}/>)}
            </ScrollView_1.default>
            <ConfirmModal_1.default title={translate('workspace.moreFeatures.companyCards.downgradeTitle')} isVisible={isDowngradeWarningModalOpen} onConfirm={onClose} shouldShowCancelButton={false} onCancel={onClose} prompt={<Text_1.default>
                        {translate('workspace.moreFeatures.companyCards.downgradeSubTitleFirstPart')}{' '}
                        <TextLink_1.default style={styles.link} onPress={onMoveToCompanyCardFeeds}>
                            {translate('workspace.moreFeatures.companyCards.downgradeSubTitleMiddlePart')}
                        </TextLink_1.default>{' '}
                        {translate('workspace.moreFeatures.companyCards.downgradeSubTitleLastPart')}
                    </Text_1.default>} confirmText={translate('common.buttonConfirm')}/>
        </ScreenWrapper_1.default>);
}
exports.default = WorkspaceDowngradePage;
