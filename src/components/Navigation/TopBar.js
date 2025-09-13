"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const LoadingBar_1 = require("@components/LoadingBar");
const Pressable_1 = require("@components/Pressable");
const SearchButton_1 = require("@components/Search/SearchRouter/SearchButton");
const HelpButton_1 = require("@components/SidePanel/HelpComponents/HelpButton");
const Text_1 = require("@components/Text");
const useLoadingBarVisibility_1 = require("@hooks/useLoadingBarVisibility");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SignInButton_1 = require("@pages/home/sidebar/SignInButton");
const Session_1 = require("@userActions/Session");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TopBar({ breadcrumbLabel, shouldDisplaySearch = true, shouldDisplayHelpButton = true, cancelSearch, shouldShowLoadingBar = false, children }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (sessionValue) => sessionValue && { authTokenType: sessionValue.authTokenType }, canBeMissing: true });
    const shouldShowLoadingBarForReports = (0, useLoadingBarVisibility_1.default)();
    const isAnonymousUser = (0, Session_1.isAnonymousUser)(session);
    const displaySignIn = isAnonymousUser;
    const displaySearch = !isAnonymousUser && shouldDisplaySearch;
    return (<react_native_1.View style={[styles.w100, styles.zIndex10]}>
            <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentBetween, styles.ml5, styles.mr3, styles.headerBarHeight]} dataSet={{ dragArea: true }}>
                <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.pr2]}>
                    <react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter]}>
                        <Text_1.default numberOfLines={1} style={[styles.flexShrink1, styles.topBarLabel]}>
                            {breadcrumbLabel}
                        </Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
                {children}
                {displaySignIn && <SignInButton_1.default />}
                {!!cancelSearch && (<Pressable_1.PressableWithoutFeedback accessibilityLabel={translate('common.cancel')} style={styles.textBlue} onPress={() => {
                cancelSearch();
            }}>
                        <Text_1.default style={[styles.textBlue]}>{translate('common.cancel')}</Text_1.default>
                    </Pressable_1.PressableWithoutFeedback>)}
                {shouldDisplayHelpButton && <HelpButton_1.default />}
                {displaySearch && <SearchButton_1.default />}
            </react_native_1.View>
            <LoadingBar_1.default shouldShow={shouldShowLoadingBarForReports || shouldShowLoadingBar}/>
        </react_native_1.View>);
}
TopBar.displayName = 'TopBar';
exports.default = TopBar;
