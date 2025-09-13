"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable react/jsx-props-no-spreading */
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmedRoute_1 = require("@components/ConfirmedRoute");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFocus_1 = require("@components/Pressable/PressableWithoutFocus");
const ReceiptImage_1 = require("@components/ReceiptImage");
const ShowContextMenuContext_1 = require("@components/ShowContextMenuContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
/**
 * An image with an optional thumbnail that fills its parent container. If the thumbnail is passed,
 * we try to resolve both the image and thumbnail from the API. Similar to ImageRenderer, we show
 * and optional preview modal as well.
 */
function ReportActionItemImage({ thumbnail, isThumbnail, image, enablePreviewModal = false, transaction, isLocalFile = false, isEmptyReceipt = false, fileExtension, filename, isSingleImage = true, readonly = false, shouldMapHaveBorderRadius, isFromReviewDuplicates = false, mergeTransactionID, onPress, shouldUseFullHeight, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const isMapDistanceRequest = !!transaction && (0, TransactionUtils_1.isDistanceRequest)(transaction) && !(0, TransactionUtils_1.isManualDistanceRequest)(transaction);
    const hasPendingWaypoints = transaction && (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction);
    const hasErrors = !(0, EmptyObject_1.isEmptyObject)(transaction?.errors) || !(0, EmptyObject_1.isEmptyObject)(transaction?.errorFields?.route) || !(0, EmptyObject_1.isEmptyObject)(transaction?.errorFields?.waypoints);
    const showMapAsImage = isMapDistanceRequest && (hasErrors || hasPendingWaypoints);
    if (showMapAsImage) {
        return (<react_native_1.View style={[styles.w100, styles.h100]}>
                <ConfirmedRoute_1.default transaction={transaction} isSmallerIcon={!isSingleImage} shouldHaveBorderRadius={shouldMapHaveBorderRadius} interactive={false} requireRouteToDisplayMap/>
            </react_native_1.View>);
    }
    const attachmentModalSource = (0, tryResolveUrlFromApiRoot_1.default)(image ?? '');
    const thumbnailSource = (0, tryResolveUrlFromApiRoot_1.default)(thumbnail ?? '');
    const isEReceipt = transaction && !(0, TransactionUtils_1.hasReceiptSource)(transaction) && (0, TransactionUtils_1.hasEReceipt)(transaction);
    let propsObj;
    if (isEReceipt) {
        propsObj = { isEReceipt: true, transactionID: transaction.transactionID, iconSize: isSingleImage ? 'medium' : 'small' };
    }
    else if (thumbnail && !isLocalFile) {
        propsObj = {
            shouldUseThumbnailImage: true,
            source: thumbnailSource,
            fallbackIcon: Expensicons.Receipt,
            fallbackIconSize: isSingleImage ? variables_1.default.iconSizeSuperLarge : variables_1.default.iconSizeExtraLarge,
            isAuthTokenRequired: true,
            shouldUseInitialObjectPosition: isMapDistanceRequest,
        };
    }
    else if (isLocalFile && filename && expensify_common_1.Str.isPDF(filename) && typeof attachmentModalSource === 'string') {
        propsObj = { isPDFThumbnail: true, source: attachmentModalSource };
    }
    else {
        propsObj = {
            isThumbnail,
            ...(isThumbnail && { iconSize: (isSingleImage ? 'medium' : 'small'), fileExtension }),
            shouldUseThumbnailImage: true,
            isAuthTokenRequired: false,
            source: thumbnail ?? image ?? '',
            shouldUseInitialObjectPosition: isMapDistanceRequest,
            isEmptyReceipt,
            onPress,
        };
    }
    propsObj.isPerDiemRequest = (0, TransactionUtils_1.isPerDiemRequest)(transaction);
    if (enablePreviewModal) {
        return (<ShowContextMenuContext_1.ShowContextMenuContext.Consumer>
                {({ report, transactionThreadReport }) => (<PressableWithoutFocus_1.default style={[styles.w100, styles.h100, styles.noOutline]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.TRANSACTION_RECEIPT.getRoute(transactionThreadReport?.reportID ?? report?.reportID, transaction?.transactionID, readonly, isFromReviewDuplicates, mergeTransactionID))} accessibilityLabel={translate('accessibilityHints.viewAttachment')} accessibilityRole={CONST_1.default.ROLE.BUTTON}>
                        <ReceiptImage_1.default {...propsObj}/>
                    </PressableWithoutFocus_1.default>)}
            </ShowContextMenuContext_1.ShowContextMenuContext.Consumer>);
    }
    return (<ReceiptImage_1.default {...propsObj} shouldUseFullHeight={shouldUseFullHeight} thumbnailContainerStyles={styles.thumbnailImageContainerHover}/>);
}
ReportActionItemImage.displayName = 'ReportActionItemImage';
exports.default = ReportActionItemImage;
