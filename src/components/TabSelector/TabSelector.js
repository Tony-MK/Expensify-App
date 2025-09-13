"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
var Expensicons = require("@components/Icon/Expensicons");
var useIsResizing_1 = require("@hooks/useIsResizing");
var useLocalize_1 = require("@hooks/useLocalize");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var getBackground_1 = require("./getBackground");
var getOpacity_1 = require("./getOpacity");
var TabSelectorItem_1 = require("./TabSelectorItem");
function getIconTitleAndTestID(route, translate) {
    switch (route) {
        case CONST_1.default.TAB.RECEIPT_PARTNERS.ALL:
            return { title: translate('workspace.receiptPartners.uber.all'), testID: 'all' };
        case CONST_1.default.TAB.RECEIPT_PARTNERS.LINKED:
            return { title: translate('workspace.receiptPartners.uber.linked'), testID: 'linked' };
        case CONST_1.default.TAB.RECEIPT_PARTNERS.OUTSTANDING:
            return { title: translate('workspace.receiptPartners.uber.outstanding'), testID: 'outstanding' };
        case CONST_1.default.TAB_REQUEST.MANUAL:
            return { icon: Expensicons.Pencil, title: translate('tabSelector.manual'), testID: 'manual' };
        case CONST_1.default.TAB_REQUEST.SCAN:
            return { icon: Expensicons.ReceiptScan, title: translate('tabSelector.scan'), testID: 'scan' };
        case CONST_1.default.TAB.NEW_CHAT:
            return { icon: Expensicons.User, title: translate('tabSelector.chat'), testID: 'chat' };
        case CONST_1.default.TAB.NEW_ROOM:
            return { icon: Expensicons.Hashtag, title: translate('tabSelector.room'), testID: 'room' };
        case CONST_1.default.TAB_REQUEST.DISTANCE:
            return { icon: Expensicons.Car, title: translate('common.distance'), testID: 'distance' };
        case CONST_1.default.TAB.SHARE.SHARE:
            return { icon: Expensicons.UploadAlt, title: translate('common.share'), testID: 'share' };
        case CONST_1.default.TAB.SHARE.SUBMIT:
            return { icon: Expensicons.Receipt, title: translate('common.submit'), testID: 'submit' };
        case CONST_1.default.TAB_REQUEST.PER_DIEM:
            return { icon: Expensicons.CalendarSolid, title: translate('common.perDiem'), testID: 'perDiem' };
        case CONST_1.default.TAB_REQUEST.DISTANCE_MAP:
            return { icon: Expensicons.Map, title: translate('tabSelector.map'), testID: 'distanceMap' };
        case CONST_1.default.TAB_REQUEST.DISTANCE_MANUAL:
            return { icon: Expensicons.Pencil, title: translate('tabSelector.manual'), testID: 'distanceManual' };
        default:
            throw new Error("Route ".concat(route, " has no icon nor title set."));
    }
}
function TabSelector(_a) {
    var state = _a.state, navigation = _a.navigation, _b = _a.onTabPress, onTabPress = _b === void 0 ? function () { } : _b, position = _a.position, onFocusTrapContainerElementChanged = _a.onFocusTrapContainerElementChanged, _c = _a.shouldShowLabelWhenInactive, shouldShowLabelWhenInactive = _c === void 0 ? true : _c, _d = _a.shouldShowProductTrainingTooltip, shouldShowProductTrainingTooltip = _d === void 0 ? false : _d, renderProductTrainingTooltip = _a.renderProductTrainingTooltip, _e = _a.equalWidth, equalWidth = _e === void 0 ? false : _e;
    var translate = (0, useLocalize_1.default)().translate;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var defaultAffectedAnimatedTabs = (0, react_1.useMemo)(function () { return Array.from({ length: state.routes.length }, function (v, i) { return i; }); }, [state.routes.length]);
    var _f = (0, react_1.useState)(defaultAffectedAnimatedTabs), affectedAnimatedTabs = _f[0], setAffectedAnimatedTabs = _f[1];
    var viewRef = (0, react_1.useRef)(null);
    var _g = react_1.default.useState(0), selectorWidth = _g[0], setSelectorWidth = _g[1];
    var _h = react_1.default.useState(0), selectorX = _h[0], setSelectorX = _h[1];
    var isResizing = (0, useIsResizing_1.default)();
    (0, react_1.useEffect)(function () {
        // It is required to wait transition end to reset affectedAnimatedTabs because tabs style is still animating during transition.
        setTimeout(function () {
            setAffectedAnimatedTabs(defaultAffectedAnimatedTabs);
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [defaultAffectedAnimatedTabs, state.index]);
    var measure = (0, react_1.useCallback)(function () {
        var _a;
        (_a = viewRef.current) === null || _a === void 0 ? void 0 : _a.measureInWindow(function (x, _y, width) {
            setSelectorX(x);
            setSelectorWidth(width);
        });
    }, [viewRef]);
    (0, react_1.useLayoutEffect)(function () {
        // measure location/width after animation completes
        setTimeout(function () {
            measure();
        }, CONST_1.default.TOOLTIP_ANIMATION_DURATION);
    }, [measure]);
    (0, react_1.useEffect)(function () {
        if (isResizing) {
            return;
        }
        // Re-measure when resizing ends
        // This is necessary to ensure the tooltip is positioned correctly after resizing
        measure();
    }, [measure, isResizing]);
    return (<FocusTrapContainerElement_1.default onContainerElementChanged={onFocusTrapContainerElementChanged}>
            <react_native_1.View style={styles.tabSelector} ref={viewRef}>
                {state.routes.map(function (route, index) {
            var isActive = index === state.index;
            var activeOpacity = (0, getOpacity_1.default)({ routesLength: state.routes.length, tabIndex: index, active: true, affectedTabs: affectedAnimatedTabs, position: position, isActive: isActive });
            var inactiveOpacity = (0, getOpacity_1.default)({ routesLength: state.routes.length, tabIndex: index, active: false, affectedTabs: affectedAnimatedTabs, position: position, isActive: isActive });
            var backgroundColor = (0, getBackground_1.default)({ routesLength: state.routes.length, tabIndex: index, affectedTabs: affectedAnimatedTabs, theme: theme, position: position, isActive: isActive });
            var _a = getIconTitleAndTestID(route.name, translate), icon = _a.icon, title = _a.title, testID = _a.testID;
            var onPress = function () {
                if (isActive) {
                    return;
                }
                setAffectedAnimatedTabs([state.index, index]);
                var event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });
                if (!event.defaultPrevented) {
                    navigation.dispatch(native_1.TabActions.jumpTo(route.name));
                }
                onTabPress(route.name);
            };
            return (<TabSelectorItem_1.default key={route.name} icon={icon} title={title} onPress={onPress} activeOpacity={activeOpacity} inactiveOpacity={inactiveOpacity} backgroundColor={backgroundColor} isActive={isActive} testID={testID} shouldShowLabelWhenInactive={shouldShowLabelWhenInactive} shouldShowProductTrainingTooltip={shouldShowProductTrainingTooltip} renderProductTrainingTooltip={renderProductTrainingTooltip} parentWidth={selectorWidth} parentX={selectorX} equalWidth={equalWidth}/>);
        })}
            </react_native_1.View>
        </FocusTrapContainerElement_1.default>);
}
TabSelector.displayName = 'TabSelector';
exports.default = TabSelector;
