"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentView_1 = require("@components/Attachments/AttachmentView");
const Button_1 = require("@components/Button");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const SafeAreaConsumer_1 = require("@components/SafeAreaConsumer");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AttachmentModalContext_1 = require("@pages/media/AttachmentModalScreen/AttachmentModalContext");
const CONST_1 = require("@src/CONST");
function CarouselItem({ item, onPress, isFocused, isModalHovered, reportID }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isAttachmentHidden } = (0, react_1.useContext)(AttachmentModalContext_1.default);
    const [isHidden, setIsHidden] = (0, react_1.useState)(() => (item.reportActionID && isAttachmentHidden(item.reportActionID)) ?? item.hasBeenFlagged);
    const renderButton = (style) => (<Button_1.default small style={style} onPress={() => setIsHidden(!isHidden)} testID="moderationButton">
            <Text_1.default style={[styles.buttonSmallText, styles.userSelectNone]} dataSet={{ [CONST_1.default.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true }}>
                {isHidden ? translate('moderation.revealMessage') : translate('moderation.hideMessage')}
            </Text_1.default>
        </Button_1.default>);
    if (isHidden) {
        const children = (<>
                <Text_1.default style={[styles.textLabelSupporting, styles.textAlignCenter, styles.lh20]}>{translate('moderation.flaggedContent')}</Text_1.default>
                {renderButton([styles.mt2])}
            </>);
        return onPress ? (<PressableWithoutFeedback_1.default style={[styles.attachmentRevealButtonContainer]} onPress={onPress} accessibilityRole={CONST_1.default.ROLE.BUTTON} 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        accessibilityLabel={item.file?.name || translate('attachmentView.unknownFilename')}>
                {children}
            </PressableWithoutFeedback_1.default>) : (<react_native_1.View style={[styles.attachmentRevealButtonContainer]}>{children}</react_native_1.View>);
    }
    return (<react_native_1.View style={[styles.flex1]}>
            <react_native_1.View style={[styles.imageModalImageCenterContainer]}>
                <AttachmentView_1.default source={item.source} previewSource={item.previewSource} file={item.file} isAuthTokenRequired={item.isAuthTokenRequired} onPress={onPress} transactionID={item.transactionID} reportActionID={item.reportActionID} isHovered={isModalHovered} isFocused={isFocused} duration={item.duration} fallbackSource={Expensicons.AttachmentNotFound} reportID={reportID}/>
            </react_native_1.View>

            {!!item.hasBeenFlagged && (<SafeAreaConsumer_1.default>
                    {({ safeAreaPaddingBottomStyle }) => <react_native_1.View style={[styles.appBG, safeAreaPaddingBottomStyle]}>{renderButton([styles.m4, styles.alignSelfCenter])}</react_native_1.View>}
                </SafeAreaConsumer_1.default>)}
        </react_native_1.View>);
}
CarouselItem.displayName = 'CarouselItem';
exports.default = CarouselItem;
