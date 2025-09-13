"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
function PublicDomainErrorPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={PublicDomainErrorPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('travel.header')} onBackButtonPress={() => Navigation_1.default.goBack(route.params.backTo)}/>
            <react_native_1.View style={[styles.flex1]}>
                <react_native_1.View style={[styles.mt3, styles.mr5, styles.ml5]}>
                    <Text_1.default style={styles.headerAnonymousFooter}>{`${translate('travel.publicDomainError.title')}`}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.mt3, styles.mr5, styles.mb5, styles.ml5]}>
                    <Text_1.default>{translate('travel.publicDomainError.message')}</Text_1.default>
                </react_native_1.View>
            </react_native_1.View>
            <FixedFooter_1.default>
                <Button_1.default success large style={[styles.w100]} onPress={() => Navigation_1.default.closeRHPFlow()} text={translate('common.buttonConfirm')}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
PublicDomainErrorPage.displayName = 'PublicDomainErrorPage';
exports.default = PublicDomainErrorPage;
