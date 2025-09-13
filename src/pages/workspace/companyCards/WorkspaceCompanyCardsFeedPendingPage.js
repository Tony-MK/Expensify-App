"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const Illustrations_1 = require("@components/Icon/Illustrations");
const ScrollView_1 = require("@components/ScrollView");
const CardRowSkeleton_1 = require("@components/Skeletons/CardRowSkeleton");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Report_1 = require("@libs/actions/Report");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
function WorkspaceCompanyCardsFeedPendingPage() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]}>
            <EmptyStateComponent_1.default SkeletonComponent={CardRowSkeleton_1.default} containerStyles={styles.mt5} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={Illustrations_1.CompanyCardsPendingState} headerStyles={[styles.emptyStateCardIllustrationContainer, { backgroundColor: colors_1.default.ice800 }]} headerContentStyles={styles.pendingStateCardIllustration} title={translate('workspace.moreFeatures.companyCards.pendingFeedTitle')}>
                <Text_1.default>
                    {translate('workspace.moreFeatures.companyCards.pendingFeedDescription')}
                    <TextLink_1.default onPress={() => (0, Report_1.navigateToConciergeChat)()}> {CONST_1.default.CONCIERGE_CHAT_NAME}</TextLink_1.default>.
                </Text_1.default>
            </EmptyStateComponent_1.default>
        </ScrollView_1.default>);
}
WorkspaceCompanyCardsFeedPendingPage.displayName = 'WorkspaceCompanyCardsFeedPendingPage';
exports.default = WorkspaceCompanyCardsFeedPendingPage;
