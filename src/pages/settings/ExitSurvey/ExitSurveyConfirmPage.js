"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components//Icon");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations_1 = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const ExitSurvey_1 = require("@userActions/ExitSurvey");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const ExitSurveyReasonForm_1 = require("@src/types/form/ExitSurveyReasonForm");
const ExitSurveyResponseForm_1 = require("@src/types/form/ExitSurveyResponseForm");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const ExitSurveyOffline_1 = require("./ExitSurveyOffline");
function ExitSurveyConfirmPage({ route, navigation }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [tryNewDot] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_TRY_NEW_DOT, { canBeMissing: true });
    const [exitReason] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_REASON_FORM, {
        selector: (value) => value?.[ExitSurveyReasonForm_1.default.REASON] ?? null,
        canBeMissing: true,
    });
    const [exitSurveyResponse] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.EXIT_SURVEY_RESPONSE_FORM, {
        selector: (value) => value?.[ExitSurveyResponseForm_1.default.RESPONSE],
        canBeMissing: true,
    });
    const shouldShowQuickTips = (0, EmptyObject_1.isEmptyObject)(tryNewDot) || tryNewDot?.classicRedirect?.dismissed === true || (!(0, EmptyObject_1.isEmptyObject)(tryNewDot) && tryNewDot?.classicRedirect?.dismissed === undefined);
    const getBackToParam = (0, react_1.useCallback)(() => {
        if (isOffline) {
            return ROUTES_1.default.SETTINGS;
        }
        if (exitReason) {
            return ROUTES_1.default.SETTINGS_EXIT_SURVEY_RESPONSE.getRoute(exitReason, ROUTES_1.default.SETTINGS_EXIT_SURVEY_REASON.route);
        }
        return ROUTES_1.default.SETTINGS;
    }, [exitReason, isOffline]);
    const { backTo } = route.params || {};
    (0, react_1.useEffect)(() => {
        const newBackTo = getBackToParam();
        if (backTo === newBackTo) {
            return;
        }
        navigation.setParams({
            backTo: newBackTo,
        });
    }, [backTo, getBackToParam, navigation]);
    return (<ScreenWrapper_1.default testID={ExitSurveyConfirmPage.displayName}>
            <HeaderWithBackButton_1.default title={translate(shouldShowQuickTips ? 'exitSurvey.goToExpensifyClassic' : 'exitSurvey.header')} onBackButtonPress={() => Navigation_1.default.goBack(backTo)}/>
            <react_native_1.View style={[styles.flex1, styles.justifyContentCenter, styles.alignItemsCenter, styles.mh5]}>
                {isOffline && <ExitSurveyOffline_1.default />}
                {!isOffline && (<>
                        <Icon_1.default src={Illustrations_1.MushroomTopHat} width={variables_1.default.mushroomTopHatWidth} height={variables_1.default.mushroomTopHatHeight}/>
                        <Text_1.default style={[styles.headerAnonymousFooter, styles.mt5, styles.textAlignCenter]}>
                            {translate(shouldShowQuickTips ? 'exitSurvey.quickTip' : 'exitSurvey.thankYou')}
                        </Text_1.default>
                        <Text_1.default style={[styles.mt2, styles.textAlignCenter]}>{translate(shouldShowQuickTips ? 'exitSurvey.quickTipSubTitle' : 'exitSurvey.thankYouSubtitle')}</Text_1.default>
                    </>)}
            </react_native_1.View>
            <FixedFooter_1.default>
                <Button_1.default success large text={translate(shouldShowQuickTips ? 'exitSurvey.takeMeToExpensifyClassic' : 'exitSurvey.goToExpensifyClassic')} pressOnEnter onPress={() => {
            (0, ExitSurvey_1.switchToOldDot)(exitReason, exitSurveyResponse);
            Navigation_1.default.dismissModal();
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
        }} isDisabled={isOffline}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
ExitSurveyConfirmPage.displayName = 'ExitSurveyConfirmPage';
exports.default = ExitSurveyConfirmPage;
