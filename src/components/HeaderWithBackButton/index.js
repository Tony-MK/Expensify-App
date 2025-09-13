"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const AvatarWithDisplayName_1 = require("@components/AvatarWithDisplayName");
const Header_1 = require("@components/Header");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PinButton_1 = require("@components/PinButton");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const SearchButton_1 = require("@components/Search/SearchRouter/SearchButton");
const HelpButton_1 = require("@components/SidePanel/HelpComponents/HelpButton");
const ThreeDotsMenu_1 = require("@components/ThreeDotsMenu");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useThrottledButtonState_1 = require("@hooks/useThrottledButtonState");
const getButtonState_1 = require("@libs/getButtonState");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function HeaderWithBackButton({ icon, iconFill, iconWidth, iconHeight, iconStyles, onBackButtonPress = () => Navigation_1.default.goBack(), onCloseButtonPress = () => Navigation_1.default.dismissModal(), onDownloadButtonPress = () => { }, onThreeDotsButtonPress = () => { }, report, policyAvatar, shouldShowReportAvatarWithDisplay = false, shouldDisplayStatus, shouldShowBackButton = true, shouldShowBorderBottom = false, shouldShowCloseButton = false, shouldShowDownloadButton = false, isDownloading = false, shouldShowPinButton = false, shouldSetModalVisibility = true, shouldShowThreeDotsButton = false, shouldDisableThreeDotsButton = false, shouldUseHeadlineHeader = false, stepCounter, subtitle = '', title = '', titleColor, threeDotsAnchorAlignment = {
    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.RIGHT,
    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.TOP,
}, threeDotsMenuItems = [], threeDotsMenuIcon, threeDotsMenuIconFill, shouldEnableDetailPageNavigation = false, children = null, shouldOverlayDots = false, shouldOverlay = false, shouldNavigateToTopMostReport = false, shouldDisplayHelpButton = true, shouldDisplaySearchRouter = false, progressBarPercentage, style, subTitleLink = '', shouldMinimizeMenuButton = false, openParentReportInCurrentTab = false, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [isDownloadButtonActive, temporarilyDisableDownloadButton] = (0, useThrottledButtonState_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const middleContent = (0, react_1.useMemo)(() => {
        if (progressBarPercentage) {
            return (<>
                    {/* Reserves as much space for the middleContent as possible */}
                    <react_native_1.View style={styles.flexGrow1}/>
                    {/* Uses absolute positioning so that it's always centered instead of being affected by the
                presence or absence of back/close buttons to the left/right of it */}
                    <react_native_1.View style={styles.headerProgressBarContainer}>
                        <react_native_1.View style={styles.headerProgressBar}>
                            <react_native_1.View style={[{ width: `${progressBarPercentage}%` }, styles.headerProgressBarFill]}/>
                        </react_native_1.View>
                    </react_native_1.View>
                </>);
        }
        if (shouldShowReportAvatarWithDisplay) {
            return (<AvatarWithDisplayName_1.default report={report} shouldDisplayStatus={shouldDisplayStatus} shouldEnableDetailPageNavigation={shouldEnableDetailPageNavigation} openParentReportInCurrentTab={openParentReportInCurrentTab}/>);
        }
        return (<Header_1.default title={title} subtitle={stepCounter ? translate('stepCounter', stepCounter) : subtitle} textStyles={[titleColor ? StyleUtils.getTextColorStyle(titleColor) : {}, shouldUseHeadlineHeader && styles.textHeadlineH2]} subTitleLink={subTitleLink} numberOfTitleLines={1}/>);
    }, [
        StyleUtils,
        subTitleLink,
        shouldUseHeadlineHeader,
        progressBarPercentage,
        report,
        shouldEnableDetailPageNavigation,
        shouldShowReportAvatarWithDisplay,
        stepCounter,
        styles.flexGrow1,
        styles.headerProgressBar,
        styles.headerProgressBarContainer,
        styles.headerProgressBarFill,
        styles.textHeadlineH2,
        subtitle,
        title,
        titleColor,
        translate,
        openParentReportInCurrentTab,
        shouldDisplayStatus,
    ]);
    const ThreeDotMenuButton = (0, react_1.useMemo)(() => {
        if (shouldShowThreeDotsButton) {
            return threeDotsMenuItems.length === 1 && shouldMinimizeMenuButton ? (<Tooltip_1.default text={threeDotsMenuItems.at(0)?.text}>
                    <PressableWithoutFeedback_1.default onPress={threeDotsMenuItems.at(0)?.onSelected} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={threeDotsMenuItems.at(0)?.text ?? ''}>
                        <Icon_1.default src={threeDotsMenuItems.at(0)?.icon} fill={theme.icon}/>
                    </PressableWithoutFeedback_1.default>
                </Tooltip_1.default>) : (<ThreeDotsMenu_1.default shouldSelfPosition icon={threeDotsMenuIcon} iconFill={threeDotsMenuIconFill} disabled={shouldDisableThreeDotsButton} menuItems={threeDotsMenuItems} onIconPress={onThreeDotsButtonPress} shouldOverlay={shouldOverlayDots} anchorAlignment={threeDotsAnchorAlignment} shouldSetModalVisibility={shouldSetModalVisibility}/>);
        }
        return null;
    }, [
        shouldShowThreeDotsButton,
        threeDotsMenuItems,
        shouldMinimizeMenuButton,
        styles.touchableButtonImage,
        theme.icon,
        threeDotsMenuIcon,
        threeDotsMenuIconFill,
        shouldDisableThreeDotsButton,
        onThreeDotsButtonPress,
        shouldOverlayDots,
        threeDotsAnchorAlignment,
        shouldSetModalVisibility,
    ]);
    return (<react_native_1.View 
    // Hover on some part of close icons will not work on Electron if dragArea is true
    // https://github.com/Expensify/App/issues/29598
    dataSet={{ dragArea: false }} style={[
            styles.headerBar,
            shouldUseHeadlineHeader && styles.headerBarHeight,
            shouldShowBorderBottom && styles.borderBottom,
            // progressBarPercentage can be 0 which would
            // be falsy, hence using !== undefined explicitly
            progressBarPercentage !== undefined && styles.pl0,
            shouldShowBackButton && [styles.pl2],
            shouldOverlay && react_native_1.StyleSheet.absoluteFillObject,
            style,
        ]}>
            <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.flexGrow1, styles.justifyContentBetween, styles.overflowHidden, styles.mr3]}>
                {shouldShowBackButton && (<Tooltip_1.default text={translate('common.back')}>
                        <PressableWithoutFeedback_1.default onPress={() => {
                if (react_native_1.Keyboard.isVisible()) {
                    react_native_1.Keyboard.dismiss();
                }
                const topmostReportId = Navigation_1.default.getTopmostReportId();
                if (shouldNavigateToTopMostReport && topmostReportId) {
                    Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(topmostReportId));
                }
                else {
                    onBackButtonPress();
                }
            }} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.back')} id={CONST_1.default.BACK_BUTTON_NATIVE_ID}>
                            <Icon_1.default src={Expensicons.BackArrow} fill={iconFill ?? theme.icon}/>
                        </PressableWithoutFeedback_1.default>
                    </Tooltip_1.default>)}
                {!!icon && (<Icon_1.default src={icon} width={iconWidth ?? variables_1.default.iconHeader} height={iconHeight ?? variables_1.default.iconHeader} additionalStyles={[styles.mr2, iconStyles]} fill={iconFill}/>)}
                {!!policyAvatar && (<Avatar_1.default containerStyles={[StyleUtils.getWidthAndHeightStyle(StyleUtils.getAvatarSize(CONST_1.default.AVATAR_SIZE.DEFAULT)), styles.mr3]} source={policyAvatar?.source} name={policyAvatar?.name} avatarID={policyAvatar?.id} type={policyAvatar?.type}/>)}
                {middleContent}
                <react_native_1.View style={[styles.reportOptions, styles.flexRow, styles.alignItemsCenter]}>
                    <react_native_1.View style={[styles.pr2, styles.flexRow, styles.alignItemsCenter]}>
                        {children}
                        {shouldShowDownloadButton &&
            (!isDownloading ? (<Tooltip_1.default text={translate('common.download')}>
                                    <PressableWithoutFeedback_1.default onPress={(event) => {
                    // Blur the pressable in case this button triggers a Growl notification
                    // We do not want to overlap Growl with the Tooltip (#15271)
                    event?.currentTarget?.blur();
                    if (!isDownloadButtonActive) {
                        return;
                    }
                    onDownloadButtonPress();
                    temporarilyDisableDownloadButton();
                }} style={[styles.touchableButtonImage]} role="button" accessibilityLabel={translate('common.download')}>
                                        <Icon_1.default src={Expensicons.Download} fill={iconFill ?? StyleUtils.getIconFillColor((0, getButtonState_1.default)(false, false, !isDownloadButtonActive))}/>
                                    </PressableWithoutFeedback_1.default>
                                </Tooltip_1.default>) : (<react_native_1.ActivityIndicator style={[styles.touchableButtonImage]} size="small" color={theme.spinner}/>))}
                        {shouldShowPinButton && !!report && <PinButton_1.default report={report}/>}
                    </react_native_1.View>
                    {ThreeDotMenuButton}
                    {shouldShowCloseButton && (<Tooltip_1.default text={translate('common.close')}>
                            <PressableWithoutFeedback_1.default onPress={onCloseButtonPress} style={[styles.touchableButtonImage]} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                                <Icon_1.default src={Expensicons.Close} fill={iconFill ?? theme.icon}/>
                            </PressableWithoutFeedback_1.default>
                        </Tooltip_1.default>)}
                </react_native_1.View>
                {shouldDisplayHelpButton && <HelpButton_1.default />}
                {shouldDisplaySearchRouter && <SearchButton_1.default />}
            </react_native_1.View>
        </react_native_1.View>);
}
HeaderWithBackButton.displayName = 'HeaderWithBackButton';
exports.default = HeaderWithBackButton;
