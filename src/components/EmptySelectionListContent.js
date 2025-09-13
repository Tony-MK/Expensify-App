"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const BlockingView_1 = require("./BlockingViews/BlockingView");
const Illustrations = require("./Icon/Illustrations");
const ScrollView_1 = require("./ScrollView");
const Text_1 = require("./Text");
const CONTENT_TYPES = [CONST_1.default.IOU.TYPE.CREATE, CONST_1.default.IOU.TYPE.SUBMIT];
function isContentType(contentType) {
    return CONTENT_TYPES.includes(contentType);
}
function EmptySelectionListContent({ contentType }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (!isContentType(contentType)) {
        return null;
    }
    const translationKeyContentType = CONST_1.default.IOU.TYPE.CREATE;
    const EmptySubtitle = <Text_1.default style={[styles.textAlignCenter]}>{translate(`emptyList.${translationKeyContentType}.subtitleText`)}</Text_1.default>;
    return (<ScrollView_1.default contentContainerStyle={[styles.flexGrow1]}>
            <react_native_1.View style={[styles.flex1, styles.overflowHidden, styles.minHeight65]}>
                <BlockingView_1.default icon={Illustrations.ToddWithPhones} iconWidth={variables_1.default.emptySelectionListIconWidth} iconHeight={variables_1.default.emptySelectionListIconHeight} title={translate(`emptyList.${translationKeyContentType}.title`)} CustomSubtitle={EmptySubtitle} containerStyle={[styles.mb8, styles.ph15]}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
EmptySelectionListContent.displayName = 'EmptySelectionListContent';
exports.default = EmptySelectionListContent;
