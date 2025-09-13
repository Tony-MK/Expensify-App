"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Button_1 = require("./Button");
var FixedFooter_1 = require("./FixedFooter");
var Text_1 = require("./Text");
function SubscriptionPlanDowngradeBlocked(_a) {
    var _b;
    var privateSubscription = _a.privateSubscription, formattedSubscriptionEndDate = _a.formattedSubscriptionEndDate, onClosePress = _a.onClosePress;
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexGrow1]}>
            <Text_1.default style={[styles.ph5, styles.pb5, styles.textNormalThemeText]}>{translate('subscription.subscriptionSize.youCantDowngrade')}</Text_1.default>
            <Text_1.default style={[styles.ph5, styles.textNormalThemeText]}>
                {translate('subscription.subscriptionSize.youAlreadyCommitted', {
            size: (_b = privateSubscription === null || privateSubscription === void 0 ? void 0 : privateSubscription.userCount) !== null && _b !== void 0 ? _b : 0,
            date: formattedSubscriptionEndDate,
        })}
            </Text_1.default>
            <FixedFooter_1.default style={[styles.mtAuto]}>
                <Button_1.default success large onPress={onClosePress} text={translate('common.close')}/>
            </FixedFooter_1.default>
        </react_native_1.View>);
}
SubscriptionPlanDowngradeBlocked.displayName = 'SubscriptionPlanDowngradeBlocked';
exports.default = SubscriptionPlanDowngradeBlocked;
