"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const navigateAfterOnboarding_1 = require("@libs/navigateAfterOnboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Report_1 = require("@userActions/Report");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingWorkspaceOptional({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const [onboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const [conciergeChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CONCIERGE_REPORT_ID, { canBeMissing: true });
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    // When we merge public email with work email, we now want to navigate to the
    // concierge chat report of the new work email and not the last accessed report.
    const mergedAccountConciergeReportID = !onboardingValues?.shouldRedirectToClassicAfterMerge && onboardingValues?.shouldValidate ? conciergeChatReportID : undefined;
    // We need to use isSmallScreenWidth, see navigateAfterOnboarding function comment
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { onboardingIsMediumOrLargerScreenWidth, isSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const ICON_SIZE = 48;
    const processedHelperText = `<comment><muted-text-label>${translate('onboarding.workspace.price')}</muted-text-label></comment>`;
    (0, react_1.useEffect)(() => {
        (0, Welcome_1.setOnboardingErrorMessage)('');
    }, []);
    const section = [
        {
            icon: Illustrations.MoneyReceipts,
            titleTranslationKey: 'onboarding.workspace.explanationModal.descriptionOne',
        },
        {
            icon: Illustrations.Tag,
            titleTranslationKey: 'onboarding.workspace.explanationModal.descriptionTwo',
        },
        {
            icon: Illustrations.ReportReceipt,
            titleTranslationKey: 'onboarding.workspace.explanationModal.descriptionThree',
        },
    ];
    const completeOnboarding = (0, react_1.useCallback)(() => {
        if (!onboardingPurposeSelected) {
            return;
        }
        (0, Report_1.completeOnboarding)({
            engagementChoice: onboardingPurposeSelected,
            onboardingMessage: onboardingMessages[onboardingPurposeSelected],
            firstName: currentUserPersonalDetails.firstName,
            lastName: currentUserPersonalDetails.lastName,
            adminsChatReportID: onboardingAdminsChatReportID,
            onboardingPolicyID,
        });
        (0, Welcome_1.setOnboardingAdminsChatReportID)();
        (0, Welcome_1.setOnboardingPolicyID)();
        (0, navigateAfterOnboarding_1.navigateAfterOnboardingWithMicrotaskQueue)(isSmallScreenWidth, isBetaEnabled(CONST_1.default.BETAS.DEFAULT_ROOMS), onboardingPolicyID, mergedAccountConciergeReportID);
    }, [
        onboardingPurposeSelected,
        currentUserPersonalDetails.firstName,
        currentUserPersonalDetails.lastName,
        onboardingAdminsChatReportID,
        onboardingMessages,
        onboardingPolicyID,
        isSmallScreenWidth,
        isBetaEnabled,
        mergedAccountConciergeReportID,
    ]);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={BaseOnboardingWorkspaceOptional.displayName} style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default progressBarPercentage={100}/>
            <react_native_1.View style={[styles.flexGrow1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb3]}>
                    <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.workspace.title')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.mb2}>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted]}>{translate('onboarding.workspace.subtitle')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View>
                    {section.map((item) => {
            return (<react_native_1.View key={item.titleTranslationKey} style={[styles.mt2, styles.mb3, styles.flexRow]}>
                                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.flex1]}>
                                    <Icon_1.default src={item.icon} height={ICON_SIZE} width={ICON_SIZE} additionalStyles={[styles.mr3]}/>
                                    <react_native_1.View style={[styles.flexColumn, styles.flex1]}>
                                        <Text_1.default style={[styles.textStrong, styles.lh20]}>{translate(item.titleTranslationKey)}</Text_1.default>
                                    </react_native_1.View>
                                </react_native_1.View>
                            </react_native_1.View>);
        })}
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, styles.pb5]}>
                <react_native_1.View style={[styles.flexRow, styles.renderHTML, styles.pb5]}>
                    <RenderHTML_1.default html={processedHelperText}/>
                </react_native_1.View>
                <react_native_1.View style={styles.mb2}>
                    <Button_1.default large text={translate('common.skip')} onPress={() => completeOnboarding()}/>
                </react_native_1.View>
                <react_native_1.View>
                    <Button_1.default success large text={translate('onboarding.workspace.createWorkspace')} onPress={() => {
            (0, Welcome_1.setOnboardingErrorMessage)('');
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACE_CONFIRMATION.getRoute());
        }}/>
                </react_native_1.View>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkspaceOptional.displayName = 'BaseOnboardingWorkspaceOptional';
exports.default = BaseOnboardingWorkspaceOptional;
