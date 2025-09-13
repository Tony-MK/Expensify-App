"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Button_1 = require("./Button");
const Header_1 = require("./Header");
const Icon_1 = require("./Icon");
const Expensicons_1 = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const Pressable_1 = require("./Pressable");
const Text_1 = require("./Text");
const Tooltip_1 = require("./Tooltip");
function ConfirmContent({ title, onConfirm, onCancel = () => { }, confirmText = '', cancelText = '', prompt = '', success = true, danger = false, shouldDisableConfirmButtonWhenOffline = false, shouldShowCancelButton = false, iconSource, iconFill, shouldCenterContent = false, shouldStackButtons = true, titleStyles, promptStyles, contentStyles, iconAdditionalStyles, iconWidth = variables_1.default.appModalAppIconSize, iconHeight = variables_1.default.appModalAppIconSize, shouldCenterIcon = false, shouldShowDismissIcon = false, image, imageStyles, titleContainerStyles, shouldReverseStackedButtons = false, isVisible, isConfirmLoading, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const isCentered = shouldCenterContent;
    return (<>
            {!!image && (<react_native_1.View style={imageStyles}>
                    <ImageSVG_1.default contentFit="contain" src={image} height={CONST_1.default.CONFIRM_CONTENT_SVG_SIZE.HEIGHT} width={CONST_1.default.CONFIRM_CONTENT_SVG_SIZE.WIDTH} style={styles.alignSelfCenter}/>
                </react_native_1.View>)}

            <react_native_1.View style={[styles.m5, contentStyles]}>
                {shouldShowDismissIcon && (<react_native_1.View style={styles.alignItemsEnd}>
                        <Tooltip_1.default text={translate('common.close')}>
                            <Pressable_1.PressableWithoutFeedback onPress={onCancel} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                                <Icon_1.default fill={theme.icon} src={Expensicons_1.Close}/>
                            </Pressable_1.PressableWithoutFeedback>
                        </Tooltip_1.default>
                    </react_native_1.View>)}
                <react_native_1.View style={isCentered ? [styles.alignItemsCenter, styles.mb6] : []}>
                    {!!iconSource && (<react_native_1.View style={[shouldCenterIcon ? styles.justifyContentCenter : null, styles.flexRow, styles.mb3]}>
                            <Icon_1.default src={iconSource} fill={iconFill === false ? undefined : (iconFill ?? theme.icon)} width={iconWidth} height={iconHeight} additionalStyles={iconAdditionalStyles}/>
                        </react_native_1.View>)}
                    <react_native_1.View style={[styles.flexRow, isCentered ? {} : styles.mb4, titleContainerStyles]}>
                        <Header_1.default title={title} textStyles={titleStyles}/>
                    </react_native_1.View>
                    {typeof prompt === 'string' ? <Text_1.default style={[promptStyles, isCentered ? styles.textAlignCenter : {}]}>{prompt}</Text_1.default> : prompt}
                </react_native_1.View>

                {shouldStackButtons ? (<>
                        {shouldShowCancelButton && shouldReverseStackedButtons && (<Button_1.default style={[styles.mt4, styles.noSelect]} onPress={onCancel} large text={cancelText || translate('common.no')}/>)}
                        <Button_1.default success={success} danger={danger} style={shouldReverseStackedButtons ? styles.mt3 : styles.mt4} onPress={onConfirm} pressOnEnter isPressOnEnterActive={isVisible} large text={confirmText || translate('common.yes')} accessibilityLabel={confirmText || translate('common.yes')} isDisabled={isOffline && shouldDisableConfirmButtonWhenOffline} isLoading={isConfirmLoading}/>
                        {shouldShowCancelButton && !shouldReverseStackedButtons && (<Button_1.default style={[styles.mt3, styles.noSelect]} onPress={onCancel} large text={cancelText || translate('common.no')}/>)}
                    </>) : (<react_native_1.View style={[styles.flexRow, styles.gap4]}>
                        {shouldShowCancelButton && (<Button_1.default style={[styles.noSelect, styles.flex1]} onPress={onCancel} text={cancelText || translate('common.no')}/>)}
                        <Button_1.default success={success} danger={danger} style={[styles.flex1]} onPress={onConfirm} pressOnEnter isPressOnEnterActive={isVisible} text={confirmText || translate('common.yes')} isDisabled={isOffline && shouldDisableConfirmButtonWhenOffline} isLoading={isConfirmLoading}/>
                    </react_native_1.View>)}
            </react_native_1.View>
        </>);
}
ConfirmContent.displayName = 'ConfirmContent';
exports.default = ConfirmContent;
