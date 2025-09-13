"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BookTravelButton_1 = require("@components/BookTravelButton");
const Button_1 = require("@components/Button");
const FeatureList_1 = require("@components/FeatureList");
const Illustrations = require("@components/Icon/Illustrations");
const LottieAnimations_1 = require("@components/LottieAnimations");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const CONST_1 = require("@src/CONST");
const tripsFeatures = [
    {
        icon: Illustrations.PiggyBank,
        translationKey: 'travel.features.saveMoney',
    },
    {
        icon: Illustrations.Alert,
        translationKey: 'travel.features.alerts',
    },
];
function ManageTrips() {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [shouldScrollToBottom, setShouldScrollToBottom] = (0, react_1.useState)(false);
    const navigateToBookTravelDemo = () => {
        react_native_1.Linking.openURL(CONST_1.default.BOOK_TRAVEL_DEMO_URL);
    };
    const scrollViewRef = (0, react_1.useRef)(null);
    const scrollToBottom = () => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });
    };
    (0, react_1.useEffect)(() => {
        if (!shouldScrollToBottom) {
            return;
        }
        scrollToBottom();
        setShouldScrollToBottom(false);
    }, [shouldScrollToBottom]);
    return (<ScrollView_1.default contentContainerStyle={styles.pt3} ref={scrollViewRef}>
            <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                <FeatureList_1.default menuItems={tripsFeatures} title={translate('travel.title')} subtitle={translate('travel.subtitle')} illustration={LottieAnimations_1.default.TripsEmptyState} illustrationStyle={[styles.mv4]} illustrationBackgroundColor={colors_1.default.blue600} titleStyles={styles.textHeadlineH1} contentPaddingOnLargeScreens={styles.p5} footer={<>
                            <Button_1.default text={translate('travel.bookDemo')} onPress={navigateToBookTravelDemo} accessibilityLabel={translate('travel.bookDemo')} style={[styles.w100, styles.mb3]} large/>
                            <BookTravelButton_1.default text={translate('travel.bookTravel')} shouldRenderErrorMessageBelowButton setShouldScrollToBottom={setShouldScrollToBottom}/>
                        </>}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
ManageTrips.displayName = 'ManageTrips';
exports.default = ManageTrips;
