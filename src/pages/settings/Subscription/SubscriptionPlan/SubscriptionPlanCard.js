"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const SelectCircle_1 = require("@components/SelectCircle");
const Text_1 = require("@components/Text");
const usePreferredCurrency_1 = require("@hooks/usePreferredCurrency");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const variables_1 = require("@styles/variables");
const SubscriptionPlanCardActionButton_1 = require("./SubscriptionPlanCardActionButton");
function SubscriptionPlanCard({ subscriptionPlan, isFromComparisonModal = false, closeComparisonModal }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const currentSubscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const { title, src, description, benefits, note, subtitle } = (0, SubscriptionUtils_1.getSubscriptionPlanInfo)(subscriptionPlan, privateSubscription?.type, preferredCurrency, isFromComparisonModal);
    const isSelected = isFromComparisonModal && subscriptionPlan === currentSubscriptionPlan;
    const benefitsColumns = shouldUseNarrowLayout || isFromComparisonModal ? 1 : 2;
    const renderBenefits = () => {
        const amountOfRows = Math.ceil(benefits.length / benefitsColumns);
        return Array.from({ length: amountOfRows }).map((_, rowIndex) => (<react_native_1.View 
        // eslint-disable-next-line react/no-array-index-key
        key={`row-${rowIndex}`} style={styles.flexRow}>
                {benefits.slice(rowIndex * benefitsColumns, (rowIndex + 1) * benefitsColumns).map((item) => (<react_native_1.View key={item} style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, shouldUseNarrowLayout ? styles.mt3 : styles.mt4]}>
                        <Icon_1.default src={Expensicons.Checkmark} fill={theme.iconSuccessFill} width={variables_1.default.iconSizeSmall} height={variables_1.default.iconSizeSmall}/>
                        <Text_1.default style={[styles.textLabelSupporting, styles.ml2]}>{item}</Text_1.default>
                    </react_native_1.View>))}
            </react_native_1.View>));
    };
    return (<react_native_1.View style={[styles.borderedContentCard, styles.borderRadiusComponentLarge, styles.mt5, styles.flex1, isSelected && styles.borderColorFocus, styles.justifyContentBetween]}>
            <react_native_1.View style={shouldUseNarrowLayout ? styles.p5 : [styles.p8, styles.pb6]}>
                <react_native_1.View style={[styles.flexRow, styles.justifyContentBetween]}>
                    <Icon_1.default src={src} width={variables_1.default.iconHeader} height={variables_1.default.iconHeader}/>
                    <react_native_1.View>
                        <SelectCircle_1.default isChecked={isSelected} selectCircleStyles={[styles.bgTransparent, styles.borderNone]}/>
                    </react_native_1.View>
                </react_native_1.View>
                <Text_1.default style={[styles.headerText, styles.mv2, styles.textHeadlineH2]}>{title}</Text_1.default>
                <Text_1.default style={styles.labelStrong}>{subtitle}</Text_1.default>
                <Text_1.default style={[styles.textLabelSupporting, styles.textSmall]}>{note}</Text_1.default>
                <Text_1.default style={[styles.textLabelSupporting, styles.textNormal, styles.mt3, styles.mb1]}>{description}</Text_1.default>
                {renderBenefits()}
            </react_native_1.View>
            <react_native_1.View style={shouldUseNarrowLayout ? styles.pb5 : styles.pb8}>
                <SubscriptionPlanCardActionButton_1.default subscriptionPlan={subscriptionPlan} isFromComparisonModal={isFromComparisonModal} isSelected={isSelected} style={shouldUseNarrowLayout ? styles.ph5 : styles.ph8} closeComparisonModal={closeComparisonModal}/>
            </react_native_1.View>
        </react_native_1.View>);
}
SubscriptionPlanCard.displayName = 'SubscriptionPlanCard';
exports.default = SubscriptionPlanCard;
