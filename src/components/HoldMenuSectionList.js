"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const Text_1 = require("./Text");
const holdMenuSections = [
    {
        icon: Illustrations.Stopwatch,
        titleTranslationKey: 'iou.holdIsLeftBehind',
    },
    {
        icon: Illustrations.RealtimeReport,
        titleTranslationKey: 'iou.unholdWhenReady',
    },
];
function HoldMenuSectionList() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<>
            {holdMenuSections.map((section) => (<react_native_1.View key={section.titleTranslationKey} style={[styles.flexRow, styles.alignItemsCenter, styles.mt5]}>
                    <Icon_1.default width={variables_1.default.menuIconSize} height={variables_1.default.menuIconSize} src={section.icon} additionalStyles={[styles.mr4]}/>
                    <react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
                        <Text_1.default style={[styles.textStrong, styles.mb1]}>{translate(section.titleTranslationKey)}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>))}
        </>);
}
HoldMenuSectionList.displayName = 'HoldMenuSectionList';
exports.default = HoldMenuSectionList;
