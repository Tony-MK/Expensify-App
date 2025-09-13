"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const EmptyStateComponent_1 = require("@components/EmptyStateComponent");
const Illustrations = require("@components/Icon/Illustrations");
const ScrollView_1 = require("@components/ScrollView");
const CardRowSkeleton_1 = require("@components/Skeletons/CardRowSkeleton");
const Text_1 = require("@components/Text");
const useEmptyViewHeaderHeight_1 = require("@hooks/useEmptyViewHeaderHeight");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
function EmptyCardView({ isBankAccountVerified, policyID }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    const headerHeight = (0, useEmptyViewHeaderHeight_1.default)(shouldUseNarrowLayout, isBankAccountVerified);
    return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.flexShrink0]} addBottomSafeAreaPadding>
            <react_native_1.View style={[{ height: windowHeight - headerHeight }, styles.pt5]}>
                <EmptyStateComponent_1.default SkeletonComponent={CardRowSkeleton_1.default} headerMediaType={CONST_1.default.EMPTY_STATE_MEDIA.ILLUSTRATION} headerMedia={isBankAccountVerified ? Illustrations.EmptyCardState : Illustrations.CompanyCardsPendingState} headerStyles={isBankAccountVerified
            ? [
                {
                    overflow: 'hidden',
                    backgroundColor: colors_1.default.green700,
                },
                shouldUseNarrowLayout && { maxHeight: 250 },
            ]
            : [styles.emptyStateCardIllustrationContainer, { backgroundColor: colors_1.default.ice800 }]} title={translate(`workspace.expensifyCard.${isBankAccountVerified ? 'issueAndManageCards' : 'verificationInProgress'}`)} subtitle={translate(`workspace.expensifyCard.${isBankAccountVerified ? 'getStartedIssuing' : 'verifyingTheDetails'}`)} headerContentStyles={isBankAccountVerified ? null : styles.pendingStateCardIllustration} minModalHeight={isBankAccountVerified ? 500 : 400}/>
            </react_native_1.View>
            <Text_1.default style={[styles.textMicroSupporting, styles.m5]}>
                {translate(isUkEuCurrencySupported ? 'workspace.expensifyCard.euUkDisclaimer' : 'workspace.expensifyCard.disclaimer')}
            </Text_1.default>
        </ScrollView_1.default>);
}
EmptyCardView.displayName = 'EmptyCardView';
exports.default = EmptyCardView;
