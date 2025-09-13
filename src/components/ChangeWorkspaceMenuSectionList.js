"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const convertToLTR_1 = require("@libs/convertToLTR");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const RenderHTML_1 = require("./RenderHTML");
const changeWorkspaceMenuSections = [
    {
        icon: Illustrations.FolderOpen,
        titleTranslationKey: 'iou.changePolicyEducational.reCategorize',
    },
    {
        icon: Illustrations.Workflows,
        titleTranslationKey: 'iou.changePolicyEducational.workflows',
    },
];
function ChangeWorkspaceMenuSectionList() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<>
            {changeWorkspaceMenuSections.map((section) => (<react_native_1.View key={section.titleTranslationKey} style={[styles.flexRow, styles.alignItemsCenter, styles.mt3]}>
                    <Icon_1.default width={variables_1.default.menuIconSize} height={variables_1.default.menuIconSize} src={section.icon} additionalStyles={[styles.mr4]}/>
                    <react_native_1.View style={[styles.flex1, styles.flexRow, styles.justifyContentCenter, styles.alignItemsCenter, styles.wAuto]}>
                        <RenderHTML_1.default html={`<comment>${(0, convertToLTR_1.default)(translate(section.titleTranslationKey))}</comment>`}/>
                    </react_native_1.View>
                </react_native_1.View>))}
        </>);
}
ChangeWorkspaceMenuSectionList.displayName = 'ChangeWorkspaceMenuSectionList';
exports.default = ChangeWorkspaceMenuSectionList;
