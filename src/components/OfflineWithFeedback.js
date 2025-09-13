"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const mapChildrenFlat_1 = require("@libs/mapChildrenFlat");
const shouldRenderOffscreen_1 = require("@libs/shouldRenderOffscreen");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CustomStylesForChildrenProvider_1 = require("./CustomStylesForChildrenProvider");
const ErrorMessageRow_1 = require("./ErrorMessageRow");
const ImageSVG_1 = require("./ImageSVG");
function OfflineWithFeedback({ pendingAction, canDismissError = true, contentContainerStyle, errorRowStyles, errors, needsOffscreenAlphaCompositing = false, onClose = () => { }, shouldDisableOpacity = false, shouldDisableStrikeThrough = false, shouldHideOnDelete = true, shouldShowErrorMessages = true, style, shouldDisplayErrorAbove = false, shouldForceOpacity = false, dismissError = () => { }, ...rest }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const hasErrors = !(0, EmptyObject_1.isEmptyObject)(errors ?? {});
    const isOfflinePendingAction = !!isOffline && !!pendingAction;
    const isUpdateOrDeleteError = hasErrors && (pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
    const isAddError = hasErrors && pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD;
    const needsOpacity = (!shouldDisableOpacity && ((isOfflinePendingAction && !isUpdateOrDeleteError) || isAddError)) || shouldForceOpacity;
    const needsStrikeThrough = !shouldDisableStrikeThrough && isOffline && pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    const hideChildren = shouldHideOnDelete && !isOffline && pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE && !hasErrors;
    let children = rest.children;
    /**
     * This method applies the strikethrough to all the children passed recursively
     */
    const applyStrikeThrough = (0, react_1.useCallback)((childrenProp) => {
        const strikeThroughChildren = (0, mapChildrenFlat_1.default)(childrenProp, (child) => {
            if (!react_1.default.isValidElement(child) || child.type === ImageSVG_1.default) {
                return child;
            }
            const childProps = child.props;
            const props = {
                style: StyleUtils.combineStyles(childProps.style ?? [], styles.offlineFeedback.deleted, styles.userSelectNone),
            };
            if (childProps.children) {
                props.children = applyStrikeThrough(childProps.children);
            }
            return react_1.default.cloneElement(child, props);
        });
        return strikeThroughChildren;
    }, [StyleUtils, styles]);
    // Apply strikethrough to children if needed, but skip it if we are not going to render them
    if (needsStrikeThrough && !hideChildren) {
        children = applyStrikeThrough(children);
    }
    return (<react_native_1.View style={style}>
            {shouldShowErrorMessages && shouldDisplayErrorAbove && (<ErrorMessageRow_1.default errors={errors} errorRowStyles={errorRowStyles} onClose={onClose} canDismissError={canDismissError} dismissError={dismissError}/>)}
            {!hideChildren && (<react_native_1.View style={[needsOpacity ? styles.offlineFeedback.pending : styles.offlineFeedback.default, contentContainerStyle]} needsOffscreenAlphaCompositing={shouldRenderOffscreen_1.default ? needsOpacity && needsOffscreenAlphaCompositing : undefined}>
                    <CustomStylesForChildrenProvider_1.default style={needsStrikeThrough ? [styles.offlineFeedback.deleted, styles.userSelectNone] : null}>{children}</CustomStylesForChildrenProvider_1.default>
                </react_native_1.View>)}
            {shouldShowErrorMessages && !shouldDisplayErrorAbove && (<ErrorMessageRow_1.default errors={errors} errorRowStyles={errorRowStyles} onClose={onClose} canDismissError={canDismissError} dismissError={dismissError}/>)}
        </react_native_1.View>);
}
OfflineWithFeedback.displayName = 'OfflineWithFeedback';
exports.default = OfflineWithFeedback;
