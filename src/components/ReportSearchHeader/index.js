"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarWithDisplayName_1 = require("@components/AvatarWithDisplayName");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ReportSearchHeader({ report, style, transactions, avatarBorderColor }) {
    const styles = (0, useThemeStyles_1.default)();
    const middleContent = (0, react_1.useMemo)(() => {
        return (<AvatarWithDisplayName_1.default shouldDisplayStatus report={report} transactions={transactions} shouldUseCustomSearchTitleName shouldEnableDetailPageNavigation={false} shouldEnableAvatarNavigation={false} avatarBorderColor={avatarBorderColor}/>);
    }, [report, transactions, avatarBorderColor]);
    return (<react_native_1.View dataSet={{ dragArea: false }} style={[style, styles.reportSearchHeaderBar]}>
            <react_native_1.View style={[styles.dFlex, styles.flexRow, styles.alignItemsCenter, styles.flexGrow1, styles.justifyContentBetween, styles.overflowHidden]}>{middleContent}</react_native_1.View>
        </react_native_1.View>);
}
ReportSearchHeader.displayName = 'ReportSearchHeader';
exports.default = ReportSearchHeader;
