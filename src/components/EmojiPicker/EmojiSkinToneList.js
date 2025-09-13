"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Emojis = require("@assets/emojis");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePreferredEmojiSkinTone_1 = require("@hooks/usePreferredEmojiSkinTone");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const EmojiPickerMenuItem_1 = require("./EmojiPickerMenuItem");
const getSkinToneEmojiFromIndex_1 = require("./getSkinToneEmojiFromIndex");
function EmojiSkinToneList() {
    const styles = (0, useThemeStyles_1.default)();
    const [highlightedIndex, setHighlightedIndex] = (0, react_1.useState)(null);
    const [isSkinToneListVisible, setIsSkinToneListVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const [preferredSkinTone, setPreferredSkinTone] = (0, usePreferredEmojiSkinTone_1.default)();
    const toggleIsSkinToneListVisible = (0, react_1.useCallback)(() => {
        setIsSkinToneListVisible((prev) => !prev);
    }, []);
    /**
     * Set the preferred skin tone in Onyx and close the skin tone picker
     */
    function updateSelectedSkinTone(skinToneEmoji) {
        setHighlightedIndex(skinToneEmoji.skinTone);
        setPreferredSkinTone(skinToneEmoji.skinTone);
    }
    (0, react_1.useEffect)(() => {
        if (!isSkinToneListVisible) {
            return;
        }
        toggleIsSkinToneListVisible();
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- only run when preferredSkinTone updates
    }, [preferredSkinTone]);
    const currentSkinTone = (0, getSkinToneEmojiFromIndex_1.default)(preferredSkinTone);
    (0, react_1.useEffect)(() => {
        setHighlightedIndex(currentSkinTone.skinTone);
    }, [currentSkinTone.skinTone]);
    return (<react_native_1.View style={[styles.flexRow, styles.p3, styles.ph4, styles.emojiPickerContainer]}>
            {!isSkinToneListVisible && (<PressableWithoutFeedback_1.default onPress={toggleIsSkinToneListVisible} style={[styles.flexRow, styles.alignSelfCenter, styles.justifyContentStart, styles.alignItemsCenter]} accessibilityLabel={translate('emojiPicker.skinTonePickerLabel')} role={CONST_1.default.ROLE.BUTTON}>
                    <react_native_1.View style={[styles.emojiItem, styles.wAuto, styles.justifyContentCenter]}>
                        <Text_1.default style={[styles.emojiText, styles.ph2, styles.textNoWrap]}>{currentSkinTone.code}</Text_1.default>
                    </react_native_1.View>
                    <Text_1.default style={[styles.emojiSkinToneTitle]}>{translate('emojiPicker.skinTonePickerLabel')}</Text_1.default>
                </PressableWithoutFeedback_1.default>)}
            {isSkinToneListVisible && (<react_native_1.View style={[styles.flexRow, styles.flex1]}>
                    {Emojis.skinTones.map((skinToneEmoji) => (<EmojiPickerMenuItem_1.default onPress={() => updateSelectedSkinTone(skinToneEmoji)} onHoverIn={() => setHighlightedIndex(skinToneEmoji.skinTone)} onHoverOut={() => setHighlightedIndex(null)} key={skinToneEmoji.code} emoji={skinToneEmoji.code} isHighlighted={skinToneEmoji.skinTone === highlightedIndex || skinToneEmoji.skinTone === currentSkinTone.skinTone}/>))}
                </react_native_1.View>)}
        </react_native_1.View>);
}
EmojiSkinToneList.displayName = 'EmojiSkinToneList';
exports.default = EmojiSkinToneList;
