"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const ScrollView_1 = require("@components/ScrollView");
const CardRowSkeleton_1 = require("@components/Skeletons/CardRowSkeleton");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
function WorkspaceCompanyCardsFeedAddedEmptyPage({ handleAssignCard, isDisabledAssignCardButton, shouldShowGBDisclaimer }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]} addBottomSafeAreaPadding>
            <EmptyStateComponent_1.default SkeletonComponent={CardRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={Illustrations.CompanyCardsEmptyState} containerStyles={styles.mt5} headerStyles={[styles.emptyStateCardIllustrationContainer, styles.justifyContentStart, { backgroundColor: colors_1.default.blue700 }]} headerContentStyles={styles.emptyStateCardIllustration} title={translate('workspace.moreFeatures.companyCards.emptyAddedFeedTitle')} subtitle={translate('workspace.moreFeatures.companyCards.emptyAddedFeedDescription')} buttons={[
            {
                buttonText: translate('workspace.companyCards.assignCard'),
                buttonAction: handleAssignCard,
                icon: Expensicons.Plus,
                success: true,
                isDisabled: isDisabledAssignCardButton,
            },
        ]}/>
            {!!shouldShowGBDisclaimer && <Text_1.default style={[styles.textMicroSupporting, styles.m5]}>{translate('workspace.companyCards.ukRegulation')}</Text_1.default>}
        </ScrollView_1.default>);
}
WorkspaceCompanyCardsFeedAddedEmptyPage.displayName = 'WorkspaceCompanyCardsFeedAddedEmptyPage';
exports.default = WorkspaceCompanyCardsFeedAddedEmptyPage;
