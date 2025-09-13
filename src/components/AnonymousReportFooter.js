"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Session_1 = require("@userActions/Session");
var AvatarWithDisplayName_1 = require("./AvatarWithDisplayName");
var Button_1 = require("./Button");
var ExpensifyWordmark_1 = require("./ExpensifyWordmark");
var Text_1 = require("./Text");
function AnonymousReportFooter(_a) {
    var _b = _a.isSmallSizeLayout, isSmallSizeLayout = _b === void 0 ? false : _b, report = _a.report;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
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
                    <Button_1.default success text={translate('common.signIn')} onPress={function () {
            (0, Session_1.signOutAndRedirectToSignIn)();
        }}/>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
AnonymousReportFooter.displayName = 'AnonymousReportFooter';
exports.default = AnonymousReportFooter;
