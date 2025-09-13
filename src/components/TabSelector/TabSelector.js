"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
const Expensicons = require("@components/Icon/Expensicons");
const useIsResizing_1 = require("@hooks/useIsResizing");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const getBackground_1 = require("./getBackground");
const getOpacity_1 = require("./getOpacity");
const TabSelectorItem_1 = require("./TabSelectorItem");
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
            throw new Error(`Route ${route} has no icon nor title set.`);
    }
}
function TabSelector({ state, navigation, onTabPress = () => { }, position, onFocusTrapContainerElementChanged, shouldShowLabelWhenInactive = true, shouldShowProductTrainingTooltip = false, renderProductTrainingTooltip, equalWidth = false, }) {
    const { translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const defaultAffectedAnimatedTabs = (0, react_1.useMemo)(() => Array.from({ length: state.routes.length }, (v, i) => i), [state.routes.length]);
    const [affectedAnimatedTabs, setAffectedAnimatedTabs] = (0, react_1.useState)(defaultAffectedAnimatedTabs);
    const viewRef = (0, react_1.useRef)(null);
    const [selectorWidth, setSelectorWidth] = react_1.default.useState(0);
    const [selectorX, setSelectorX] = react_1.default.useState(0);
    const isResizing = (0, useIsResizing_1.default)();
    (0, react_1.useEffect)(() => {
        // It is required to wait transition end to reset affectedAnimatedTabs because tabs style is still animating during transition.
        setTimeout(() => {
            setAffectedAnimatedTabs(defaultAffectedAnimatedTabs);
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [defaultAffectedAnimatedTabs, state.index]);
    const measure = (0, react_1.useCallback)(() => {
        viewRef.current?.measureInWindow((x, _y, width) => {
            setSelectorX(x);
            setSelectorWidth(width);
        });
    }, [viewRef]);
    (0, react_1.useLayoutEffect)(() => {
        // measure location/width after animation completes
        setTimeout(() => {
            measure();
        }, CONST_1.default.TOOLTIP_ANIMATION_DURATION);
    }, [measure]);
    (0, react_1.useEffect)(() => {
        if (isResizing) {
            return;
        }
        // Re-measure when resizing ends
        // This is necessary to ensure the tooltip is positioned correctly after resizing
        measure();
    }, [measure, isResizing]);
    return (<FocusTrapContainerElement_1.default onContainerElementChanged={onFocusTrapContainerElementChanged}>
            <react_native_1.View style={styles.tabSelector} ref={viewRef}>
                {state.routes.map((route, index) => {
            const isActive = index === state.index;
            const activeOpacity = (0, getOpacity_1.default)({ routesLength: state.routes.length, tabIndex: index, active: true, affectedTabs: affectedAnimatedTabs, position, isActive });
            const inactiveOpacity = (0, getOpacity_1.default)({ routesLength: state.routes.length, tabIndex: index, active: false, affectedTabs: affectedAnimatedTabs, position, isActive });
            const backgroundColor = (0, getBackground_1.default)({ routesLength: state.routes.length, tabIndex: index, affectedTabs: affectedAnimatedTabs, theme, position, isActive });
            const { icon, title, testID } = getIconTitleAndTestID(route.name, translate);
            const onPress = () => {
                if (isActive) {
                    return;
                }
                setAffectedAnimatedTabs([state.index, index]);
                const event = navigation.emit({
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
