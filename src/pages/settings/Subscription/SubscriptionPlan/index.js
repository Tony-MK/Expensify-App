"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const ComparePlansModal_1 = require("./ComparePlansModal");
const SaveWithExpensifyButton_1 = require("./SaveWithExpensifyButton");
const SubscriptionPlanCard_1 = require("./SubscriptionPlanCard");
function SubscriptionPlan() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const [isModalVisible, setIsModalVisible] = (0, react_1.useState)(false);
    const renderTitle = () => {
        return (<react_native_1.View style={[styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                <Text_1.default style={[styles.textHeadline, styles.cardSectionTitle, styles.textStrong]}>{translate('subscription.yourPlan.title')}</Text_1.default>
                <Button_1.default small text={translate('subscription.yourPlan.exploreAllPlans')} onPress={() => setIsModalVisible(true)}/>
            </react_native_1.View>);
    };
    return (<Section_1.default renderTitle={renderTitle} isCentralPane>
            <SubscriptionPlanCard_1.default subscriptionPlan={subscriptionPlan}/>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt6]}>
                <Icon_1.default src={Illustrations.HandCard} width={variables_1.default.iconHeader} height={variables_1.default.iconHeader} additionalStyles={styles.mr2}/>
                <react_native_1.View style={[styles.flexColumn, styles.justifyContentCenter, styles.flex1, styles.mr2]}>
                    <Text_1.default style={[styles.headerText, styles.mt2]}>{translate('subscription.yourPlan.saveWithExpensifyTitle')}</Text_1.default>
                    <Text_1.default style={[styles.textLabelSupporting, styles.mb2]}>{translate('subscription.yourPlan.saveWithExpensifyDescription')}</Text_1.default>
                </react_native_1.View>
                <SaveWithExpensifyButton_1.default />
            </react_native_1.View>
            <ComparePlansModal_1.default isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
        </Section_1.default>);
}
SubscriptionPlan.displayName = 'SubscriptionPlan';
exports.default = SubscriptionPlan;
