"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_render_html_1 = require("react-native-render-html");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const convertToLTR_1 = require("@libs/convertToLTR");
const FontUtils_1 = require("@styles/utils/FontUtils");
const htmlEngineUtils_1 = require("./htmlEngineUtils");
const HTMLRenderers_1 = require("./HTMLRenderers");
// We are using the explicit composite architecture for performance gains.
// Configuration for RenderHTML is handled in a top-level component providing
// context to RenderHTMLSource components. See https://git.io/JRcZb
// Beware that each prop should be referentially stable between renders to avoid
// costly invalidations and commits.
function BaseHTMLEngineProvider({ textSelectable = false, children, enableExperimentalBRCollapsing = false }) {
    const styles = (0, useThemeStyles_1.default)();
    // Declare nonstandard tags and their content model here
    /* eslint-disable @typescript-eslint/naming-convention */
    const customHTMLElementModels = (0, react_1.useMemo)(() => ({
        edited: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'edited',
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        'task-title': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'task-title',
            contentModel: react_native_render_html_1.HTMLContentModel.block,
            mixedUAStyles: { ...styles.taskTitleMenuItem },
        }),
        'alert-text': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'alert-text',
            mixedUAStyles: { ...styles.formError, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'deleted-action': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'alert-text',
            mixedUAStyles: { ...styles.formError, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        rbr: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'rbr',
            getMixedUAStyles: (tnode) => {
                if (tnode.attributes.issmall === undefined) {
                    return { ...styles.formError, ...styles.mb0 };
                }
                return { ...styles.formError, ...styles.mb0, ...styles.textMicro };
            },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'muted-link': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'muted-link',
            mixedUAStyles: { ...styles.subTextFileUpload, ...styles.textSupporting },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'muted-text': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'muted-text',
            mixedUAStyles: { ...styles.colorMuted, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'muted-text-label': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'muted-text-label',
            mixedUAStyles: { ...styles.mutedNormalTextLabel, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'muted-text-xs': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'muted-text-xs',
            mixedUAStyles: { ...styles.textExtraSmallSupporting, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'muted-text-micro': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'muted-text-micro',
            mixedUAStyles: { ...styles.textMicroSupporting, ...styles.mb0 },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'centered-text': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'centered-text',
            mixedUAStyles: { ...styles.textAlignCenter },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        comment: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'comment',
            getMixedUAStyles: (tnode) => {
                if (tnode.attributes.islarge === undefined) {
                    if (tnode.attributes.center === undefined) {
                        return { whiteSpace: 'pre' };
                    }
                    return { whiteSpace: 'pre', flex: 1, justifyContent: 'center' };
                }
                return { whiteSpace: 'pre', ...styles.onlyEmojisText };
            },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'email-comment': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'email-comment',
            getMixedUAStyles: (tnode) => {
                if (tnode.attributes.islarge === undefined) {
                    return { whiteSpace: 'normal' };
                }
                return { whiteSpace: 'normal', ...styles.onlyEmojisText };
            },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        tooltip: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'tooltip',
            mixedUAStyles: { whiteSpace: 'pre', ...styles.productTrainingTooltipText },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        success: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'success',
            mixedUAStyles: { ...styles.textSuccess },
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        strong: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'strong',
            getMixedUAStyles: (tnode) => ((0, htmlEngineUtils_1.isChildOfTaskTitle)(tnode) ? {} : styles.strong),
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        em: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'em',
            getMixedUAStyles: (tnode) => ((0, htmlEngineUtils_1.isChildOfTaskTitle)(tnode) ? styles.taskTitleMenuItemItalic : styles.em),
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        h1: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'h1',
            getMixedUAStyles: (tnode) => ((0, htmlEngineUtils_1.isChildOfTaskTitle)(tnode) ? {} : styles.h1),
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        'mention-user': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'mention-user', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'mention-report': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'mention-report', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'mention-here': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'mention-here', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'mention-short': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'mention-short', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'concierge-link': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'concierge-link', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'next-step': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'next-step',
            mixedUAStyles: { ...styles.textLabelSupporting, ...styles.lh16 },
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        'next-step-email': react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'next-step-email', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        video: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'video',
            mixedUAStyles: { whiteSpace: 'pre' },
            contentModel: react_native_render_html_1.HTMLContentModel.block,
        }),
        emoji: react_native_render_html_1.HTMLElementModel.fromCustomModel({ tagName: 'emoji', contentModel: react_native_render_html_1.HTMLContentModel.textual }),
        'completed-task': react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'completed-task',
            mixedUAStyles: { ...styles.textSupporting, ...styles.textLineThrough },
            contentModel: react_native_render_html_1.HTMLContentModel.textual,
        }),
        blockquote: react_native_render_html_1.HTMLElementModel.fromCustomModel({
            tagName: 'blockquote',
            contentModel: react_native_render_html_1.HTMLContentModel.block,
            getMixedUAStyles: (tnode) => {
                if (tnode.attributes.isemojisonly === undefined) {
                    return (0, htmlEngineUtils_1.isChildOfTaskTitle)(tnode) ? {} : styles.blockquote;
                }
                return (0, htmlEngineUtils_1.isChildOfTaskTitle)(tnode) ? {} : { ...styles.blockquote, ...styles.onlyEmojisTextLineHeight };
            },
        }),
    }), [
        styles.taskTitleMenuItem,
        styles.formError,
        styles.mb0,
        styles.colorMuted,
        styles.mutedNormalTextLabel,
        styles.productTrainingTooltipText,
        styles.textLabelSupporting,
        styles.lh16,
        styles.textSupporting,
        styles.textLineThrough,
        styles.textMicro,
        styles.onlyEmojisText,
        styles.strong,
        styles.taskTitleMenuItemItalic,
        styles.em,
        styles.h1,
        styles.blockquote,
        styles.onlyEmojisTextLineHeight,
        styles.subTextFileUpload,
        styles.textAlignCenter,
        styles.textSuccess,
        styles.textExtraSmallSupporting,
        styles.textMicroSupporting,
    ]);
    /* eslint-enable @typescript-eslint/naming-convention */
    // We need to memoize this prop to make it referentially stable.
    const defaultTextProps = (0, react_1.useMemo)(() => ({ selectable: textSelectable, allowFontScaling: false, textBreakStrategy: 'simple' }), [textSelectable]);
    const defaultViewProps = { style: [styles.alignItemsStart, styles.userSelectText, styles.mw100] };
    return (<react_native_render_html_1.TRenderEngineProvider customHTMLElementModels={customHTMLElementModels} baseStyle={styles.webViewStyles.baseFontStyle} tagsStyles={styles.webViewStyles.tagStyles} enableCSSInlineProcessing={false} systemFonts={Object.values(FontUtils_1.default.fontFamily.single).map((font) => font.fontFamily)} htmlParserOptions={{
            recognizeSelfClosing: true,
        }} domVisitors={{
            // eslint-disable-next-line no-param-reassign
            onText: (text) => (text.data = (0, convertToLTR_1.default)(text.data)),
        }}>
            <react_native_render_html_1.RenderHTMLConfigProvider defaultTextProps={defaultTextProps} defaultViewProps={defaultViewProps} renderers={HTMLRenderers_1.default} computeEmbeddedMaxWidth={htmlEngineUtils_1.computeEmbeddedMaxWidth} enableExperimentalBRCollapsing={enableExperimentalBRCollapsing}>
                {children}
            </react_native_render_html_1.RenderHTMLConfigProvider>
        </react_native_render_html_1.TRenderEngineProvider>);
}
BaseHTMLEngineProvider.displayName = 'BaseHTMLEngineProvider';
exports.default = BaseHTMLEngineProvider;
