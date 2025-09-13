"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrectStepForSelectedBank = exports.getBankCardDetailsImage = exports.isCurrencySupportedForECards = void 0;
exports.getAssignedCardSortKey = getAssignedCardSortKey;
exports.isExpensifyCard = isExpensifyCard;
exports.getDomainCards = getDomainCards;
exports.formatCardExpiration = formatCardExpiration;
exports.getMonthFromExpirationDateString = getMonthFromExpirationDateString;
exports.getYearFromExpirationDateString = getYearFromExpirationDateString;
exports.maskCard = maskCard;
exports.maskCardNumber = maskCardNumber;
exports.getCardDescription = getCardDescription;
exports.getMCardNumberString = getMCardNumberString;
exports.getTranslationKeyForLimitType = getTranslationKeyForLimitType;
exports.maskPin = maskPin;
exports.getEligibleBankAccountsForCard = getEligibleBankAccountsForCard;
exports.sortCardsByCardholderName = sortCardsByCardholderName;
exports.getCardFeedIcon = getCardFeedIcon;
exports.getBankName = getBankName;
exports.isSelectedFeedExpired = isSelectedFeedExpired;
exports.getCompanyFeeds = getCompanyFeeds;
exports.isCustomFeed = isCustomFeed;
exports.getSelectedFeed = getSelectedFeed;
exports.getPlaidCountry = getPlaidCountry;
exports.getCustomOrFormattedFeedName = getCustomOrFormattedFeedName;
exports.isCardClosed = isCardClosed;
exports.isPlaidSupportedCountry = isPlaidSupportedCountry;
exports.getFilteredCardList = getFilteredCardList;
exports.hasOnlyOneCardToAssign = hasOnlyOneCardToAssign;
exports.checkIfNewFeedConnected = checkIfNewFeedConnected;
exports.getDefaultCardName = getDefaultCardName;
exports.getDomainOrWorkspaceAccountID = getDomainOrWorkspaceAccountID;
exports.mergeCardListWithWorkspaceFeeds = mergeCardListWithWorkspaceFeeds;
exports.isCard = isCard;
exports.getAllCardsForWorkspace = getAllCardsForWorkspace;
exports.isCardHiddenFromSearch = isCardHiddenFromSearch;
exports.getFeedType = getFeedType;
exports.flatAllCardsList = flatAllCardsList;
exports.checkIfFeedConnectionIsBroken = checkIfFeedConnectionIsBroken;
exports.isSmartLimitEnabled = isSmartLimitEnabled;
exports.lastFourNumbersFromCardName = lastFourNumbersFromCardName;
exports.hasIssuedExpensifyCard = hasIssuedExpensifyCard;
exports.isExpensifyCardFullySetUp = isExpensifyCardFullySetUp;
exports.filterInactiveCards = filterInactiveCards;
exports.getFundIdFromSettingsKey = getFundIdFromSettingsKey;
exports.getCardsByCardholderName = getCardsByCardholderName;
exports.filterCardsByPersonalDetails = filterCardsByPersonalDetails;
exports.getCompanyCardDescription = getCompanyCardDescription;
exports.getPlaidInstitutionIconUrl = getPlaidInstitutionIconUrl;
exports.getPlaidInstitutionId = getPlaidInstitutionId;
exports.getFeedConnectionBrokenCard = getFeedConnectionBrokenCard;
exports.getCorrectStepForPlaidSelectedBank = getCorrectStepForPlaidSelectedBank;
exports.getEligibleBankAccountsForUkEuCard = getEligibleBankAccountsForUkEuCard;
const date_fns_1 = require("date-fns");
const groupBy_1 = require("lodash/groupBy");
const expensify_card_svg_1 = require("@assets/images/expensify-card.svg");
const Illustrations = require("@src/components/Icon/Illustrations");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Localize_1 = require("./Localize");
const ObjectUtils_1 = require("./ObjectUtils");
const PersonalDetailsUtils_1 = require("./PersonalDetailsUtils");
const StringUtils_1 = require("./StringUtils");
/**
 * @returns string with a month in MM format
 */
function getMonthFromExpirationDateString(expirationDateString) {
    return expirationDateString.substring(0, 2);
}
/**
 * Sorting logic for assigned cards.
 *
 * Ensure to sort physical Expensify cards first, no matter what their cardIDs are.
 * This way ensures the Expensify Combo Card detail is rendered correctly,
 * because we will always use the cardID of the physical card from the combo card duo.
 *
 * @param card - card to get the sort key for
 * @returns number
 */
function getAssignedCardSortKey(card) {
    if (!isExpensifyCard(card)) {
        return 2;
    }
    return card?.nameValuePairs?.isVirtual ? 1 : 0;
}
/**
 * @param card
 * @returns boolean
 */
function isExpensifyCard(card) {
    if (!card) {
        return false;
    }
    return card.bank === CONST_1.default.EXPENSIFY_CARD.BANK;
}
/**
 * @param card
 * @returns string in format %<bank> - <lastFourPAN || Not Activated>%.
 */
function getCardDescription(card) {
    if (!card) {
        return '';
    }
    const isPlaid = !!getPlaidInstitutionId(card.bank);
    const bankName = isPlaid ? card?.cardName : getBankName(card.bank);
    const cardDescriptor = card.state === CONST_1.default.EXPENSIFY_CARD.STATE.NOT_ACTIVATED ? (0, Localize_1.translateLocal)('cardTransactions.notActivated') : card.lastFourPAN;
    const humanReadableBankName = card.bank === CONST_1.default.EXPENSIFY_CARD.BANK ? CONST_1.default.EXPENSIFY_CARD.BANK : bankName;
    return cardDescriptor && !isPlaid ? `${humanReadableBankName} - ${cardDescriptor}` : `${humanReadableBankName}`;
}
/**
 * @param transactionCardName
 * @param cardID
 * @param cards
 * @returns company card name
 */
function getCompanyCardDescription(transactionCardName, cardID, cards) {
    if (!cardID || !cards?.[cardID] || isExpensifyCard(cards[cardID])) {
        return transactionCardName;
    }
    const card = cards[cardID];
    return card.cardName;
}
function isCard(item) {
    return typeof item === 'object' && 'cardID' in item && !!item.cardID && 'bank' in item && !!item.bank;
}
function isCardHiddenFromSearch(card) {
    return !card?.nameValuePairs?.isVirtual && CONST_1.default.EXPENSIFY_CARD.HIDDEN_FROM_SEARCH_STATES.includes(card.state ?? 0);
}
function isCardClosed(card) {
    return card?.state === CONST_1.default.EXPENSIFY_CARD.STATE.CLOSED;
}
function mergeCardListWithWorkspaceFeeds(workspaceFeeds, cardList, shouldExcludeCardHiddenFromSearch = false) {
    const feedCards = {};
    Object.values(cardList ?? {}).forEach((card) => {
        if (!isCard(card) || (shouldExcludeCardHiddenFromSearch && isCardHiddenFromSearch(card))) {
            return;
        }
        feedCards[card.cardID] = card;
    });
    Object.values(workspaceFeeds ?? {}).forEach((currentCardFeed) => {
        Object.values(currentCardFeed ?? {}).forEach((card) => {
            if (!isCard(card) || (shouldExcludeCardHiddenFromSearch && isCardHiddenFromSearch(card))) {
                return;
            }
            feedCards[card.cardID] = card;
        });
    });
    return feedCards;
}
/**
 * @returns string with a year in YY or YYYY format
 */
function getYearFromExpirationDateString(expirationDateString) {
    const stringContainsNumbersOnly = /^\d+$/.test(expirationDateString);
    const cardYear = stringContainsNumbersOnly ? expirationDateString.substring(2) : expirationDateString.substring(3);
    return cardYear.length === 2 ? `20${cardYear}` : cardYear;
}
/**
 * @returns string with a month in MM/YYYY format
 */
function formatCardExpiration(expirationDateString) {
    // already matches MM/YYYY format
    const dateFormat = /^\d{2}\/\d{4}$/;
    if (dateFormat.test(expirationDateString)) {
        return expirationDateString;
    }
    const expirationMonth = getMonthFromExpirationDateString(expirationDateString);
    const expirationYear = getYearFromExpirationDateString(expirationDateString);
    return `${expirationMonth}/${expirationYear}`;
}
/**
 * @param cardList - collection of assigned cards
 * @returns collection of assigned cards grouped by domain
 */
function getDomainCards(cardList) {
    // Check for domainName to filter out personal credit cards.
    const activeCards = Object.values(cardList ?? {}).filter((card) => !!card?.domainName && CONST_1.default.EXPENSIFY_CARD.ACTIVE_STATES.some((element) => element === card.state));
    return (0, groupBy_1.default)(activeCards, (card) => card.domainName);
}
/**
 * Returns a masked credit card string with spaces for every four symbols.
 * If the last four digits are provided, all preceding digits will be masked.
 * If not, the entire card string will be masked.
 *
 * @param [lastFour=""] - The last four digits of the card (optional).
 * @returns - The masked card string.
 */
function maskCard(lastFour = '') {
    const totalDigits = 16;
    const maskedLength = totalDigits - lastFour.length;
    // Create a string with '•' repeated for the masked portion
    const maskedString = '•'.repeat(maskedLength) + lastFour;
    // Insert space for every four symbols
    return maskedString.replace(/(.{4})/g, '$1 ').trim();
}
/**
 * Returns a masked credit card string.
 * Converts given 'X' to '•' for the entire card string.
 *
 * @param cardName - card name with XXXX in the middle.
 * @param feed - card feed.
 * @param showOriginalName - show original card name instead of masked.
 * @returns - The masked card string.
 */
function maskCardNumber(cardName, feed, showOriginalName) {
    if (!cardName || cardName === '') {
        return '';
    }
    const hasSpace = /\s/.test(cardName);
    const maskedString = cardName.replace(/X/g, '•');
    const isAmexBank = [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_DIRECT].some((value) => value === feed);
    if (hasSpace) {
        if (showOriginalName) {
            return cardName;
        }
        return cardName.replace(/ - \d{4}$/, '');
    }
    if (isAmexBank && maskedString.length === 15) {
        return maskedString.replace(/(.{4})(.{6})(.{5})/, '$1 $2 $3');
    }
    return maskedString.replace(/(.{4})/g, '$1 ').trim();
}
/**
 * Returns last 4 number from company card name
 *
 * @param cardName - card name with dash in the middle and 4 numbers in the end.
 * @returns - Last 4 numbers
 */
function lastFourNumbersFromCardName(cardName) {
    const name = cardName ?? '';
    const hasSpace = /\s/.test(name);
    const match = name.match(/(\d{4})$/);
    if (!cardName || cardName === '' || !hasSpace || !match) {
        return '';
    }
    return match[1];
}
function getMCardNumberString(cardNumber) {
    return cardNumber.replace(/\s/g, '');
}
function getTranslationKeyForLimitType(limitType) {
    switch (limitType) {
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART:
            return 'workspace.card.issueNewCard.smartLimit';
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED:
            return 'workspace.card.issueNewCard.fixedAmount';
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY:
            return 'workspace.card.issueNewCard.monthly';
        default:
            return '';
    }
}
function maskPin(pin = '') {
    if (!pin) {
        return '••••';
    }
    return pin;
}
function getEligibleBankAccountsForCard(bankAccountsList) {
    if (!bankAccountsList || (0, EmptyObject_1.isEmptyObject)(bankAccountsList)) {
        return [];
    }
    return Object.values(bankAccountsList).filter((bankAccount) => bankAccount?.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS && bankAccount?.accountData?.allowDebit);
}
function getEligibleBankAccountsForUkEuCard(bankAccountsList, outputCurrency) {
    if (!bankAccountsList || (0, EmptyObject_1.isEmptyObject)(bankAccountsList)) {
        return [];
    }
    return Object.values(bankAccountsList).filter((bankAccount) => bankAccount?.accountData?.type === CONST_1.default.BANK_ACCOUNT.TYPE.BUSINESS &&
        bankAccount?.accountData?.allowDebit &&
        bankAccount?.bankCurrency === outputCurrency &&
        CONST_1.default.EXPENSIFY_UK_EU_SUPPORTED_COUNTRIES.includes(bankAccount?.bankCountry));
}
function getCardsByCardholderName(cardsList, policyMembersAccountIDs) {
    const { cardList, ...cards } = cardsList ?? {};
    return Object.values(cards).filter((card) => card.accountID && policyMembersAccountIDs.includes(card.accountID));
}
function sortCardsByCardholderName(cards, personalDetails, localeCompare) {
    return cards.sort((cardA, cardB) => {
        const userA = cardA.accountID ? (personalDetails?.[cardA.accountID] ?? {}) : {};
        const userB = cardB.accountID ? (personalDetails?.[cardB.accountID] ?? {}) : {};
        const aName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(userA);
        const bName = (0, PersonalDetailsUtils_1.getDisplayNameOrDefault)(userB);
        return localeCompare(aName, bName);
    });
}
function filterCardsByPersonalDetails(card, searchQuery, personalDetails) {
    const normalizedSearchQuery = StringUtils_1.default.normalize(searchQuery.toLowerCase());
    const cardTitle = StringUtils_1.default.normalize(card.nameValuePairs?.cardTitle?.toLowerCase() ?? '');
    const lastFourPAN = StringUtils_1.default.normalize(card?.lastFourPAN?.toLowerCase() ?? '');
    const accountLogin = StringUtils_1.default.normalize(personalDetails?.[card.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.login?.toLowerCase() ?? '');
    const accountName = StringUtils_1.default.normalize(personalDetails?.[card.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID]?.displayName?.toLowerCase() ?? '');
    return (cardTitle.includes(normalizedSearchQuery) ||
        lastFourPAN.includes(normalizedSearchQuery) ||
        accountLogin.includes(normalizedSearchQuery) ||
        accountName.includes(normalizedSearchQuery));
}
function getCardFeedIcon(cardFeed, illustrations) {
    const feedIcons = {
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: Illustrations.VisaCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX]: Illustrations.AmexCardCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_1205]: Illustrations.AmexCardCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_FILE_DOWNLOAD]: Illustrations.AmexCardCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: Illustrations.MasterCardCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_DIRECT]: Illustrations.AmexCardCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BANK_OF_AMERICA]: Illustrations.BankOfAmericaCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE]: Illustrations.CapitalOneCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE]: Illustrations.ChaseCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CITIBANK]: Illustrations.CitibankCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.WELLS_FARGO]: Illustrations.WellsFargoCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BREX]: Illustrations.BrexCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE]: Illustrations.StripeCompanyCardDetailLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CSV]: illustrations.GenericCSVCompanyCardLarge,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.PEX]: illustrations.GenericCompanyCardLarge,
        [CONST_1.default.EXPENSIFY_CARD.BANK]: expensify_card_svg_1.default,
    };
    if (cardFeed.startsWith(CONST_1.default.EXPENSIFY_CARD.BANK)) {
        return expensify_card_svg_1.default;
    }
    if (feedIcons[cardFeed]) {
        return feedIcons[cardFeed];
    }
    // In existing OldDot setups other variations of feeds could exist, ex: vcf2, vcf3, cdfbmo
    const feedKey = Object.keys(feedIcons).find((feed) => cardFeed.startsWith(feed));
    if (feedKey) {
        return feedIcons[feedKey];
    }
    if (cardFeed.includes(CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CSV)) {
        return illustrations.GenericCSVCompanyCardLarge;
    }
    return illustrations.GenericCompanyCardLarge;
}
/**
 * Verify if the feed is a custom feed. Those are also referred to as commercial feeds.
 */
function isCustomFeed(feed) {
    return [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX].some((value) => feed.startsWith(value));
}
function getCompanyFeeds(cardFeeds, shouldFilterOutRemovedFeeds = false, shouldFilterOutPendingFeeds = false) {
    return Object.fromEntries(Object.entries(cardFeeds?.settings?.companyCards ?? {}).filter(([key, value]) => {
        if (shouldFilterOutRemovedFeeds && value.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE) {
            return false;
        }
        if (shouldFilterOutPendingFeeds && value.pending) {
            return false;
        }
        return key !== CONST_1.default.EXPENSIFY_CARD.BANK;
    }));
}
function getBankName(feedType) {
    const feedNamesMapping = {
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: 'Visa',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: 'Mastercard',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX]: 'American Express',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE]: 'Stripe',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_DIRECT]: 'American Express',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BANK_OF_AMERICA]: 'Bank of America',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE]: 'Capital One',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE]: 'Chase',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CITIBANK]: 'Citibank',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.WELLS_FARGO]: 'Wells Fargo',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BREX]: 'Brex',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CSV]: CONST_1.default.COMPANY_CARDS.CARD_TYPE.CSV,
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_1205]: 'American Express',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_FILE_DOWNLOAD]: 'American Express',
        [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.PEX]: 'PEX',
    };
    // In existing OldDot setups other variations of feeds could exist, ex: vcf2, vcf3, oauth.americanexpressfdx.com 2003
    const feedKey = Object.keys(feedNamesMapping).find((feed) => feedType.startsWith(feed));
    if (feedType.includes(CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CSV)) {
        return CONST_1.default.COMPANY_CARDS.CARD_TYPE.CSV;
    }
    if (!feedKey) {
        return '';
    }
    return feedNamesMapping[feedKey];
}
const getBankCardDetailsImage = (bank, illustrations) => {
    const iconMap = {
        [CONST_1.default.COMPANY_CARDS.BANKS.AMEX]: Illustrations.AmexCardCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.BANK_OF_AMERICA]: Illustrations.BankOfAmericaCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.CAPITAL_ONE]: Illustrations.CapitalOneCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.CHASE]: Illustrations.ChaseCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.CITI_BANK]: Illustrations.CitibankCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.WELLS_FARGO]: Illustrations.WellsFargoCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.BREX]: Illustrations.BrexCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.STRIPE]: Illustrations.StripeCompanyCardDetail,
        [CONST_1.default.COMPANY_CARDS.BANKS.OTHER]: illustrations.GenericCompanyCard,
    };
    return iconMap[bank];
};
exports.getBankCardDetailsImage = getBankCardDetailsImage;
function getCustomOrFormattedFeedName(feed, companyCardNicknames, shouldAddCardsSuffix = true) {
    if (!feed) {
        return;
    }
    const customFeedName = companyCardNicknames?.[feed];
    if (customFeedName && typeof customFeedName !== 'string') {
        return '';
    }
    const feedName = getBankName(feed);
    const formattedFeedName = shouldAddCardsSuffix ? (0, Localize_1.translateLocal)('workspace.companyCards.feedName', { feedName }) : feedName;
    // Custom feed name can be empty. Fallback to default feed name
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return customFeedName || formattedFeedName;
}
function getPlaidInstitutionIconUrl(feedName) {
    const institutionId = getPlaidInstitutionId(feedName);
    if (!institutionId) {
        return '';
    }
    return `${CONST_1.default.COMPANY_CARD_PLAID}${institutionId}.png`;
}
function getPlaidInstitutionId(feedName) {
    const feed = feedName?.split('.');
    if (!feed || feed?.at(0) !== CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID) {
        return '';
    }
    return feed.at(1);
}
function isPlaidSupportedCountry(selectedCountry) {
    if (!selectedCountry) {
        return false;
    }
    return CONST_1.default.PLAID_SUPPORT_COUNTRIES.includes(selectedCountry);
}
function getDomainOrWorkspaceAccountID(workspaceAccountID, cardFeedData) {
    return cardFeedData?.domainID ?? workspaceAccountID;
}
function getPlaidCountry(outputCurrency, currencyList, countryByIp) {
    const selectedCurrency = outputCurrency ? currencyList?.[outputCurrency] : null;
    const countries = selectedCurrency?.countries;
    if (outputCurrency === CONST_1.default.CURRENCY.EUR) {
        if (countryByIp && countries?.includes(countryByIp)) {
            return countryByIp;
        }
        return '';
    }
    const country = countries?.[0];
    return country ?? '';
}
// We will simplify the logic below once we have #50450 #50451 implemented
const getCorrectStepForSelectedBank = (selectedBank) => {
    const banksWithFeedType = [
        CONST_1.default.COMPANY_CARDS.BANKS.BANK_OF_AMERICA,
        CONST_1.default.COMPANY_CARDS.BANKS.CAPITAL_ONE,
        CONST_1.default.COMPANY_CARDS.BANKS.CHASE,
        CONST_1.default.COMPANY_CARDS.BANKS.CITI_BANK,
        CONST_1.default.COMPANY_CARDS.BANKS.WELLS_FARGO,
    ];
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.STRIPE) {
        return CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS;
    }
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.AMEX) {
        return CONST_1.default.COMPANY_CARDS.STEP.AMEX_CUSTOM_FEED;
    }
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.BREX) {
        return CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION;
    }
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER) {
        return CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE;
    }
    if (banksWithFeedType.includes(selectedBank)) {
        return CONST_1.default.COMPANY_CARDS.STEP.SELECT_FEED_TYPE;
    }
    return CONST_1.default.COMPANY_CARDS.STEP.CARD_TYPE;
};
exports.getCorrectStepForSelectedBank = getCorrectStepForSelectedBank;
function getCorrectStepForPlaidSelectedBank(selectedBank) {
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.STRIPE) {
        return CONST_1.default.COMPANY_CARDS.STEP.CARD_INSTRUCTIONS;
    }
    if (selectedBank === CONST_1.default.COMPANY_CARDS.BANKS.OTHER) {
        return CONST_1.default.COMPANY_CARDS.STEP.PLAID_CONNECTION;
    }
    return CONST_1.default.COMPANY_CARDS.STEP.BANK_CONNECTION;
}
function getSelectedFeed(lastSelectedFeed, cardFeeds) {
    const defaultFeed = Object.keys(getCompanyFeeds(cardFeeds, true)).at(0);
    return lastSelectedFeed ?? defaultFeed;
}
function isSelectedFeedExpired(directFeed) {
    if (!directFeed || !directFeed.expiration) {
        return false;
    }
    return (0, date_fns_1.isBefore)((0, date_fns_1.fromUnixTime)(directFeed.expiration), new Date());
}
/** Returns list of cards which can be assigned */
function getFilteredCardList(list, directFeed, workspaceCardFeeds) {
    const { cardList: customFeedCardsToAssign, ...cards } = list ?? {};
    const assignedCards = Object.values(cards).map((card) => card.cardName);
    // Get cards assigned across all workspaces
    const allWorkspaceAssignedCards = new Set();
    Object.values(workspaceCardFeeds ?? {}).forEach((workspaceCards) => {
        if (!workspaceCards) {
            return;
        }
        const { cardList, ...workspaceCardItems } = workspaceCards;
        Object.values(workspaceCardItems).forEach((card) => {
            if (!card?.cardName) {
                return;
            }
            allWorkspaceAssignedCards.add(card.cardName);
        });
    });
    if (directFeed) {
        const unassignedDirectFeedCards = directFeed.accountList.filter((cardNumber) => !assignedCards.includes(cardNumber) && !allWorkspaceAssignedCards.has(cardNumber));
        return Object.fromEntries(unassignedDirectFeedCards.map((cardNumber) => [cardNumber, cardNumber]));
    }
    return Object.fromEntries(Object.entries(customFeedCardsToAssign ?? {}).filter(([cardNumber]) => !assignedCards.includes(cardNumber) && !allWorkspaceAssignedCards.has(cardNumber)));
}
function hasOnlyOneCardToAssign(list) {
    return Object.keys(list).length === 1;
}
function getDefaultCardName(cardholder) {
    if (!cardholder) {
        return '';
    }
    return `${cardholder}'s card`;
}
function checkIfNewFeedConnected(prevFeedsData, currentFeedsData, plaidBank) {
    const prevFeeds = Object.keys(prevFeedsData);
    const currentFeeds = Object.keys(currentFeedsData);
    return {
        isNewFeedConnected: currentFeeds.length > prevFeeds.length || (plaidBank && currentFeeds.includes(`${CONST_1.default.BANK_ACCOUNT.SETUP_TYPE.PLAID}.${plaidBank}`)),
        newFeed: currentFeeds.find((feed) => !prevFeeds.includes(feed)),
    };
}
function filterInactiveCards(cards) {
    const closedStates = [CONST_1.default.EXPENSIFY_CARD.STATE.CLOSED, CONST_1.default.EXPENSIFY_CARD.STATE.STATE_DEACTIVATED, CONST_1.default.EXPENSIFY_CARD.STATE.STATE_SUSPENDED];
    return (0, ObjectUtils_1.filterObject)(cards ?? {}, (key, card) => !closedStates.includes(card.state));
}
function getAllCardsForWorkspace(workspaceAccountID, allCardList, cardFeeds, expensifyCardSettings) {
    const cards = {};
    const companyCardsDomainFeeds = Object.entries(cardFeeds?.settings?.companyCards ?? {}).map(([feedName, feedData]) => ({ domainID: feedData.domainID, feedName }));
    const expensifyCardsDomainIDs = Object.keys(expensifyCardSettings ?? {})
        .map((key) => key.split('_').at(-1))
        .filter((id) => !!id);
    for (const [key, values] of Object.entries(allCardList ?? {})) {
        const isWorkspaceAccountCards = workspaceAccountID !== CONST_1.default.DEFAULT_NUMBER_ID && key.includes(workspaceAccountID.toString());
        const isCompanyDomainCards = companyCardsDomainFeeds?.some((domainFeed) => domainFeed.domainID && key.includes(domainFeed.domainID.toString()) && key.includes(domainFeed.feedName));
        const isExpensifyDomainCards = expensifyCardsDomainIDs.some((domainID) => key.includes(domainID.toString()) && key.includes(CONST_1.default.EXPENSIFY_CARD.BANK));
        if ((isWorkspaceAccountCards || isCompanyDomainCards || isExpensifyDomainCards) && values) {
            const { cardList, ...rest } = values;
            const filteredCards = filterInactiveCards(rest);
            Object.assign(cards, filteredCards);
        }
    }
    return cards;
}
function isSmartLimitEnabled(cards) {
    return Object.values(cards).some((card) => card.nameValuePairs?.limitType === CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART);
}
const CUSTOM_FEEDS = [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX];
function getFeedType(feedKey, cardFeeds) {
    if (CUSTOM_FEEDS.some((feed) => feed === feedKey)) {
        const filteredFeeds = Object.keys(cardFeeds?.settings?.companyCards ?? {}).filter((str) => str.includes(feedKey));
        const feedNumbers = filteredFeeds.map((str) => parseInt(str.replace(feedKey, ''), 10)).filter(Boolean);
        feedNumbers.sort((a, b) => a - b);
        let firstAvailableNumber = 1;
        for (const num of feedNumbers) {
            if (num && num !== firstAvailableNumber) {
                return `${feedKey}${firstAvailableNumber}`;
            }
            firstAvailableNumber++;
        }
        return `${feedKey}${firstAvailableNumber}`;
    }
    return feedKey;
}
/**
 * Takes the list of cards divided by workspaces and feeds and returns the flattened non-Expensify cards related to the provided workspace
 *
 * @param allCardsList the list where cards split by workspaces and feeds and stored under `card_${workspaceAccountID}_${feedName}` keys
 * @param workspaceAccountID the workspace account id we want to get cards for
 * @param domainIDs the domain ids we want to get cards for
 */
function flatAllCardsList(allCardsList, workspaceAccountID, domainIDs) {
    if (!allCardsList) {
        return;
    }
    return Object.entries(allCardsList).reduce((acc, [key, cards]) => {
        const isWorkspaceAccountCards = key.includes(workspaceAccountID.toString());
        const isDomainCards = domainIDs?.some((domainID) => key.includes(domainID.toString()));
        if ((!isWorkspaceAccountCards && !isDomainCards) || key.includes(CONST_1.default.EXPENSIFY_CARD.BANK)) {
            return acc;
        }
        const { cardList, ...feedCards } = cards ?? {};
        const filteredCards = filterInactiveCards(feedCards);
        Object.assign(acc, filteredCards);
        return acc;
    }, {});
}
/**
 * Check if any card from the provided feed(s) has a broken connection
 *
 * @param feedCards the list of the cards, related to one or several feeds
 * @param [feedToExclude] the feed to ignore during the check, it's useful for checking broken connection error only in the feeds other than the selected one
 */
function checkIfFeedConnectionIsBroken(feedCards, feedToExclude) {
    if (!feedCards || (0, EmptyObject_1.isEmptyObject)(feedCards)) {
        return false;
    }
    return Object.values(feedCards).some((card) => !(0, EmptyObject_1.isEmptyObject)(card) && card.bank !== feedToExclude && card.lastScrapeResult && !CONST_1.default.COMPANY_CARDS.BROKEN_CONNECTION_IGNORED_STATUSES.includes(card.lastScrapeResult));
}
/**
 * Checks if an Expensify Card was issued for a given workspace.
 */
function hasIssuedExpensifyCard(workspaceAccountID, allCardList) {
    const cards = getAllCardsForWorkspace(workspaceAccountID, allCardList);
    return Object.values(cards).some((card) => card.bank === CONST_1.default.EXPENSIFY_CARD.BANK);
}
/**
 * Check if the Expensify Card is fully set up and a new card can be issued
 */
function isExpensifyCardFullySetUp(policy, cardSettings) {
    return !!(policy?.areExpensifyCardsEnabled && cardSettings?.paymentBankAccountID);
}
const isCurrencySupportedForECards = (currency) => {
    if (!currency) {
        return false;
    }
    const supportedCurrencies = [CONST_1.default.CURRENCY.GBP, CONST_1.default.CURRENCY.EUR];
    return supportedCurrencies.includes(currency);
};
exports.isCurrencySupportedForECards = isCurrencySupportedForECards;
function getFundIdFromSettingsKey(key) {
    const prefix = ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS;
    if (!key?.startsWith(prefix)) {
        return CONST_1.default.DEFAULT_NUMBER_ID;
    }
    const fundIDStr = key.substring(prefix.length);
    const fundID = Number(fundIDStr);
    return Number.isNaN(fundID) ? CONST_1.default.DEFAULT_NUMBER_ID : fundID;
}
/**
 * Get card which has a broken connection
 *
 * @param feedCards the list of the cards, related to one or several feeds
 * @param [feedToExclude] the feed to ignore during the check, it's useful for checking broken connection error only in the feeds other than the selected one
 */
function getFeedConnectionBrokenCard(feedCards, feedToExclude) {
    if (!feedCards || (0, EmptyObject_1.isEmptyObject)(feedCards)) {
        return undefined;
    }
    return Object.values(feedCards).find((card) => !(0, EmptyObject_1.isEmptyObject)(card) && card.bank !== feedToExclude && card.lastScrapeResult !== 200);
}
