"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const isIllustrationLottieAnimation_1 = require("@libs/isIllustrationLottieAnimation");
const Button_1 = require("./Button");
const FixedFooter_1 = require("./FixedFooter");
const ImageSVG_1 = require("./ImageSVG");
const Lottie_1 = require("./Lottie");
const LottieAnimations_1 = require("./LottieAnimations");
const Text_1 = require("./Text");
function ConfirmationPage({ illustration = LottieAnimations_1.default.Fireworks, heading, description, descriptionComponent, cta, ctaComponent, buttonText = '', onButtonPress = () => { }, shouldShowButton = false, secondaryButtonText = '', onSecondaryButtonPress = () => { }, shouldShowSecondaryButton = false, headingStyle, illustrationStyle, descriptionStyle, ctaStyle, footerStyle, containerStyle, innerContainerStyle, }) {
    const styles = (0, useThemeStyles_1.default)();
    const isLottie = (0, isIllustrationLottieAnimation_1.default)(illustration);
    return (<react_native_1.View style={[styles.flex1, containerStyle]}>
            <react_native_1.View style={[styles.screenCenteredContainer, styles.alignItemsCenter, innerContainerStyle]}>
                {isLottie ? (<Lottie_1.default source={illustration} autoPlay loop style={[styles.confirmationAnimation, illustrationStyle]} webStyle={{
                width: react_native_1.StyleSheet.flatten(illustrationStyle)?.width ?? styles.confirmationAnimation.width,
                height: react_native_1.StyleSheet.flatten(illustrationStyle)?.height ?? styles.confirmationAnimation.height,
            }}/>) : (<react_native_1.View style={[styles.confirmationAnimation, illustrationStyle]}>
                        <ImageSVG_1.default src={illustration} contentFit="contain"/>
                    </react_native_1.View>)}
                <Text_1.default style={[styles.textHeadline, styles.textAlignCenter, styles.mv2, headingStyle]}>{heading}</Text_1.default>
                {!!descriptionComponent && descriptionComponent}
                {!!description && <Text_1.default style={[styles.textAlignCenter, descriptionStyle, styles.w100]}>{description}</Text_1.default>}
                {cta ? <Text_1.default style={[styles.textAlignCenter, ctaStyle]}>{cta}</Text_1.default> : null}
                {!!ctaComponent && ctaComponent}
            </react_native_1.View>
            {(shouldShowSecondaryButton || shouldShowButton) && (<FixedFooter_1.default style={footerStyle}>
                    {shouldShowSecondaryButton && (<Button_1.default large text={secondaryButtonText} testID="confirmation-secondary-button" style={styles.mt3} onPress={onSecondaryButtonPress}/>)}
                    {shouldShowButton && (<Button_1.default success large text={buttonText} testID="confirmation-primary-button" style={styles.mt3} pressOnEnter onPress={onButtonPress}/>)}
                </FixedFooter_1.default>)}
        </react_native_1.View>);
}
ConfirmationPage.displayName = 'ConfirmationPage';
exports.default = ConfirmationPage;
