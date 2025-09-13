"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const TaskUtils = require("@libs/TaskUtils");
function TaskAction({ action }) {
    const styles = (0, useThemeStyles_1.default)();
    const message = TaskUtils.getTaskReportActionMessage(action);
    return (<react_native_1.View style={[styles.flex1, styles.flexRow, styles.alignItemsCenter, styles.breakWord, styles.preWrap]}>
            {message.html ? (<RenderHTML_1.default html={`<comment><muted-text>${message.html}</muted-text></comment>`}/>) : (<Text_1.default style={[styles.chatItemMessage, styles.colorMuted]}>{message.text}</Text_1.default>)}
        </react_native_1.View>);
}
TaskAction.displayName = 'TaskAction';
exports.default = TaskAction;
