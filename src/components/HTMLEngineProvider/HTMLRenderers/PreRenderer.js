"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HTMLEngineUtils = require("@components/HTMLEngineProvider/htmlEngineUtils");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
function PreRenderer({ TDefaultRenderer, onPressIn, onPressOut, onLongPress, ...defaultRendererProps }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isLast = defaultRendererProps.renderIndex === defaultRendererProps.renderLength - 1;
    const isChildOfTaskTitle = HTMLEngineUtils.isChildOfTaskTitle(defaultRendererProps.tnode);
    const isInsideTaskTitle = HTMLEngineUtils.isChildOfTaskTitle(defaultRendererProps.tnode);
    const fontSize = StyleUtils.getCodeFontSize(false, isInsideTaskTitle);
    if (isChildOfTaskTitle) {
        return (<TDefaultRenderer 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...defaultRendererProps} style={styles.taskTitleMenuItem}/>);
    }
    return (<react_native_1.View style={isLast ? styles.mt2 : styles.mv2}>
            <ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
                {({ onShowContextMenu, anchor, report, isReportArchived, action, checkIfContextMenuActive, isDisabled, shouldDisplayContextMenu }) => (<PressableWithoutFeedback_1.default onPress={onPressIn ?? (() => { })} onPressIn={onPressIn} onPressOut={onPressOut} onLongPress={(event) => {
                onShowContextMenu(() => {
                    if (isDisabled || !shouldDisplayContextMenu) {
                        return;
                    }
                    return (0, ShowContextMenuContext_1.showContextMenuForReport)(event, anchor, report?.reportID, action, checkIfContextMenuActive, (0, ReportUtils_1.isArchivedNonExpenseReport)(report, isReportArchived));
                });
            }} shouldUseHapticsOnLongPress role={CONST_1.default.ROLE.PRESENTATION} accessibilityLabel={translate('accessibilityHints.preStyledText')}>
                        <react_native_1.View>
                            <Text_1.default style={{ fontSize }}>
                                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                                <TDefaultRenderer {...defaultRendererProps}/>
                            </Text_1.default>
                        </react_native_1.View>
                    </PressableWithoutFeedback_1.default>)}
            </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
        </react_native_1.View>);
}
PreRenderer.displayName = 'PreRenderer';
exports.default = PreRenderer;
