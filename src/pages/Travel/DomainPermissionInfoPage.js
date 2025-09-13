"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
function DomainPermissionInfoPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<ScreenWrapper_1.default shouldEnableMaxHeight testID={DomainPermissionInfoPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('travel.domainPermissionInfo.title')}/>
            <react_native_1.View style={[styles.flex1]}>
                <react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.mt3, styles.mr5, styles.ml5]}>
                    <RenderHTML_1.default html={translate('travel.domainPermissionInfo.restriction', { domain: route.params.domain })}/>
                </react_native_1.View>
                <react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.mt3, styles.mr5, styles.ml5]}>
                    <RenderHTML_1.default html={translate('travel.domainPermissionInfo.accountantInvitation')}/>
                </react_native_1.View>
            </react_native_1.View>
            <FixedFooter_1.default>
                <Button_1.default success large style={[styles.w100]} onPress={() => Navigation_1.default.closeRHPFlow()} text={translate('common.buttonConfirm')}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
DomainPermissionInfoPage.displayName = 'DomainPermissionInfoPage';
exports.default = DomainPermissionInfoPage;
