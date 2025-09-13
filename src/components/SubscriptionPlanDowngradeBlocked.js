"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Button_1 = require("./Button");
const FixedFooter_1 = require("./FixedFooter");
const Text_1 = require("./Text");
function SubscriptionPlanDowngradeBlocked({ privateSubscription, formattedSubscriptionEndDate, onClosePress }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={[styles.flexGrow1]}>
            <Text_1.default style={[styles.ph5, styles.pb5, styles.textNormalThemeText]}>{translate('subscription.subscriptionSize.youCantDowngrade')}</Text_1.default>
            <Text_1.default style={[styles.ph5, styles.textNormalThemeText]}>
                {translate('subscription.subscriptionSize.youAlreadyCommitted', {
            size: privateSubscription?.userCount ?? 0,
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
