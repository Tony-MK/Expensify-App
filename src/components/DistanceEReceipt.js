"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const eReceipt_background_svg_1 = require("@assets/images/eReceipt_background.svg");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ReceiptUtils_1 = require("@libs/ReceiptUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const ImageSVG_1 = require("./ImageSVG");
const PendingMapView_1 = require("./MapView/PendingMapView");
const ReceiptImage_1 = require("./ReceiptImage");
const ScrollView_1 = require("./ScrollView");
const Text_1 = require("./Text");
function DistanceEReceipt({ transaction, hoverPreview = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const thumbnail = (0, TransactionUtils_1.hasReceipt)(transaction) ? (0, ReceiptUtils_1.getThumbnailAndImageURIs)(transaction).thumbnail : null;
    const { amount: transactionAmount, currency: transactionCurrency, merchant: transactionMerchant, created: transactionDate } = (0, ReportUtils_1.getTransactionDetails)(transaction) ?? {};
    const formattedTransactionAmount = (0, CurrencyUtils_1.convertToDisplayString)(transactionAmount, transactionCurrency);
    const thumbnailSource = (0, tryResolveUrlFromApiRoot_1.default)(thumbnail ?? '');
    const waypoints = (0, react_1.useMemo)(() => transaction?.comment?.waypoints ?? {}, [transaction?.comment?.waypoints]);
    const sortedWaypoints = (0, react_1.useMemo)(() => 
    // The waypoint keys are sometimes out of order
    Object.keys(waypoints)
        .sort((keyA, keyB) => (0, TransactionUtils_1.getWaypointIndex)(keyA) - (0, TransactionUtils_1.getWaypointIndex)(keyB))
        .map((key) => ({ [key]: waypoints[key] }))
        .reduce((result, obj) => (obj ? Object.assign(result, obj) : result), {}), [waypoints]);
    return (<react_native_1.View style={[styles.flex1, styles.alignItemsCenter, hoverPreview && styles.mhv5]}>
            <ScrollView_1.default style={styles.w100} contentContainerStyle={[styles.flexGrow1, styles.justifyContentCenter, styles.alignItemsCenter]}>
                <react_native_1.View style={styles.eReceiptPanel}>
                    <ImageSVG_1.default src={eReceipt_background_svg_1.default} style={styles.eReceiptBackground} pointerEvents="none"/>

                    <react_native_1.View style={[styles.moneyRequestViewImage, styles.mh0, styles.mt0, styles.mb5, styles.borderNone]}>
                        {(0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction) || !thumbnailSource ? (<PendingMapView_1.default />) : (<ReceiptImage_1.default source={thumbnailSource} shouldUseThumbnailImage shouldUseInitialObjectPosition isAuthTokenRequired/>)}
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mb10, styles.gap5, styles.ph2, styles.flexColumn, styles.alignItemsCenter]}>
                        {transactionAmount !== null && transactionAmount !== undefined && <Text_1.default style={styles.eReceiptAmount}>{formattedTransactionAmount}</Text_1.default>}
                        <Text_1.default style={styles.eReceiptMerchant}>{transactionMerchant !== translate('iou.fieldPending') ? transactionMerchant : transaction.merchant}</Text_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.mb10, styles.gap5, styles.ph2]}>
                        {Object.entries(sortedWaypoints).map(([key, waypoint]) => {
            const index = (0, TransactionUtils_1.getWaypointIndex)(key);
            let descriptionKey = 'distance.waypointDescription.stop';
            if (index === 0) {
                descriptionKey = 'distance.waypointDescription.start';
            }
            return (<react_native_1.View style={styles.gap1} key={key}>
                                    <Text_1.default style={styles.eReceiptWaypointTitle}>{translate(descriptionKey)}</Text_1.default>
                                    {!!waypoint?.name && <Text_1.default style={styles.eReceiptWaypointAddress}>{waypoint.name}</Text_1.default>}
                                    {!!waypoint?.address && <Text_1.default style={styles.eReceiptGuaranteed}>{waypoint.address}</Text_1.default>}
                                </react_native_1.View>);
        })}
                        <react_native_1.View style={styles.gap1}>
                            <Text_1.default style={styles.eReceiptWaypointTitle}>{translate('common.date')}</Text_1.default>
                            <Text_1.default style={styles.eReceiptWaypointAddress}>{transactionDate}</Text_1.default>
                        </react_native_1.View>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.ph2, styles.flexRow, styles.justifyContentBetween, styles.alignItemsCenter]}>
                        <Icon_1.default width={86} height={19.25} src={Expensicons.ExpensifyWordmark}/>

                        <Text_1.default style={styles.eReceiptGuaranteed}>{translate('eReceipt.guaranteed')}</Text_1.default>
                    </react_native_1.View>
                </react_native_1.View>
            </ScrollView_1.default>
        </react_native_1.View>);
}
DistanceEReceipt.displayName = 'DistanceEReceipt';
exports.default = DistanceEReceipt;
