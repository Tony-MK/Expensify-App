"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const Button_1 = require("@components/Button");
const FlatList_1 = require("@components/FlatList");
const Expensicons = require("@components/Icon/Expensicons");
const Image_1 = require("@components/Image");
const Pressable_1 = require("@components/Pressable");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SubmitButtonShadow_1 = require("./SubmitButtonShadow");
function ReceiptPreviews({ submit, isMultiScanEnabled }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { windowWidth } = (0, useWindowDimensions_1.default)();
    const isPreviewsVisible = (0, react_native_reanimated_1.useSharedValue)(false);
    const previewsHeight = styles.receiptPlaceholder.height + styles.pv2.paddingVertical * 2;
    const previewItemWidth = styles.receiptPlaceholder.width + styles.receiptPlaceholder.marginRight;
    const initialReceiptsAmount = (0, react_1.useMemo)(() => (windowWidth - styles.ph4.paddingHorizontal * 2 - styles.singleAvatarMedium.width) / previewItemWidth, [windowWidth, styles, previewItemWidth]);
    const [optimisticTransactionsReceipts] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT, {
        selector: (items) => Object.values(items ?? {})
            .map((transaction) => (transaction?.receipt ? { ...transaction?.receipt, transactionID: transaction.transactionID } : undefined))
            .filter((receipt) => !!receipt),
        canBeMissing: true,
    });
    const receipts = (0, react_1.useMemo)(() => {
        if (optimisticTransactionsReceipts && optimisticTransactionsReceipts.length >= initialReceiptsAmount) {
            return optimisticTransactionsReceipts;
        }
        const receiptsWithPlaceholders = [...(optimisticTransactionsReceipts ?? [])];
        while (receiptsWithPlaceholders.length < initialReceiptsAmount) {
            receiptsWithPlaceholders.push(undefined);
        }
        return receiptsWithPlaceholders;
    }, [initialReceiptsAmount, optimisticTransactionsReceipts]);
    const isScrollEnabled = optimisticTransactionsReceipts ? optimisticTransactionsReceipts.length >= receipts.length : false;
    const flatListRef = (0, react_1.useRef)(null);
    const receiptsPhotosLength = optimisticTransactionsReceipts?.length ?? 0;
    const previousReceiptsPhotosLength = (0, usePrevious_1.default)(receiptsPhotosLength);
    (0, react_1.useEffect)(() => {
        if (isMultiScanEnabled) {
            isPreviewsVisible.set(true);
        }
        else {
            isPreviewsVisible.set(false);
        }
    }, [isMultiScanEnabled, isPreviewsVisible]);
    (0, react_1.useEffect)(() => {
        const hasRemovedReceipt = receiptsPhotosLength < previousReceiptsPhotosLength;
        if (hasRemovedReceipt) {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
    }, [receiptsPhotosLength, previousReceiptsPhotosLength]);
    (0, react_1.useEffect)(() => {
        const shouldScrollToReceipt = receiptsPhotosLength && receiptsPhotosLength > previousReceiptsPhotosLength && receiptsPhotosLength > Math.floor(initialReceiptsAmount);
        if (!shouldScrollToReceipt) {
            return;
        }
        flatListRef.current?.scrollToIndex({ index: receiptsPhotosLength - 1 });
    }, [receiptsPhotosLength, previousReceiptsPhotosLength, initialReceiptsAmount]);
    const renderItem = ({ item }) => {
        if (!item) {
            return <react_native_1.View style={styles.receiptPlaceholder}/>;
        }
        return (<Pressable_1.PressableWithFeedback accessible accessibilityLabel={translate('common.receipt')} accessibilityRole={CONST_1.default.ROLE.BUTTON} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_RECEIPT_VIEW.getRoute(item.transactionID, Navigation_1.default.getActiveRoute()))}>
                <Image_1.default source={{ uri: item.source }} style={[styles.receiptPlaceholder, styles.overflowHidden]} loadingIconSize="small" loadingIndicatorStyles={styles.bgTransparent}/>
            </Pressable_1.PressableWithFeedback>);
    };
    const slideInStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        return {
            height: (0, react_native_reanimated_1.withTiming)(isPreviewsVisible.get() ? previewsHeight : 0, {
                duration: 300,
            }),
        };
    });
    const submitReceipts = () => {
        const transactionReceipts = (optimisticTransactionsReceipts ?? []).filter((receipt) => !!receipt.source);
        submit(transactionReceipts);
    };
    return (<react_native_reanimated_1.default.View style={slideInStyle}>
            <react_native_1.View style={styles.pr4}>
                <FlatList_1.default ref={flatListRef} data={receipts} horizontal keyExtractor={(_, index) => index.toString()} renderItem={renderItem} getItemLayout={(data, index) => ({ length: previewItemWidth, offset: previewItemWidth * index, index })} style={styles.pv2} scrollEnabled={isScrollEnabled} showsHorizontalScrollIndicator={false} contentContainerStyle={[{ paddingRight: styles.singleAvatarMedium.width }, styles.pl4]}/>
                <SubmitButtonShadow_1.default>
                    <Button_1.default large isDisabled={!optimisticTransactionsReceipts?.length} innerStyles={[styles.singleAvatarMedium, styles.bgGreenSuccess]} icon={Expensicons.ArrowRight} iconFill={theme.white} onPress={submitReceipts}/>
                </SubmitButtonShadow_1.default>
            </react_native_1.View>
        </react_native_reanimated_1.default.View>);
}
exports.default = ReceiptPreviews;
