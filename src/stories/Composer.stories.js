"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = Default;
// eslint-disable-next-line no-restricted-imports
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Composer_1 = require("@components/Composer");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const withNavigationFallback_1 = require("@components/withNavigationFallback");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
// eslint-disable-next-line no-restricted-imports
const theme_1 = require("@styles/theme");
const styles_1 = require("@src/styles");
const ComposerWithNavigation = (0, withNavigationFallback_1.default)(Composer_1.default);
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/Composer',
    component: ComposerWithNavigation,
};
const parser = new expensify_common_1.ExpensiMark();
const DEFAULT_VALUE = `Composer can do the following:

     * It can contain MD e.g. *bold* _italic_
     * Supports Pasted Images via Ctrl+V`;
function Default(props) {
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [pastedFile, setPastedFile] = (0, react_1.useState)(null);
    const [comment, setComment] = (0, react_1.useState)(DEFAULT_VALUE);
    const renderedHTML = parser.replace(comment ?? '');
    const [selection, setSelection] = (0, react_1.useState)(() => ({ start: DEFAULT_VALUE.length, end: DEFAULT_VALUE.length, positionX: 0, positionY: 0 }));
    return (<react_native_1.View>
            <react_native_1.View style={[styles_1.defaultStyles.border, styles_1.defaultStyles.p4]}>
                <ComposerWithNavigation 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} multiline value={comment} onChangeText={setComment} onPasteFile={setPastedFile} selection={selection} onSelectionChange={(e) => {
            setSelection(e.nativeEvent.selection);
        }} style={[styles_1.defaultStyles.textInputCompose, styles_1.defaultStyles.w100, styles_1.defaultStyles.verticalAlignTop]}/>
            </react_native_1.View>
            <react_native_1.View style={[styles_1.defaultStyles.flexRow, styles_1.defaultStyles.mv5, styles_1.defaultStyles.flexWrap, styles_1.defaultStyles.w100]}>
                <react_native_1.View style={[styles_1.defaultStyles.border, styles_1.defaultStyles.noLeftBorderRadius, styles_1.defaultStyles.noRightBorderRadius, styles_1.defaultStyles.p5, styles_1.defaultStyles.flex1]}>
                    <Text_1.default style={[styles_1.defaultStyles.mb2, styles_1.defaultStyles.textLabelSupporting]}>Entered Comment (Drop Enabled)</Text_1.default>
                    <Text_1.default>{comment}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles_1.defaultStyles.p5, styles_1.defaultStyles.borderBottom, styles_1.defaultStyles.borderRight, styles_1.defaultStyles.borderTop, styles_1.defaultStyles.flex1]}>
                    <Text_1.default style={[styles_1.defaultStyles.mb2, styles_1.defaultStyles.textLabelSupporting]}>Rendered Comment</Text_1.default>
                    {!!renderedHTML && <RenderHTML_1.default html={renderedHTML}/>}
                    {!!pastedFile && pastedFile instanceof File && (<react_native_1.View style={styles_1.defaultStyles.mv3}>
                            <react_native_1.Image source={{ uri: URL.createObjectURL(pastedFile) }} resizeMode="contain" style={StyleUtils.getWidthAndHeightStyle(250, 250)}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
Default.args = {
    autoFocus: true,
    placeholder: 'Compose Text Here',
    placeholderTextColor: theme_1.defaultTheme.placeholderText,
    isDisabled: false,
    maxLines: 16,
};
exports.default = story;
