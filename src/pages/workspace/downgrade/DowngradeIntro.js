"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@libs/actions/Link");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function DowngradeIntro({ onDowngrade, buttonDisabled, loading, policyID, backTo }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const { isExtraSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const benefits = [
        translate('workspace.downgrade.commonFeatures.benefits.benefit1'),
        translate('workspace.downgrade.commonFeatures.benefits.benefit2'),
        translate('workspace.downgrade.commonFeatures.benefits.benefit3'),
        translate('workspace.downgrade.commonFeatures.benefits.benefit4'),
    ];
    return (<react_native_1.View style={[styles.m5, styles.workspaceUpgradeIntroBox({ isExtraSmallScreenWidth })]}>
            <react_native_1.View style={[styles.mb3]}>
                <Icon_1.default src={Illustrations.Mailbox} width={48} height={48}/>
            </react_native_1.View>
            <react_native_1.View style={styles.mb5}>
                <Text_1.default style={[styles.textHeadlineH1, styles.mb4]}>{translate('workspace.downgrade.commonFeatures.title')}</Text_1.default>
                <Text_1.default style={[styles.textNormal, styles.textSupporting, styles.mb4]}>{translate('workspace.downgrade.commonFeatures.note')}</Text_1.default>
                {benefits.map((benefit) => (<react_native_1.View key={benefit} style={[styles.pl2, styles.flexRow]}>
                        <Text_1.default style={[styles.textNormal, styles.textSupporting, styles.mr1]}>•</Text_1.default>
                        <Text_1.default style={[styles.textNormal, styles.textSupporting]}>{benefit}</Text_1.default>
                    </react_native_1.View>))}
                <Text_1.default style={[styles.textNormal, styles.textSupporting, styles.mt4]}>
                    {translate('workspace.downgrade.commonFeatures.benefits.note')}{' '}
                    <TextLink_1.default style={[styles.link]} onPress={() => (0, Link_1.openLink)(CONST_1.default.PLAN_TYPES_AND_PRICING_HELP_URL, environmentURL)}>
                        {translate('workspace.downgrade.commonFeatures.benefits.pricingPage')}
                    </TextLink_1.default>
                    .
                </Text_1.default>
                {policyID ? (<Text_1.default style={[styles.mv4]}>
                        <Text_1.default style={[styles.textNormal, styles.textSupporting]}>{translate('workspace.downgrade.commonFeatures.benefits.confirm')}</Text_1.default>{' '}
                        <Text_1.default style={[styles.textBold, styles.textSupporting]}>{translate('workspace.downgrade.commonFeatures.benefits.warning')}</Text_1.default>
                    </Text_1.default>) : (<Text_1.default style={[styles.mv4]}>
                        <Text_1.default style={[styles.textBold, styles.textSupporting]}>{translate('workspace.downgrade.commonFeatures.benefits.headsUp')}</Text_1.default>{' '}
                        <Text_1.default style={[styles.textNormal, styles.textSupporting]}>{translate('workspace.downgrade.commonFeatures.benefits.multiWorkspaceNote')}</Text_1.default>{' '}
                        <Text_1.default style={[styles.textBold, styles.textSupporting]}>{translate('workspace.common.goToWorkspaces')}</Text_1.default>{' '}
                        <Text_1.default style={[styles.textNormal, styles.textSupporting]}>{translate('workspace.downgrade.commonFeatures.benefits.selectStep')}</Text_1.default>{' '}
                        <Text_1.default style={[styles.textBold, styles.textSupporting]}>{translate('workspace.type.collect')}</Text_1.default>.
                    </Text_1.default>)}
            </react_native_1.View>
            {policyID ? (<Button_1.default isLoading={loading} text={translate('common.downgradeWorkspace')} success onPress={onDowngrade} isDisabled={buttonDisabled} large/>) : (<Button_1.default text={translate('workspace.common.goToWorkspaces')} success onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.getRoute(backTo ?? Navigation_1.default.getActiveRoute()), { forceReplace: true })} large/>)}
        </react_native_1.View>);
}
exports.default = DowngradeIntro;
