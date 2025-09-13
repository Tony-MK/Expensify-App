"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDismissedReferralBanners_1 = require("@hooks/useDismissedReferralBanners");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const Navigation_1 = require("@src/libs/Navigation/Navigation");
const ROUTES_1 = require("@src/ROUTES");
const utils_1 = require("./Button/utils");
const Icon_1 = require("./Icon");
const Expensicons_1 = require("./Icon/Expensicons");
const Pressable_1 = require("./Pressable");
const RenderHTML_1 = require("./RenderHTML");
const Tooltip_1 = require("./Tooltip");
function ReferralProgramCTA({ referralContentType, style, onDismiss }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isDismissed, setAsDismissed } = (0, useDismissedReferralBanners_1.default)({ referralContentType });
    const handleDismissCallToAction = () => {
        setAsDismissed();
        onDismiss?.();
    };
    const shouldShowBanner = referralContentType && !isDismissed;
    (0, react_1.useEffect)(() => {
        if (shouldShowBanner) {
            return;
        }
        onDismiss?.();
    }, [onDismiss, shouldShowBanner]);
    if (!shouldShowBanner) {
        return null;
    }
    return (<Pressable_1.PressableWithoutFeedback onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.REFERRAL_DETAILS_MODAL.getRoute(referralContentType, Navigation_1.default.getActiveRouteWithoutParams()));
        }} style={[styles.br2, styles.highlightBG, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter, { gap: 10, padding: 10 }, styles.pl5, style]} isNested accessibilityLabel="referral" role={(0, utils_1.getButtonRole)(true)}>
            <RenderHTML_1.default html={translate(`referralProgram.${referralContentType}.buttonText`)}/>
            <Tooltip_1.default text={translate('common.close')}>
                <Pressable_1.PressableWithoutFeedback onPress={handleDismissCallToAction} onMouseDown={(e) => {
            e.preventDefault();
        }} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                    <Icon_1.default src={Expensicons_1.Close} height={20} width={20} fill={theme.icon}/>
                </Pressable_1.PressableWithoutFeedback>
            </Tooltip_1.default>
        </Pressable_1.PressableWithoutFeedback>);
}
exports.default = ReferralProgramCTA;
