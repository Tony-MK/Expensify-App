"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports
const sizing_1 = require("@styles/utils/sizing");
// eslint-disable-next-line no-restricted-imports
const spacing_1 = require("@styles/utils/spacing");
const CONST_1 = require("@src/CONST");
const componentsSpacing = {
    flatListStyle: [spacing_1.default.mhn4],
    wrapperStyle: spacing_1.default.p4,
    contentContainerStyle: spacing_1.default.gap4,
};
const NEXT_TRANSACTION_PEEK = 32;
const CAROUSEL_MAX_WIDTH_WIDE = CONST_1.default.REPORT.CAROUSEL_MAX_WIDTH_WIDE;
const TRANSACTION_WIDTH_WIDE = CONST_1.default.REPORT.TRANSACTION_PREVIEW.CAROUSEL.MIN_WIDE_WIDTH;
const CAROUSEL_ONE_SIDE_PADDING = componentsSpacing.wrapperStyle.padding;
const CAROUSEL_GAP = spacing_1.default.gap2.gap;
const getPeek = (isSingleTransaction) => {
    return isSingleTransaction ? CAROUSEL_ONE_SIDE_PADDING : NEXT_TRANSACTION_PEEK;
};
const mobileStyle = (currentWidth, transactionsCount) => {
    const transactionPreviewWidth = currentWidth - CAROUSEL_ONE_SIDE_PADDING - getPeek(transactionsCount === 1);
    return {
        transactionPreviewCarouselStyle: { width: transactionPreviewWidth, maxWidth: transactionPreviewWidth },
        transactionPreviewStandaloneStyle: { ...sizing_1.default.w100, ...sizing_1.default.mw100 },
        componentStyle: [sizing_1.default.mw100, sizing_1.default.w100],
        expenseCountVisible: false,
    };
};
const desktopStyle = (currentWrapperWidth, transactionsCount) => {
    const minimalWrapperWidth = TRANSACTION_WIDTH_WIDE + CAROUSEL_ONE_SIDE_PADDING + getPeek(transactionsCount < 2);
    const transactionPreviewWidth = currentWrapperWidth - CAROUSEL_ONE_SIDE_PADDING - getPeek(transactionsCount < 2);
    const spaceForTransactions = Math.max(transactionsCount, 1);
    const carouselExactMaxWidth = Math.min(minimalWrapperWidth + (TRANSACTION_WIDTH_WIDE + CAROUSEL_GAP) * (spaceForTransactions - 1), CAROUSEL_MAX_WIDTH_WIDE);
    return {
        transactionPreviewCarouselStyle: { width: currentWrapperWidth > minimalWrapperWidth || currentWrapperWidth === 0 ? TRANSACTION_WIDTH_WIDE : transactionPreviewWidth },
        transactionPreviewStandaloneStyle: { width: `min(100%, ${TRANSACTION_WIDTH_WIDE}px)`, maxWidth: `min(100%, ${TRANSACTION_WIDTH_WIDE}px)` },
        componentStyle: [{ maxWidth: `min(${carouselExactMaxWidth}px, 100%)` }, { width: currentWrapperWidth > minimalWrapperWidth ? 'min-content' : '100%' }],
        expenseCountVisible: transactionPreviewWidth >= TRANSACTION_WIDTH_WIDE,
    };
};
const getMoneyRequestReportPreviewStyle = (shouldUseNarrowLayout, transactionsCount, currentWidth, currentWrapperWidth) => ({
    ...componentsSpacing,
    ...(shouldUseNarrowLayout ? mobileStyle(currentWidth ?? 256, transactionsCount) : desktopStyle(currentWrapperWidth ?? 1000, transactionsCount)),
});
exports.default = getMoneyRequestReportPreviewStyle;
