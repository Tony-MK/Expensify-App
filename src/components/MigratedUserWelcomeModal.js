"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchTypeMenuSections_1 = require("@hooks/useSearchTypeMenuSections");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Welcome_1 = require("@libs/actions/Welcome");
const convertToLTR_1 = require("@libs/convertToLTR");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const FeatureTrainingModal_1 = require("./FeatureTrainingModal");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const LottieAnimations_1 = require("./LottieAnimations");
const RenderHTML_1 = require("./RenderHTML");
const ExpensifyFeatures = [
    {
        icon: Illustrations.ChatBubbles,
        translationKey: 'migratedUserWelcomeModal.features.chat',
    },
    {
        icon: Illustrations.Flash,
        translationKey: 'migratedUserWelcomeModal.features.scanReceipt',
    },
    {
        icon: Illustrations.ExpensifyMobileApp,
        translationKey: 'migratedUserWelcomeModal.features.crossPlatform',
    },
];
function MigratedUserWelcomeModal() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    const [isModalDisabled, setIsModalDisabled] = (0, react_1.useState)(true);
    const route = (0, native_1.useRoute)();
    const shouldOpenSearch = route?.params?.shouldOpenSearch === 'true';
    const [tryNewDot, tryNewDotMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, {
        selector: onboardingSelectors_1.tryNewDotOnyxSelector,
        canBeMissing: true,
    });
    const [dismissedProductTraining, dismissedProductTrainingMetadata] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_DISMISSED_PRODUCT_TRAINING, { canBeMissing: true });
    (0, react_1.useEffect)(() => {
        if ((0, isLoadingOnyxValue_1.default)(tryNewDotMetadata, dismissedProductTrainingMetadata)) {
            return;
        }
        const { hasBeenAddedToNudgeMigration } = tryNewDot ?? {};
        Log_1.default.hmmm(`[MigratedUserWelcomeModal] useEffect triggered - hasBeenAddedToNudgeMigration: ${hasBeenAddedToNudgeMigration}, hasDismissedTraining: ${!!dismissedProductTraining?.migratedUserWelcomeModal}, shouldOpenSearch: ${shouldOpenSearch}`);
        if (!!(hasBeenAddedToNudgeMigration && !dismissedProductTraining?.migratedUserWelcomeModal) || !shouldOpenSearch) {
            Log_1.default.hmmm('[MigratedUserWelcomeModal] Conditions not met, keeping modal disabled');
            return;
        }
        Log_1.default.hmmm('[MigratedUserWelcomeModal] Enabling modal and navigating to search');
        setIsModalDisabled(false);
        const nonExploreTypeQuery = typeMenuSections.at(0)?.menuItems.at(0)?.searchQuery;
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: nonExploreTypeQuery ?? (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
    }, [dismissedProductTraining?.migratedUserWelcomeModal, setIsModalDisabled, tryNewDotMetadata, dismissedProductTrainingMetadata, tryNewDot, shouldOpenSearch, typeMenuSections]);
    return (<FeatureTrainingModal_1.default 
    // We would like to show the Lottie animation instead of a video
    videoURL="" title={translate('migratedUserWelcomeModal.title')} description={translate('migratedUserWelcomeModal.subtitle')} confirmText={translate('migratedUserWelcomeModal.confirmText')} animation={LottieAnimations_1.default.WorkspacePlanet} onClose={() => {
            Log_1.default.hmmm('[MigratedUserWelcomeModal] onClose called, dismissing product training');
            (0, Welcome_1.dismissProductTraining)(CONST_1.default.MIGRATED_USER_WELCOME_MODAL);
        }} animationStyle={[styles.emptyWorkspaceIllustrationStyle]} illustrationInnerContainerStyle={[StyleUtils.getBackgroundColorStyle(LottieAnimations_1.default.WorkspacePlanet.backgroundColor), styles.cardSectionIllustration]} illustrationOuterContainerStyle={styles.p0} contentInnerContainerStyles={[styles.mb5, styles.gap2]} contentOuterContainerStyles={!shouldUseNarrowLayout && [styles.mt8, styles.mh8]} modalInnerContainerStyle={{ ...styles.pt0, ...(shouldUseNarrowLayout ? {} : styles.pb8) }} isModalDisabled={isModalDisabled}>
            <react_native_1.View style={[styles.gap3, styles.pt1, styles.pl1]} fsClass={CONST_1.default.FULLSTORY.CLASS.UNMASK}>
                {ExpensifyFeatures.map(({ translationKey, icon }) => (<react_native_1.View key={translationKey} style={[styles.flexRow, styles.alignItemsCenter, styles.wAuto]}>
                        <Icon_1.default src={icon} height={variables_1.default.menuIconSize} width={variables_1.default.menuIconSize}/>
                        <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.wAuto, styles.flex1, styles.ml6]}>
                            <RenderHTML_1.default html={`<comment>${(0, convertToLTR_1.default)(translate(translationKey))}</comment>`}/>
                        </react_native_1.View>
                    </react_native_1.View>))}
            </react_native_1.View>
        </FeatureTrainingModal_1.default>);
}
MigratedUserWelcomeModal.displayName = 'MigratedUserWelcomeModal';
exports.default = MigratedUserWelcomeModal;
