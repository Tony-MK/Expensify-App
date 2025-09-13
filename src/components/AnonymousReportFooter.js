"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@userActions/Session");
const AvatarWithDisplayName_1 = require("./AvatarWithDisplayName");
const Button_1 = require("./Button");
const ExpensifyWordmark_1 = require("./ExpensifyWordmark");
const Text_1 = require("./Text");
function AnonymousReportFooter({ isSmallSizeLayout = false, report }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.anonymousRoomFooter(isSmallSizeLayout)}>
            <react_native_1.View style={[styles.flexRow, styles.flexShrink1]}>
                <AvatarWithDisplayName_1.default report={report} isAnonymous shouldEnableDetailPageNavigation/>
            </react_native_1.View>
            <react_native_1.View style={styles.anonymousRoomFooterWordmarkAndLogoContainer(isSmallSizeLayout)}>
                <react_native_1.View style={[isSmallSizeLayout ? styles.mr1 : styles.mr4, styles.flexShrink1]}>
                    <react_native_1.View style={[isSmallSizeLayout ? styles.alignItemsStart : styles.alignItemsEnd]}>
                        <ExpensifyWordmark_1.default style={styles.anonymousRoomFooterLogo}/>
                    </react_native_1.View>
                    <Text_1.default style={styles.anonymousRoomFooterLogoTaglineText}>{translate('anonymousReportFooter.logoTagline')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.anonymousRoomFooterSignInButton]}>
                    <Button_1.default success text={translate('common.signIn')} onPress={() => {
            (0, Session_1.signOutAndRedirectToSignIn)();
        }}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
AnonymousReportFooter.displayName = 'AnonymousReportFooter';
exports.default = AnonymousReportFooter;
