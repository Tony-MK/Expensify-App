"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Text_1 = require("@components/Text");
const Tooltip_1 = require("@components/Tooltip");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportUtils_1 = require("@libs/ReportUtils");
const DisplayNamesTooltipItem_1 = require("./DisplayNamesTooltipItem");
function DisplayNamesWithToolTip({ shouldUseFullTitle, fullTitle, displayNamesWithTooltips, shouldAddEllipsis = false, textStyles = [], numberOfLines = 1, renderAdditionalText, forwardedFSClass, }) {
    const styles = (0, useThemeStyles_1.default)();
    const containerRef = (0, react_1.useRef)(null);
    const childRefs = (0, react_1.useRef)([]);
    // eslint-disable-next-line react-compiler/react-compiler
    const isEllipsisActive = !!containerRef.current?.offsetWidth && !!containerRef.current?.scrollWidth && containerRef.current.offsetWidth < containerRef.current.scrollWidth;
    /**
     * We may need to shift the Tooltip horizontally as some of the inline text wraps well with ellipsis,
     * but their container node overflows the parent view which causes the tooltip to be misplaced.
     *
     * So we shift it by calculating it as follows:
     * 1. We get the container layout and take the Child inline text node.
     * 2. Now we get the tooltip original position.
     * 3. If inline node's right edge is overflowing the container's right edge, we set the tooltip to the center
     * of the distance between the left edge of the inline node and right edge of the container.
     * @param index Used to get the Ref to the node at the current index
     * @returns Distance to shift the tooltip horizontally
     */
    const getTooltipShiftX = (0, react_1.useCallback)((index) => {
        // Only shift the tooltip in case the containerLayout or Refs to the text node are available
        if (!containerRef.current || index < 0 || !childRefs.current.at(index)) {
            return 0;
        }
        const { width: containerWidth, left: containerLeft } = containerRef.current.getBoundingClientRect();
        // We have to return the value as Number so we can't use `measureWindow` which takes a callback
        const { width: textNodeWidth, left: textNodeLeft } = childRefs.current.at(index)?.getBoundingClientRect() ?? { width: 0, left: 0 };
        const tooltipX = textNodeWidth / 2 + textNodeLeft;
        const containerRight = containerWidth + containerLeft;
        const textNodeRight = textNodeWidth + textNodeLeft;
        const newToolX = textNodeLeft + (containerRight - textNodeLeft) / 2;
        // When text right end is beyond the Container right end
        return textNodeRight > containerRight ? -(tooltipX - newToolX) : 0;
    }, []);
    return (
    // Tokenization of string only support prop numberOfLines on Web
    <Text_1.default style={[textStyles, styles.pRelative]} numberOfLines={numberOfLines || undefined} ref={containerRef} testID={DisplayNamesWithToolTip.displayName} fsClass={forwardedFSClass}>
            {shouldUseFullTitle
            ? (0, ReportUtils_1.formatReportLastMessageText)(fullTitle)
            : displayNamesWithTooltips?.map(({ displayName, accountID, avatar, login }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <react_1.Fragment key={index}>
                          <DisplayNamesTooltipItem_1.default index={index} getTooltipShiftX={getTooltipShiftX} accountID={accountID} displayName={displayName} login={login} avatar={avatar} textStyles={textStyles} childRefs={childRefs} forwardedFSClass={forwardedFSClass}/>
                          {index < displayNamesWithTooltips.length - 1 && <Text_1.default style={textStyles}>,&nbsp;</Text_1.default>}
                          {shouldAddEllipsis && index === displayNamesWithTooltips.length - 1 && <Text_1.default style={textStyles}>...</Text_1.default>}
                      </react_1.Fragment>))}
            {renderAdditionalText?.()}
            {!!isEllipsisActive && (<react_native_1.View style={styles.displayNameTooltipEllipsis}>
                    <Tooltip_1.default text={fullTitle}>
                        {/* There is some Gap for real ellipsis so we are adding 4 `.` to cover */}
                        <Text_1.default>....</Text_1.default>
                    </Tooltip_1.default>
                </react_native_1.View>)}
        </Text_1.default>);
}
DisplayNamesWithToolTip.displayName = 'DisplayNamesWithTooltip';
exports.default = DisplayNamesWithToolTip;
