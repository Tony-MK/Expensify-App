"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const expensify_wordmark_svg_1 = require("@assets/images/expensify-wordmark.svg");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useLocalize_1 = require("@hooks/useLocalize");
const usePageRefresh_1 = require("@hooks/usePageRefresh");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ErrorBodyText_1 = require("./ErrorBodyText");
function GenericErrorPage({ error }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isChunkLoadError = error?.name === CONST_1.default.CHUNK_LOAD_ERROR || /Loading chunk [\d]+ failed/.test(error?.message ?? '');
    const refreshPage = (0, usePageRefresh_1.default)();
    return (<SafeAreaConsumer_1.default>
            {({ paddingBottom }) => (<react_native_1.View style={[styles.flex1, styles.pt10, styles.ph5, StyleUtils.getErrorPageContainerStyle(Number(paddingBottom))]}>
                    <react_native_1.View style={[styles.flex1, styles.alignItemsCenter, styles.justifyContentCenter]}>
                        <react_native_1.View>
                            <react_native_1.View style={styles.mb5}>
                                <Icon_1.default src={Expensicons.Bug} height={variables_1.default.componentSizeNormal} width={variables_1.default.componentSizeNormal} fill={theme.iconSuccessFill}/>
                            </react_native_1.View>
                            <react_native_1.View style={styles.mb5}>
                                <Text_1.default style={[styles.textHeadline]}>{translate('genericErrorPage.title')}</Text_1.default>
                            </react_native_1.View>
                            <react_native_1.View style={styles.mb5}>
                                <ErrorBodyText_1.default />
                                <Text_1.default>
                                    {`${translate('genericErrorPage.body.helpTextConcierge')} `}
                                    <TextLink_1.default href={`mailto:${CONST_1.default.EMAIL.CONCIERGE}`} style={[styles.link]}>
                                        {CONST_1.default.EMAIL.CONCIERGE}
                                    </TextLink_1.default>
                                </Text_1.default>
                            </react_native_1.View>
                            <react_native_1.View style={[styles.flexRow]}>
                                <react_native_1.View style={[styles.flex1, styles.flexRow]}>
                                    <Button_1.default success text={translate('genericErrorPage.refresh')} style={styles.mr3} onPress={() => refreshPage(isChunkLoadError)}/>
                                    {isAuthenticated && (<Button_1.default text={translate('initialSettingsPage.signOut')} onPress={() => {
                    (0, Session_1.signOutAndRedirectToSignIn)();
                    refreshPage();
                }}/>)}
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.View>
                        <react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentCenter]}>
                            <ImageSVG_1.default contentFit="contain" src={expensify_wordmark_svg_1.default} height={30} width={80} fill={theme.text}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </react_native_1.View>)}
        </SafeAreaConsumer_1.default>);
}
GenericErrorPage.displayName = 'ErrorPage';
exports.default = GenericErrorPage;
