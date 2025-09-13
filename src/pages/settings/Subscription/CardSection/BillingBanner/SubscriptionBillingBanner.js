"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Illustrations = require("@components/Icon/Illustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const BillingBanner_1 = require("./BillingBanner");
function SubscriptionBillingBanner({ title, subtitle, rightIcon, icon, isError = false, onRightIconPress, rightIconAccessibilityLabel }) {
    const styles = (0, useThemeStyles_1.default)();
    const iconAsset = (icon ?? isError) ? Illustrations.CreditCardEyes : Illustrations.CheckmarkCircle;
    return (<BillingBanner_1.default title={title} subtitle={subtitle} icon={iconAsset} brickRoadIndicator={isError ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO} subtitleStyle={styles.textSupporting} style={styles.hoveredComponentBG} rightIcon={rightIcon} onRightIconPress={onRightIconPress} rightIconAccessibilityLabel={rightIconAccessibilityLabel}/>);
}
SubscriptionBillingBanner.displayName = 'SubscriptionBillingBanner';
exports.default = SubscriptionBillingBanner;
