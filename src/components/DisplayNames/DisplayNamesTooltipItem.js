"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Text_1 = require("@components/Text");
const UserDetailsTooltip_1 = require("@components/UserDetailsTooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function DisplayNamesTooltipItem({ index = 0, getTooltipShiftX = () => 0, accountID = 0, avatar = '', login = '', displayName = '', textStyles = [], childRefs = { current: [] }, forwardedFSClass, }) {
    const styles = (0, useThemeStyles_1.default)();
    const tooltipIndexBridge = (0, react_1.useCallback)(() => getTooltipShiftX(index), [getTooltipShiftX, index]);
    return (<UserDetailsTooltip_1.default key={index} accountID={accountID} fallbackUserDetails={{
            avatar,
            login,
            displayName,
        }} shiftHorizontal={tooltipIndexBridge}>
            {/* We need to get the refs to all the names which will be used to correct the horizontal position of the tooltip */}
            <Text_1.default ref={(el) => {
            if (!childRefs.current?.at(index) || !el) {
                return;
            }
            // eslint-disable-next-line react-compiler/react-compiler, no-param-reassign
            childRefs.current[index] = el;
        }} style={[textStyles, styles.pre]} fsClass={forwardedFSClass}>
                {displayName}
            </Text_1.default>
        </UserDetailsTooltip_1.default>);
}
DisplayNamesTooltipItem.displayName = 'DisplayNamesTooltipItem';
exports.default = DisplayNamesTooltipItem;
